// frontend/src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import Navbar from '../../components/Navbar'
import { Users, BookOpen, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'

export default function TeacherDashboard({ user }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    flagged: 0,
    reportsReady: 0,
  })
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      // Count students
      const studentQ = query(collection(db, 'users'), where('role', '==', 'student'))
      const studentSnap = await getDocs(studentQ)

      // Count sessions
      const sessionSnap = await getDocs(collection(db, 'sessions'))
      const sessionsData = sessionSnap.docs.map(d => d.data())

      setStats({
        totalStudents: studentSnap.size,
        totalSessions: sessionsData.length,
        flagged:       sessionsData.filter(s => s.flagged).length,
        reportsReady:  sessionsData.filter(s => s.status === 'complete').length,
      })

      // Fetch recent sessions for the table
      try {
        const res = await fetch('http://localhost:8000/api/reports/sessions/recent')
        const data = await res.json()
        setSessions(data.sessions || [])
      } catch (e) {
        console.warn('Could not load sessions:', e)
      }

      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} role='teacher' />
      <main className='max-w-5xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800 mb-1'>Teacher Dashboard</h1>
            <p className='text-gray-500 text-sm'>
              Class overview and student performance insights.
            </p>
          </div>
          <button
            onClick={() => navigate('/teacher/analytics')}
            className='flex items-center gap-1.5 text-sm font-medium text-blue-600
                       hover:text-blue-700 transition-colors'
          >
            <BarChart3 size={15} /> View Class Analytics
          </button>
        </div>

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

        {/* Recent Sessions Table */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100'>
            <h2 className='font-semibold text-gray-700'>Recent Sessions</h2>
          </div>
          {sessions.length === 0 ? (
            <div className='p-6 text-center text-gray-400 text-sm'>
              No sessions yet. Reports appear here after students submit.
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead className='bg-gray-50'>
                <tr>
                  {['Student ID','Program','Status','Quiz Score','Hints','Flagged',''].map(h => (
                    <th key={h} className='px-4 py-3 text-left text-xs font-medium
                                            text-gray-500 uppercase tracking-wide'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {sessions.map(s => (
                  <tr key={s.sessionId} className='hover:bg-gray-50 transition'>
                    <td className='px-4 py-3 text-gray-700 font-mono text-xs'>
                      {s.studentId?.slice(0,8)}...
                    </td>
                    <td className='px-4 py-3 text-gray-600 text-xs'>
                      {s.programId?.slice(0,12)}...
                    </td>
                    <td className='px-4 py-3'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${s.status==='complete'?'bg-green-100 text-green-700'
                                         :s.status==='processing'?'bg-blue-100 text-blue-700'
                                         :'bg-gray-100 text-gray-600'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-gray-700'>
                      {Math.round((s.quizScore||0)*100)}%
                    </td>
                    <td className='px-4 py-3 text-gray-600'>{s.hintsUsed}/3</td>
                    <td className='px-4 py-3'>
                      {s.flagged && (
                        <span className='text-xs text-orange-600 font-medium'>⚠ Flagged</span>
                      )}
                    </td>
                    <td className='px-4 py-3'>
                      {s.status === 'complete' && (
                        <button
                          onClick={() => navigate(`/teacher/report/${s.sessionId}`)}
                          className='text-xs text-blue-600 hover:underline'
                        >
                          View Report
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}