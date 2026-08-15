// frontend/src/services/api.js
// Reads VITE_API_BASE_URL from environment variables in production, or defaults to '/api' for Vite dev proxy
const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api'

export async function submitSession(sessionData) {
  const res = await fetch(`${API_BASE}/session/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  })
  if (!res.ok) throw new Error('Failed to submit session')
  return res.json()
}

export async function runCode(code, language) {
  const res = await fetch(`${API_BASE}/session/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  })
  if (!res.ok) throw new Error('Code execution failed')
  return res.json()
}

export async function getHint(programId, programTitle, programDesc, concepts, userCode, hintNumber) {
  const res = await fetch(`${API_BASE}/hints/ask`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      programId,
      programTitle,
      programDesc,
      concepts,
      userCode,
      hintNumber
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Failed to get hint')
  }
  return res.json()   // { hint: string, hintsRemaining: number }
}

export async function generateQuiz(programTitle, programDesc, concepts, studentCode) {
  const res = await fetch(`${API_BASE}/quiz/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      programTitle,
      programDesc,
      concepts,
      studentCode
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Quiz generation failed')
  }
  return res.json()   // { questions: [...] }
}

// Day 8: Run code against test cases
export async function runTests(code, testCases) {
  const res = await fetch(`${API_BASE}/session/run-tests`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: 'python', testCases })
  })
  if (!res.ok) throw new Error('Test run failed')
  return res.json()   // { results: [...], passedCount, totalCount }
}

// Day 9: Generate animated logic explainer
export async function generateExplainer(programTitle, programDesc, concepts) {
  const res = await fetch(`${API_BASE}/explainer/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programTitle, programDesc, concepts })
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()   // { steps: [...] }
}

// Day 9: Ask chatbot about program logic
export async function askChatbot(programTitle, programDesc, concepts, history, question) {
  const res = await fetch(`${API_BASE}/chatbot/ask`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programTitle, programDesc, concepts, history, question })
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()   // { answer: string }
}

// Generate flowchart: Get flowchart nodes for visual flow simulator
export async function generateFlowchart(programTitle, programDesc, concepts, starterCode) {
  const res = await fetch(`${API_BASE}/explainer/flowchart`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programTitle, programDesc, concepts, starterCode })
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()   // { nodes: [...], variables: [...] }
}

// Fetch program submission statistics and DICE model evaluation reports
export async function getProgramSubmissionsReport(programId) {
  const res = await fetch(`${API_BASE}/reports/program/${programId}/submissions`)
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()
}

// Trigger DICE report evaluation pipeline for a program on demand
export async function generateProgramReport(programId) {
  const res = await fetch(`${API_BASE}/reports/program/${programId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()
}
