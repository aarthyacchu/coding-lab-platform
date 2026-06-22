// frontend/src/pages/teacher/ClassAnalytics.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import Navbar from '../../components/Navbar'
import { ChevronLeft, TrendingUp, AlertCircle } from 'lucide-react'

const TIER_COLOR = {
  excellent:       'bg-green-500',
  satisfactory:    'bg-yellow-500',
  needs_attention: 'bg-red-500',
}

const TIER_LABEL = {
  excellent:       'Excellent',
  satisfactory:    'Satisfactory',
  needs_attention: 'Needs Attention',
}

export default function ClassAnalytics() {
  const user     = getAuth().currentUser
  const navigate = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/reports/class')
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <p className='text-gray-400'>Loading analytics...</p>
    </div>
  )

  const total = data?.total || 0
  const tiers = data?.tiers || {}

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} role='teacher' />
      <main className='max-w-4xl mx-auto px-4 py-8'>

        <button
          onClick={() => navigate('/teacher/dashboard')}
          className='flex items-center gap-1 text-gray-500 hover:text-blue-600
                     text-sm mb-6 transition-colors'
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        <h1 className='text-2xl font-bold text-gray-800 mb-1'>Class Analytics</h1>
        <p className='text-gray-500 text-sm mb-8'>
          Aggregated performance across {total} completed session{total !== 1 && 's'}.
        </p>

        {total === 0 ? (
          <div className='bg-white rounded-xl p-8 text-center text-gray-400 border border-gray-100'>
            No completed sessions yet. Analytics will appear once students submit labs.
          </div>
        ) : (
          <div className='space-y-6'>

            <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
              <div className='flex items-center gap-2 mb-4'>
                <TrendingUp size={16} className='text-blue-500' />
                <h2 className='font-semibold text-gray-800 text-sm'>
                  Performance Distribution
                </h2>
              </div>
              <div className='space-y-3'>
                {Object.entries(tiers).map(([tier, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={tier}>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-gray-600 font-medium'>
                          {TIER_LABEL[tier] || tier}
                        </span>
                        <span className='text-gray-400'>{count} students ({pct}%)</span>
                      </div>
                      <div className='h-2.5 bg-gray-100 rounded-full overflow-hidden'>
                        <div
                          className={`h-full ${TIER_COLOR[tier] || 'bg-gray-400'} rounded-full
                                      transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                <p className='text-3xl font-bold text-gray-800'>
                  {Math.round((data?.avgQuizScore || 0) * 100)}%
                </p>
                <p className='text-xs text-gray-500 mt-1'>Average Quiz Score</p>
              </div>
              <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                <p className='text-3xl font-bold text-orange-600'>
                  {data?.flagged || 0}
                </p>
                <p className='text-xs text-gray-500 mt-1'>Flagged Sessions</p>
              </div>
            </div>

            {data?.topWeaknesses?.length > 0 && (
              <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                <div className='flex items-center gap-2 mb-4'>
                  <AlertCircle size={16} className='text-red-500' />
                  <h2 className='font-semibold text-gray-800 text-sm'>
                    Most Common Weak Concepts (Batch-Wide)
                  </h2>
                </div>
                <div className='space-y-2'>
                  {data.topWeaknesses.map(([concept, count]) => (
                    <div key={concept}
                         className='flex items-center justify-between
                                    bg-red-50 rounded-lg px-3 py-2'>
                      <span className='text-sm text-red-700 font-medium capitalize'>
                        {concept.replace(/_/g, ' ')}
                      </span>
                      <span className='text-xs text-red-500'>
                        {count} student{count !== 1 && 's'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className='text-xs text-gray-400 mt-3'>
                  Consider revisiting these topics in your next lecture.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
