// frontend/src/pages/student/StudentDashboard.jsx
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../../services/firebase'
import Navbar from '../../components/Navbar'
import { Flame, Medal, BookOpen, ChevronRight } from 'lucide-react'

export default function StudentDashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProfile() {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) setProfile(snap.data())
      setLoading(false)
    }
    loadProfile()
  }, [user.uid])

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <p className='text-gray-400'>Loading your dashboard...</p>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} role='student' />

      <main className='max-w-4xl mx-auto px-4 py-8'>
        {/* Welcome */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-800'>
            Welcome back, {profile?.name || 'Student'} 👋
          </h1>
          <p className='text-gray-500 mt-1 text-sm'>
            {profile?.department} • Year {profile?.year}
          </p>
        </div>

        {/* Stats row */}
        <div className='grid grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center gap-2 mb-1'>
              <Flame className='text-orange-500' size={18} />
              <span className='text-xs text-gray-500 font-medium'>Streak</span>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              {profile?.streak ?? 0}
            </p>
            <p className='text-xs text-gray-400 mt-0.5'>days</p>
          </div>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center gap-2 mb-1'>
              <Medal className='text-yellow-500' size={18} />
              <span className='text-xs text-gray-500 font-medium'>Badges</span>
            </div>
            <p className='text-3xl font-bold text-gray-800'>
              {profile?.badges?.length ?? 0}
            </p>
            <p className='text-xs text-gray-400 mt-0.5'>earned</p>
          </div>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center gap-2 mb-1'>
              <BookOpen className='text-blue-500' size={18} />
              <span className='text-xs text-gray-500 font-medium'>Sessions</span>
            </div>
            <p className='text-3xl font-bold text-gray-800'>0</p>
            <p className='text-xs text-gray-400 mt-0.5'>completed</p>
          </div>
        </div>

        {/* Start lab CTA */}
        <div className='bg-blue-600 rounded-2xl p-6 text-white'>
          <h2 className='text-lg font-bold mb-1'>Ready for today's lab?</h2>
          <p className='text-blue-200 text-sm mb-4'>
            Pick a program and start your proctored session.
          </p>
          <button
            onClick={() => navigate('/student/programs')}
            className='bg-white text-blue-600 font-semibold text-sm px-5 py-2
                       rounded-lg flex items-center gap-1 hover:bg-blue-50 transition'
          >
            Browse Programs <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  )
}
