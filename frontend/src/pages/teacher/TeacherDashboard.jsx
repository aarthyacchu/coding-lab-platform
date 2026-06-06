// frontend/src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import Navbar from '../../components/Navbar'
import { Users, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TeacherDashboard({ user }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    flagged: 0,
    reportsReady: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      // Count students
      const studentQ = query(collection(db, 'users'), where('role', '==', 'student'))
      const studentSnap = await getDocs(studentQ)

      // Count sessions
      const sessionSnap = await getDocs(collection(db, 'sessions'))
      const sessions = sessionSnap.docs.map(d => d.data())

      setStats({
        totalStudents: studentSnap.size,
        totalSessions: sessions.length,
        flagged:       sessions.filter(s => s.flagged).length,
        reportsReady:  sessions.filter(s => s.status === 'complete').length,
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} role='teacher' />
      <main className='max-w-5xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-1'>Teacher Dashboard</h1>
        <p className='text-gray-500 text-sm mb-8'>
          Class overview and student performance insights.
        </p>

        {loading ? (
          <p className='text-gray-400'>Loading stats...</p>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            {[
              { icon: Users,        label: 'Students',      value: stats.totalStudents, color: 'blue'   },
              { icon: BookOpen,     label: 'Sessions',      value: stats.totalSessions, color: 'indigo' },
              { icon: CheckCircle,  label: 'Reports Ready', value: stats.reportsReady,  color: 'green'  },
              { icon: AlertTriangle,label: 'Flagged',       value: stats.flagged,       color: 'red'    },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label}
                   className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                <div className={`text-${color}-500 mb-2`}>
                  <Icon size={20} />
                </div>
                <p className='text-2xl font-bold text-gray-800'>{value}</p>
                <p className='text-xs text-gray-500 mt-0.5'>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Placeholder for student list — Day 5 will fill this */}
        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
          <h2 className='font-semibold text-gray-700 mb-3'>Recent Sessions</h2>
          <p className='text-sm text-gray-400'>
            Student reports will appear here after sessions are submitted.
            (Populated in Day 5 when the ML pipeline is connected.)
          </p>
        </div>
      </main>
    </div>
  )
}