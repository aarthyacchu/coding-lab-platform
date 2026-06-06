// frontend/src/services/api.js
// Base URL is /api — Vite proxies this to http://localhost:8000
const BASE = '/api'

export async function getPrograms() {
  const res = await fetch(`${BASE}/programs`)
  if (!res.ok) throw new Error('Failed to fetch programs')
  return res.json()
}

export async function submitSession(sessionData) {
  const res = await fetch(`${BASE}/session/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData)
  })
  if (!res.ok) throw new Error('Failed to submit session')
  return res.json()
}

export async function runCode(code, language) {
  const res = await fetch(`${BASE}/session/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  })
  if (!res.ok) throw new Error('Code execution failed')
  return res.json()
}

export async function getHint(programId, userCode) {
  const res = await fetch(`${BASE}/hints/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programId, userCode })
  })
  if (!res.ok) throw new Error('Failed to get hint')
  return res.json()
}