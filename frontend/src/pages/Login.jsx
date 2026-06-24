// frontend/src/pages/Login.jsx
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import { auth, db } from '../services/firebase'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign in with Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Fetch role from Firestore to decide where to redirect
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      const role = userDoc.data()?.role

      if (role === 'teacher') {
        navigate('/teacher/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    } catch (err) {
      // Firebase error codes → human-readable messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
                    flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-lg w-full max-w-md p-8'>

        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-blue-700'>CodeLab</h1>
          <p className='text-gray-500 mt-2 text-sm'>
            AI-Powered Coding Lab Platform
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700
                          rounded-lg p-3 mb-6 text-sm'>
            {error}
          </div>
        )}

        {/* Login form */}
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='your@email.com'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                       text-white font-semibold py-2.5 rounded-lg transition-colors
                       text-sm mt-2'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className='text-center text-sm text-gray-500 mt-6'>
          New here?{' '}
          <Link to='/signup' className='text-blue-600 font-medium hover:underline'>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}