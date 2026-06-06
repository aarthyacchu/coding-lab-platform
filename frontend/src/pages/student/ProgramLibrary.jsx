// frontend/src/pages/student/ProgramLibrary.jsx
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebase'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { Code2, Zap, BookOpen } from 'lucide-react'

const DIFFICULTY_COLOR = {
  easy:   'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard:   'bg-red-100 text-red-700',
}

export default function ProgramLibrary() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading]   = useState(true)
  const user    = getAuth().currentUser
  const navigate = useNavigate()

  useEffect(() => {
    async function loadPrograms() {
      const q    = query(collection(db, 'programs'), where('active', '==', true))
      const snap = await getDocs(q)
      setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    loadPrograms()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar user={user} role='student' />
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-800 mb-1'>Program Library</h1>
        <p className='text-gray-500 text-sm mb-6'>
          Choose a program to begin your proctored lab session.
        </p>

        {loading ? (
          <p className='text-gray-400'>Loading programs...</p>
        ) : programs.length === 0 ? (
          <div className='bg-white rounded-xl p-8 text-center text-gray-400'>
            No programs available yet. Ask your teacher to add some.
          </div>
        ) : (
          <div className='grid gap-4'>
            {programs.map(prog => (
              <div key={prog.id}
                   className='bg-white rounded-xl p-5 shadow-sm border border-gray-100
                              hover:border-blue-300 hover:shadow-md transition cursor-pointer'
                   onClick={() => navigate(`/student/session/${prog.id}`)}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Code2 className='text-blue-500' size={16} />
                      <h3 className='font-semibold text-gray-800'>{prog.title}</h3>
                    </div>
                    <p className='text-sm text-gray-500 mb-3'>{prog.description}</p>
                    <div className='flex gap-2 flex-wrap'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                        ${DIFFICULTY_COLOR[prog.difficulty]}`}>
                        {prog.difficulty}
                      </span>
                      <span className='text-xs px-2 py-0.5 rounded-full font-medium
                                       bg-blue-100 text-blue-700'>
                        {prog.language?.toUpperCase()}
                      </span>
                      {prog.concepts?.map(c => (
                        <span key={c}
                              className='text-xs px-2 py-0.5 rounded-full
                                         bg-gray-100 text-gray-600'>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='text-right ml-4'>
                    <div className='flex items-center gap-1 text-xs text-gray-400'>
                      <Zap size={12} />
                      <span>{prog.hintLimit ?? 3} hints</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}