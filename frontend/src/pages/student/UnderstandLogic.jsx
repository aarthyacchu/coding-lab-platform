// frontend/src/pages/student/UnderstandLogic.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import LogicExplainer from '../../components/LogicExplainer'
import ProgramChatbot from '../../components/ProgramChatbot'
import { ChevronLeft, Code2 } from 'lucide-react'

export default function UnderstandLogic() {
  const { programId } = useParams()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'programs', programId))
      if (snap.exists()) setProgram({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    load()
  }, [programId])

  if (loading) return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
      <p className='text-gray-400'>Loading...</p>
    </div>
  )

  if (!program) return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
      <p className='text-red-400'>Program not found.</p>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-900 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>

        <button
          onClick={() => navigate('/student/programs')}
          className='flex items-center gap-1 text-gray-400 hover:text-white
                     text-sm mb-6 transition-colors'
        >
          <ChevronLeft size={16} /> Back to programs
        </button>

        <div className='flex items-center gap-2 mb-1'>
          <Code2 size={18} className='text-blue-400' />
          <h1 className='text-white font-bold text-xl'>{program.title}</h1>
        </div>
        <p className='text-gray-400 text-sm mb-6'>{program.description}</p>

        {/* Animated explainer */}
        <div className='mb-6'>
          <LogicExplainer program={program} />
        </div>

        {/* Chatbot */}
        <div className='mb-6'>
          <ProgramChatbot program={program} />
        </div>

        {/* Proceed to coding */}
        <button
          onClick={() => navigate(`/student/session/${program.id}`)}
          className='w-full bg-green-600 hover:bg-green-700 text-white
                     font-semibold py-3 rounded-xl transition-colors text-sm'
        >
          I'm ready -- start coding
        </button>
      </div>
    </div>
  )
}
