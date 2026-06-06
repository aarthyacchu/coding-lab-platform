// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './services/firebase'

import Login           from './pages/Login'
import StudentDashboard from './pages/student/StudentDashboard'
import ProgramLibrary  from './pages/student/ProgramLibrary'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import ProtectedRoute  from './components/ProtectedRoute'

export default function App() {
  const [user, setUser]     = useState(null)
  const [role, setRole]     = useState(null)   // 'student' | 'teacher'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase listener — fires whenever auth state changes
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch role from Firestore users collection
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setRole(userDoc.data().role)
        }
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })
    return () => unsub()  // cleanup listener on unmount
  }, [])

  // Show nothing while checking auth (prevents flash)
  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-blue-600 text-lg font-medium'>Loading...</div>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path='/login' element={<Login />} />

        {/* Student routes */}
        <Route path='/student/dashboard' element={
          <ProtectedRoute user={user} role={role} requiredRole='student'>
            <StudentDashboard user={user} />
          </ProtectedRoute>
        } />
        <Route path='/student/programs' element={
          <ProtectedRoute user={user} role={role} requiredRole='student'>
            <ProgramLibrary />
          </ProtectedRoute>
        } />

        {/* Teacher routes */}
        <Route path='/teacher/dashboard' element={
          <ProtectedRoute user={user} role={role} requiredRole='teacher'>
            <TeacherDashboard user={user} />
          </ProtectedRoute>
        } />

        {/* Default redirect based on role */}
        <Route path='/' element={
          user
            ? role === 'teacher'
              ? <Navigate to='/teacher/dashboard' replace />
              : <Navigate to='/student/dashboard' replace />
            : <Navigate to='/login' replace />
        } />

        {/* Catch-all */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}