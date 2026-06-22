# backend/routes/session.py
import subprocess
import tempfile
import os
import time
from fastapi import APIRouter, BackgroundTasks
from firebase_admin import firestore
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from jobs.pipeline import run_pipeline
router = APIRouter()

# ── Request / Response models ──────────────────────────────────

class RunCodeRequest(BaseModel):
    code:      str
    language:  str = 'python'   # only python for now
    sessionId: Optional[str] = None

class RunCodeResponse(BaseModel):
    stdout:    str
    stderr:    str
    exitCode:  int
    tookMs:    int             # execution time in milliseconds

class SubmitSessionRequest(BaseModel):
    sessionId:   str
    studentId:   str
    programId:   str


# ── Sandboxed Python runner ─────────────────────────────────────

def run_python_sandboxed(code: str, timeout: int = 10) -> dict:
    with tempfile.NamedTemporaryFile(
        mode='w',
        suffix='.py',
        delete=False,
        encoding='utf-8'
    ) as f:
        f.write(code)
        tmp_path = f.name

    start = time.time()

    try:
        result = subprocess.run(
            ['python', tmp_path],
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        took_ms = int((time.time() - start) * 1000)
        return {
            'stdout':   result.stdout[:5000],
            'stderr':   result.stderr[:2000],
            'exitCode': result.returncode,
            'tookMs':   took_ms,
        }

    except subprocess.TimeoutExpired:
        took_ms = int((time.time() - start) * 1000)
        return {
            'stdout':   '',
            'stderr':   f'TimeoutError: Code ran for more than {timeout} seconds.',
            'exitCode': 1,
            'tookMs':   took_ms,
        }

    except Exception as e:
        return {
            'stdout':   '',
            'stderr':   f'Execution error: {str(e)}',
            'exitCode': 1,
            'tookMs':   0,
        }

    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


# ── Routes ─────────────────────────────────────────────────────

@router.post('/session/run', response_model=RunCodeResponse)
def run_code(req: RunCodeRequest):
    if req.language != 'python':
        return RunCodeResponse(
            stdout='', stderr='Only Python is supported.',
            exitCode=1, tookMs=0
        )
    result = run_python_sandboxed(req.code)
    return RunCodeResponse(**result)


@router.post("/session/submit")
def submit_session(
    req: SubmitSessionRequest,
    background_tasks: BackgroundTasks,
):
    """
    Called when student finishes the quiz.
    Marks session as submitted and queues the ML pipeline
    as a background task — returns immediately to the student.
    """
    try:
        print(f"[Submit] Received submission for session: {req.sessionId}")
        
        # Update status in Firestore immediately
        db = firestore.client()
        db.collection('sessions').document(req.sessionId).update({
            'status': 'submitted'
        })
        
        print(f"[Submit] Session {req.sessionId} marked as submitted in Firestore")
        
        # Run pipeline in background — student doesn't wait for this
        background_tasks.add_task(run_pipeline, req.sessionId)
        
        print(f"[Submit] Pipeline queued for session: {req.sessionId}")
        
        return {
            'status':  'submitted',
            'message': 'Session received. Report will be ready within 45 minutes.'
        }
    
    except Exception as e:
        print(f"[Submit] ERROR: {str(e)}")
        raise