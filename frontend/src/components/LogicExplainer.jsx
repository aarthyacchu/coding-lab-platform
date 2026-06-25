// frontend/src/components/LogicExplainer.jsx
import { useState, useEffect, useRef } from 'react'
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  LogIn, RotateCw, GitBranch, Cpu, LogOut, Loader2
} from 'lucide-react'
import { generateExplainer } from '../services/api'

// Maps the backend's visualHint string to an icon + color
const VISUAL_MAP = {
  input:     { icon: LogIn,    color: 'text-blue-400',   bg: 'bg-blue-900/40' },
  loop:      { icon: RotateCw, color: 'text-purple-400', bg: 'bg-purple-900/40' },
  condition: { icon: GitBranch,color: 'text-yellow-400', bg: 'bg-yellow-900/40' },
  compute:   { icon: Cpu,      color: 'text-green-400',  bg: 'bg-green-900/40' },
  output:    { icon: LogOut,   color: 'text-orange-400', bg: 'bg-orange-900/40' },
}

export default function LogicExplainer({ program, onClose }) {
  const [steps,        setSteps]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying,    setIsPlaying]     = useState(false)
  const [isMuted,      setIsMuted]       = useState(false)

  const utteranceRef = useRef(null)

  // Fetch the script once on mount
  useEffect(() => {
    async function load() {
      try {
        const result = await generateExplainer(
          program.title, program.description, program.concepts || []
        )
        setSteps(result.steps)
      } catch (err) {
        setError('Could not generate explanation. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()

    // Stop any speech when the component unmounts
    return () => window.speechSynthesis?.cancel()
  }, [program])

  // Speak the current step whenever it changes, if playing and not muted
  useEffect(() => {
    if (!isPlaying || isMuted || steps.length === 0) return

    window.speechSynthesis.cancel()   // stop any previous utterance
    const text = steps[currentIndex]?.narration
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Auto-advance to next step when narration finishes
    utterance.onend = () => {
      if (currentIndex < steps.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)   // reached the last step
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)

  }, [currentIndex, isPlaying, isMuted, steps])

  function handlePlayPause() {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  function goToStep(index) {
    window.speechSynthesis.cancel()
    setCurrentIndex(index)
    // Stay in playing state if it was already playing -- the effect re-speaks
  }

  function toggleMute() {
    if (!isMuted) window.speechSynthesis.cancel()
    setIsMuted(prev => !prev)
  }

  if (loading) return (
    <div className='bg-gray-800 rounded-xl p-8 text-center'>
      <Loader2 size={28} className='text-blue-400 animate-spin mx-auto mb-3' />
      <p className='text-gray-400 text-sm'>Preparing the walkthrough...</p>
    </div>
  )

  if (error) return (
    <div className='bg-gray-800 rounded-xl p-6 text-center'>
      <p className='text-red-400 text-sm'>{error}</p>
    </div>
  )

  const step = steps[currentIndex]
  const { icon: Icon, color, bg } = VISUAL_MAP[step?.visualHint] || VISUAL_MAP.compute

  return (
    <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>

      {/* Step indicator dots */}
      <div className='flex items-center justify-center gap-2 mb-6'>
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            className={`h-1.5 rounded-full transition-all
                       ${i === currentIndex ? 'w-8 bg-blue-500' : 'w-4 bg-gray-600'}`}
          />
        ))}
      </div>

      {/* Visual icon -- the 'animation' is this swapping in per step */}
      <div className='flex justify-center mb-5'>
        <div className={`w-24 h-24 rounded-2xl ${bg} flex items-center justify-center
                         transition-all duration-300`}>
          <Icon className={color} size={40} />
        </div>
      </div>

      {/* Step content */}
      <div className='text-center mb-6 min-h-[80px]'>
        <p className='text-xs text-blue-400 font-medium mb-1'>
          Step {currentIndex + 1} of {steps.length}
        </p>
        <h3 className='text-white font-semibold mb-2'>{step?.title}</h3>
        <p className='text-gray-300 text-sm leading-relaxed max-w-md mx-auto'>
          {step?.narration}
        </p>
      </div>

      {/* Controls */}
      <div className='flex items-center justify-center gap-3'>
        <button
          onClick={() => goToStep(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className='text-gray-400 hover:text-white disabled:opacity-30 transition'
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={handlePlayPause}
          className='bg-blue-600 hover:bg-blue-700 text-white rounded-full
                     w-12 h-12 flex items-center justify-center transition'
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill='currentColor' />}
        </button>

        <button
          onClick={() => goToStep(Math.min(steps.length - 1, currentIndex + 1))}
          disabled={currentIndex === steps.length - 1}
          className='text-gray-400 hover:text-white disabled:opacity-30 transition'
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={toggleMute}
          className='text-gray-400 hover:text-white transition ml-2'
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className='w-full mt-6 text-sm text-gray-400 hover:text-white
                     border-t border-gray-700 pt-4 transition'
        >
          Got it -- continue to coding
        </button>
      )}
    </div>
  )
}
