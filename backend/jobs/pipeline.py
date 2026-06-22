# backend/jobs/pipeline.py
import os
import asyncio
from groq import Groq
import firebase_admin
from firebase_admin import firestore
from dotenv import load_dotenv

from ml.model import predict_and_explain
from analysis.plagiarism import check_plagiarism

load_dotenv()

groq_client = Groq(api_key=os.environ.get('GROQ_API_KEY'))


def get_groq_summary(prompt: str) -> str:
    """Call Groq to convert ML analysis into plain-English teacher summary."""
    try:
        completion = groq_client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'user', 'content': prompt}],
            max_tokens=200,
            temperature=0.4,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f'Summary unavailable: {str(e)}'


def run_pipeline(session_id: str):
    """
    Full post-submission pipeline.
    Called in a background thread after student submits.

    Steps:
    1. Fetch session from Firestore
    2. Run ML analysis (predict_and_explain)
    3. Run plagiarism check against same-program submissions
    4. Call Groq to generate plain-English teacher summary
    5. Write complete report back to Firestore
    """
    db = firestore.client()

    print(f'[Pipeline] Starting for session: {session_id}')

    try:
        # ── Step 1: Fetch session ──────────────────────────────
        session_ref = db.collection('sessions').document(session_id)
        session_doc = session_ref.get()

        if not session_doc.exists:
            print(f'[Pipeline] Session not found: {session_id}')
            return

        session = session_doc.to_dict()
        program_id = session.get('programId')

        # Mark as processing so teacher dashboard shows 'Processing'
        session_ref.update({'status': 'processing'})

        # ── Step 2: ML analysis ───────────────────────────────
        print(f'[Pipeline] Running ML analysis...')
        ml_result = predict_and_explain(session)

        # ── Step 3: Plagiarism check ──────────────────────────
        print(f'[Pipeline] Running plagiarism check...')
        plagiarism_result = {'plagiarismScore': 0, 'plagiarismFlagged': False, 'matches': []}

        try:
            # Fetch all other submitted sessions for the same program
            other_sessions = db.collection('sessions') \
                .where('programId', '==', program_id) \
                .where('status', 'in', ['submitted', 'complete']) \
                .get()

            other_submissions = []
            for doc in other_sessions:
                data = doc.to_dict()
                if data.get('finalCode') and doc.id != session_id:
                    other_submissions.append({
                        'sessionId': doc.id,
                        'studentId': data.get('studentId', ''),
                        'code':      data.get('finalCode', ''),
                    })

            if other_submissions:
                plagiarism_result = check_plagiarism(
                    target_code=session.get('finalCode', ''),
                    target_id=session_id,
                    other_submissions=other_submissions,
                )
        except Exception as e:
            print(f'[Pipeline] Plagiarism check failed (non-critical): {e}')

        # ── Step 4: Groq plain-English summary ────────────────
        print(f'[Pipeline] Generating Groq teacher summary...')
        teacher_summary = get_groq_summary(ml_result['groqPrompt'])

        # ── Step 5: Write report back to Firestore ────────────
        print(f'[Pipeline] Writing report to Firestore...')
        session_ref.update({
            'status': 'complete',
            'report': {
                'performanceTier':   ml_result['performanceTier'],
                'confidence':        ml_result['confidence'],
                'diceChanges':       ml_result['diceChanges'],
                'errorTags':         ml_result['errorTags'],
                'quizAnalysis':      ml_result['quizAnalysis'],
                'dominantWeakness':  ml_result['dominantWeakness'],
                'teacherSummary':    teacher_summary,
                'plagiarismScore':   plagiarism_result['plagiarismScore'],
                'plagiarismFlagged': plagiarism_result['plagiarismFlagged'],
                'plagiarismMatches': plagiarism_result['matches'],
            },
            'flagged': plagiarism_result['plagiarismFlagged'],
        })

        print(f'[Pipeline] Complete for session: {session_id}')

    except Exception as e:
        print(f'[Pipeline] FAILED for {session_id}: {e}')
        # Mark as failed so teacher knows — don't leave it stuck in 'processing'
        try:
            db.collection('sessions').document(session_id).update({
                'status': 'pipeline_error',
                'pipelineError': str(e),
            })
        except Exception:
            pass