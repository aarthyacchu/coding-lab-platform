// frontend/src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom'
import { Code2, Lightbulb, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: Code2,       title: 'Hands-on lab sessions',
    desc: 'Write and run real code in a proctored Monaco editor — not copy-paste from a projector.' },
  { icon: Lightbulb,   title: 'AI hints, not answers',
    desc: 'Get up to 3 guided hints per program. The AI explains logic — it never gives the solution.' },
  { icon: ShieldCheck, title: 'Academic integrity built in',
    desc: 'Fullscreen proctoring, paste blocking, and plagiarism detection keep every submission honest.' },
  { icon: BarChart3,   title: 'Teacher insight, automatically',
    desc: 'AI-generated performance reports show exactly where each student is struggling — no manual grading.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-white'>

      {/* ── NAV ── */}
      <nav className='flex items-center justify-between px-6 py-4 max-w-6xl mx-auto'>
        <div className='flex items-center gap-2'>
          <Code2 className='text-blue-600' size={24} />
          <span className='font-bold text-blue-700 text-xl'>CodeLab</span>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => navigate('/login')}
            className='text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-4 py-2'
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold
                       px-5 py-2 rounded-lg transition-colors'
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className='max-w-4xl mx-auto px-6 pt-16 pb-20 text-center'>
        <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 leading-tight'>
          Learn to code by
          <span className='text-blue-600'> actually coding</span>
        </h1>
        <p className='text-gray-500 mt-5 text-lg max-w-2xl mx-auto'>
          An AI-guided lab platform built for college programming courses —
          proctored sessions, smart hints, and automatic performance reports
          for teachers.
        </p>
        <div className='flex items-center justify-center gap-3 mt-8'>
          <button
            onClick={() => navigate('/signup')}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       font-semibold px-6 py-3 rounded-lg transition-colors'
          >
            Get started <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className='text-gray-600 hover:text-blue-600 font-medium px-6 py-3
                       border border-gray-200 rounded-lg transition-colors'
          >
            I already have an account
          </button>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className='max-w-5xl mx-auto px-6 pb-20'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title}
                 className='bg-gray-50 rounded-xl p-6 border border-gray-100'>
              <Icon className='text-blue-600 mb-3' size={22} />
              <h3 className='font-semibold text-gray-800 mb-1.5'>{title}</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className='border-t border-gray-100 py-6 text-center text-xs text-gray-400'>
        Built for college programming labs.
      </footer>
    </div>
  )
}
