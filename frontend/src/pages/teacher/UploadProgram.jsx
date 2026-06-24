// frontend/src/pages/teacher/UploadProgram.jsx
import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { db } from '../../services/firebase'
import Navbar from '../../components/Navbar'
import { Plus, Trash2, ChevronLeft } from 'lucide-react'

const SUBJECTS    = ['Python Basics', 'Data Structures', 'Algorithms', 'OOP Concepts']
const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical']
const YEARS       = [1, 2, 3, 4]

function buildClassId(department, year, section) {
  const deptCode = department.split(' ').map(w => w[0]).join('').toUpperCase()
  return `${deptCode}-${year}-${section}`
}

export default function UploadProgram() {
  const navigate = useNavigate()
  const user = getAuth().currentUser

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [subject,     setSubject]     = useState(SUBJECTS[0])
  const [difficulty,  setDifficulty]  = useState('easy')
  const [concepts,    setConcepts]    = useState('')
  const [starterCode, setStarterCode] = useState('')
  const [department,  setDepartment]  = useState(DEPARTMENTS[0])
  const [year,        setYear]        = useState(YEARS[0])
  const [section,     setSection]     = useState('A')
  const [hintLimit,   setHintLimit]   = useState(3)
  const [testCases,   setTestCases]   = useState([
    { label: 'Basic case', input: '', expectedOutput: '' }
  ])
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  function updateTestCase(index, field, value) {
    setTestCases(prev => prev.map((tc, i) =>
      i === index ? { ...tc, [field]: value } : tc
    ))
  }

  function addTestCase() {
    setTestCases(prev => [
      ...prev,
      { label: `Test ${prev.length + 1}`, input: '', expectedOutput: '' }
    ])
  }

  function removeTestCase(index) {
    if (testCases.length === 1) return   // always keep at least one
    setTestCases(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!title || !description) {
      setError('Title and description are required.')
      return
    }
    const incompleteTest = testCases.some(tc => !tc.expectedOutput.trim())
    if (incompleteTest) {
      setError('Every test case needs an expected output.')
      return
    }

    setSaving(true)
    try {
      await addDoc(collection(db, 'programs'), {
        title,
        description,
        subject,
        language:    'python',
        difficulty,
        concepts:    concepts.split(',').map(c => c.trim()).filter(Boolean),
        hintLimit:   Number(hintLimit),
        active:      true,
        starterCode: starterCode || '# your code here',
        classId:     buildClassId(department, year, section),
        createdBy:   user.uid,
        testCases,
      })

      navigate('/teacher/dashboard')

    } catch (err) {
      setError('Failed to save program. ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} role='teacher' />
      <main className='max-w-2xl mx-auto px-4 py-8'>

        <button
          onClick={() => navigate('/teacher/dashboard')}
          className='flex items-center gap-1 text-gray-500 hover:text-blue-600
                     text-sm mb-6 transition-colors'
        >
          <ChevronLeft size={16} /> Back to dashboard
        </button>

        <h1 className='text-2xl font-bold text-gray-800 mb-1'>Upload a program</h1>
        <p className='text-gray-500 text-sm mb-6'>
          Programs are visible only to students in the selected class.
        </p>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700
                          rounded-lg p-3 mb-5 text-sm'>{error}</div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>

          {/* Basic info */}
          <div className='bg-white rounded-xl p-5 border border-gray-100 space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder='Fibonacci Series'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description / task
              </label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder='Print the Fibonacci series up to N terms.'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Subject</label>
                <select
                  value={subject} onChange={e => setSubject(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white'
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Difficulty</label>
                <select
                  value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white'
                >
                  {['easy', 'medium', 'hard'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Concepts (comma-separated)
              </label>
              <input
                value={concepts} onChange={e => setConcepts(e.target.value)}
                placeholder='loops, recursion'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Starter code (optional)
              </label>
              <textarea
                value={starterCode} onChange={e => setStarterCode(e.target.value)}
                rows={3}
                placeholder='n = int(input())'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           font-mono focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Hint limit
              </label>
              <input
                type='number' min={0} max={5}
                value={hintLimit} onChange={e => setHintLimit(e.target.value)}
                className='w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm'
              />
            </div>
          </div>

          {/* Target class */}
          <div className='bg-white rounded-xl p-5 border border-gray-100'>
            <h3 className='font-semibold text-gray-700 text-sm mb-3'>Target class</h3>
            <div className='grid grid-cols-3 gap-3'>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Department</label>
                <select
                  value={department} onChange={e => setDepartment(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white'
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Year</label>
                <select
                  value={year} onChange={e => setYear(Number(e.target.value))}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white'
                >
                  {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>Section</label>
                <input
                  value={section} onChange={e => setSection(e.target.value.toUpperCase())}
                  maxLength={2}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm'
                />
              </div>
            </div>
            <p className='text-xs text-gray-400 mt-2'>
              Resulting class ID: <span className='font-mono'>{buildClassId(department, year, section)}</span>
            </p>
          </div>

          {/* Test cases */}
          <div className='bg-white rounded-xl p-5 border border-gray-100'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='font-semibold text-gray-700 text-sm'>Test cases</h3>
              <button
                type='button' onClick={addTestCase}
                className='flex items-center gap-1 text-xs text-blue-600 font-medium
                           hover:text-blue-700'
              >
                <Plus size={14} /> Add test case
              </button>
            </div>

            <div className='space-y-3'>
              {testCases.map((tc, i) => (
                <div key={i} className='border border-gray-200 rounded-lg p-3'>
                  <div className='flex items-center justify-between mb-2'>
                    <input
                      value={tc.label}
                      onChange={e => updateTestCase(i, 'label', e.target.value)}
                      placeholder={`Test ${i + 1} label`}
                      className='text-xs font-medium text-gray-600 border-none
                                 focus:outline-none flex-1'
                    />
                    {testCases.length > 1 && (
                      <button
                        type='button' onClick={() => removeTestCase(i)}
                        className='text-gray-400 hover:text-red-500'
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <label className='block text-xs text-gray-400 mb-1'>
                        Input (stdin) — leave blank if none
                      </label>
                      <textarea
                        value={tc.input}
                        onChange={e => updateTestCase(i, 'input', e.target.value)}
                        rows={2}
                        className='w-full border border-gray-200 rounded px-2 py-1.5
                                   text-xs font-mono focus:outline-none focus:ring-1
                                   focus:ring-blue-400'
                      />
                    </div>
                    <div>
                      <label className='block text-xs text-gray-400 mb-1'>
                        Expected output
                      </label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={e => updateTestCase(i, 'expectedOutput', e.target.value)}
                        rows={2}
                        className='w-full border border-gray-200 rounded px-2 py-1.5
                                   text-xs font-mono focus:outline-none focus:ring-1
                                   focus:ring-blue-400'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type='submit' disabled={saving}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                       text-white font-semibold py-2.5 rounded-lg transition-colors text-sm'
          >
            {saving ? 'Saving...' : 'Publish program'}
          </button>
        </form>
      </main>
    </div>
  )
}
