// frontend/src/pages/Signup.jsx
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import { auth, db } from '../services/firebase'

// Keep this list in sync with what teachers select when uploading programs (Day 8)
const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical']
const YEARS = [1, 2, 3, 4]

export default function Signup() {
  const navigate = useNavigate()

  const [role,       setRole]       = useState('student')   // 'student' | 'teacher'
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [year,       setYear]       = useState(YEARS[0])
  const [section,    setSection]    = useState('A')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  // classId is the field programs will be tagged with — e.g. 'CS-2-A'
  // Built consistently here so Day 8's program upload filters match exactly.
  function buildClassId() {
    const deptCode = department.split(' ').map(w => w[0]).join('').toUpperCase()
    return `${deptCode}-${year}-${section}`
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (role === 'student' && !rollNumber) {
      setError('Roll number is required for students.')
      return
    }

    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      const profile = {
        uid:        result.user.uid,
        email,
        name,
        role,
        department,
        streak:     0,
        badges:     [],
        createdAt:  new Date().toISOString(),
      }

      if (role === 'student') {
        profile.rollNumber = rollNumber
        profile.year       = year
        profile.section    = section
        profile.classId    = buildClassId()   // e.g. 'CS-2-A' — used to filter programs
      }

      await setDoc(doc(db, 'users', result.user.uid), profile)

      navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else {
        setError('Signup failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
                    flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-lg w-full max-w-md p-8 my-8'>

        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-blue-700'>Create your account</h1>
          <p className='text-gray-500 mt-1 text-sm'>Join your class on CodeLab</p>
        </div>

        {/* Role toggle */}
        <div className='flex bg-gray-100 rounded-lg p-1 mb-5'>
          {['student', 'teacher'].map(r => (
            <button
              key={r}
              type='button'
              onClick={() => setRole(r)}
              className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors capitalize
                         ${role === r ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500'}`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700
                          rounded-lg p-3 mb-4 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Full name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder='Arjun Patel'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              type='email' value={email} onChange={e => setEmail(e.target.value)}
              placeholder='you@college.edu'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input
              type='password' value={password} onChange={e => setPassword(e.target.value)}
              placeholder='At least 6 characters'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Department</label>
            <select
              value={department} onChange={e => setDepartment(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
            >
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Student-only fields */}
          {role === 'student' && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Roll number
                </label>
                <input
                  value={rollNumber} onChange={e => setRollNumber(e.target.value)}
                  placeholder='CS2024001'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Year</label>
                  <select
                    value={year} onChange={e => setYear(Number(e.target.value))}
                    className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                  >
                    {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Section
                  </label>
                  <input
                    value={section} onChange={e => setSection(e.target.value.toUpperCase())}
                    maxLength={2}
                    className='w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
            </>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                       text-white font-semibold py-2.5 rounded-lg transition-colors
                       text-sm mt-2'
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-5'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 font-medium hover:underline'>
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
