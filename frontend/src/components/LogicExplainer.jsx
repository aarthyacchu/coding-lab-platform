// frontend/src/components/LogicExplainer.jsx
// Log2Base2-style visual code execution with line-by-line tracing and memory visualization

import { useState, useEffect } from 'react'
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, Loader2,
  Cpu, Database, Terminal
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

// Sample execution trace data (in production, this would come from backend)
const SAMPLE_EXECUTION_TRACE = [
  {
    line: 1,
    code: "n = int(input('Enter number: '))",
    variables: {},
    output: '',
    explanation: "Program starts - waiting for user input"
  },
  {
    line: 1,
    code: "n = int(input('Enter number: '))",
    variables: { n: 5 },
    output: '',
    explanation: "User entered 5, stored in variable n"
  },
  {
    line: 2,
    code: "sum = 0",
    variables: { n: 5, sum: 0 },
    output: '',
    explanation: "Initialize sum to 0 for accumulation"
  },
  {
    line: 3,
    code: "for i in range(1, n+1):",
    variables: { n: 5, sum: 0, i: 1 },
    output: '',
    explanation: "Loop starts, i = 1"
  },
  {
    line: 4,
    code: "    sum += i",
    variables: { n: 5, sum: 1, i: 1 },
    output: '',
    explanation: "Add i to sum: 0 + 1 = 1"
  },
  {
    line: 3,
    code: "for i in range(1, n+1):",
    variables: { n: 5, sum: 1, i: 2 },
    output: '',
    explanation: "Loop continues, i = 2"
  },
  {
    line: 4,
    code: "    sum += i",
    variables: { n: 5, sum: 3, i: 2 },
    output: '',
    explanation: "Add i to sum: 1 + 2 = 3"
  },
  {
    line: 3,
    code: "for i in range(1, n+1):",
    variables: { n: 5, sum: 3, i: 3 },
    output: '',
    explanation: "Loop continues, i = 3"
  },
  {
    line: 4,
    code: "    sum += i",
    variables: { n: 5, sum: 6, i: 3 },
    output: '',
    explanation: "Add i to sum: 3 + 3 = 6"
  },
  {
    line: 3,
    code: "for i in range(1, n+1):",
    variables: { n: 5, sum: 6, i: 4 },
    output: '',
    explanation: "Loop continues, i = 4"
  },
  {
    line: 4,
    code: "    sum += i",
    variables: { n: 5, sum: 10, i: 4 },
    output: '',
    explanation: "Add i to sum: 6 + 4 = 10"
  },
  {
    line: 3,
    code: "for i in range(1, n+1):",
    variables: { n: 5, sum: 10, i: 5 },
    output: '',
    explanation: "Loop continues, i = 5"
  },
  {
    line: 4,
    code: "    sum += i",
    variables: { n: 5, sum: 15, i: 5 },
    output: '',
    explanation: "Add i to sum: 10 + 5 = 15"
  },
  {
    line: 5,
    code: "print(f'Sum is {sum}')",
    variables: { n: 5, sum: 15, i: 5 },
    output: 'Sum is 15',
    explanation: "Loop complete, print result"
  }
]

export default function LogicExplainer({ code, onClose }) {
  const { theme } = useTheme()
  const [executionTrace, setExecutionTrace] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Theme classes
  const t = {
    dark: {
      bg: 'bg-[#0F0F10]',
      cardBg: 'bg-[#1A1A1D]',
      text: 'text-[#EDEDED]',
      textMuted: 'text-[#A1A1A3]',
      border: 'border-white/10',
      codeBg: 'bg-[#0F0F10]'
    },
    light: {
      bg: 'bg-[#FAFAFA]',
      cardBg: 'bg-white',
      text: 'text-[#171717]',
      textMuted: 'text-[#737373]',
      border: 'border-[#E5E5E5]',
      codeBg: 'bg-[#F5F5F5]'
    }
  }[theme]

  // Fetch execution trace on mount
  useEffect(() => {
    async function fetchTrace() {
      try {
        // In production, call backend: const data = await fetch('/api/explain/execute', { method: 'POST', body: JSON.stringify({ code }) })
        // For now, use sample data
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call
        setExecutionTrace(SAMPLE_EXECUTION_TRACE)
        setLoading(false)
      } catch (err) {
        setError('Failed to generate execution trace')
        setLoading(false)
      }
    }
    fetchTrace()
  }, [code])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || currentStep >= executionTrace.length - 1) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 1500) // 1.5s per step

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, executionTrace.length])

  const handlePlayPause = () => {
    if (currentStep >= executionTrace.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentStep < executionTrace.length - 1) {
      setCurrentStep(currentStep + 1)
      setIsPlaying(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setIsPlaying(false)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  if (loading) {
    return (
      <div className={`${t.cardBg} rounded-xl p-8 border ${t.border}`}>
        <div className='text-center'>
          <Loader2 size={32} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} animate-spin mx-auto mb-3`} />
          <p className={t.textMuted}>Analyzing code execution...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${t.cardBg} rounded-xl p-6 border ${t.border}`}>
        <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} text-sm`}>{error}</p>
      </div>
    )
  }

  const step = executionTrace[currentStep]
  const codeLines = [
    "n = int(input('Enter number: '))",
    "sum = 0",
    "for i in range(1, n+1):",
    "    sum += i",
    "print(f'Sum is {sum}')"
  ]

  return (
    <div className={`${t.bg} transition-colors duration-300`}>
      {/* Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-2'>
          <Cpu size={18} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
          <h2 className={`text-lg font-semibold ${t.text}`}>Visual Execution Engine</h2>
        </div>
        <p className={`text-sm ${t.textMuted}`}>
          Step through code line-by-line and watch memory change in real-time
        </p>
      </div>

      {/* Split-screen layout */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        
        {/* LEFT: Code with line highlighting */}
        <div className={`${t.cardBg} rounded-xl p-5 border ${t.border}`}>
          <div className='flex items-center gap-2 mb-4'>
            <Terminal size={14} className={t.textMuted} />
            <h3 className={`text-sm font-medium ${t.text}`}>Code</h3>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
              Line {step?.line}
            </span>
          </div>

          <div className={`${t.codeBg} rounded-lg p-4 font-mono text-sm`}>
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`py-1 px-2 rounded transition-all duration-300
                           ${step?.line === index + 1 
                             ? theme === 'dark' 
                               ? 'bg-blue-500/20 border-l-2 border-blue-500' 
                               : 'bg-blue-100 border-l-2 border-blue-600'
                             : ''
                           }`}
              >
                <span className={`${t.textMuted} mr-4 select-none`}>{index + 1}</span>
                <span className={step?.line === index + 1 ? t.text : t.textMuted}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Memory visualization */}
        <div className={`${t.cardBg} rounded-xl p-5 border ${t.border}`}>
          <div className='flex items-center gap-2 mb-4'>
            <Database size={14} className={t.textMuted} />
            <h3 className={`text-sm font-medium ${t.text}`}>Memory State</h3>
          </div>

          <div className='space-y-3'>
            {Object.keys(step?.variables || {}).length === 0 ? (
              <p className={`text-sm ${t.textMuted} text-center py-8`}>
                No variables yet
              </p>
            ) : (
              Object.entries(step.variables).map(([varName, value]) => (
                <div
                  key={varName}
                  className={`p-3 rounded-lg border transition-all duration-300
                             ${theme === 'dark' 
                               ? 'bg-purple-500/10 border-purple-500/20' 
                               : 'bg-purple-50 border-purple-200'
                             }`}
                >
                  <div className='flex items-center justify-between'>
                    <span className={`text-sm font-mono font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>
                      {varName}
                    </span>
                    <span className={`text-lg font-bold ${t.text}`}>
                      {typeof value === 'string' ? `"${value}"` : value}
                    </span>
                  </div>
                  <div className={`text-xs ${t.textMuted} mt-1`}>
                    {typeof value === 'number' ? 'integer' : typeof value}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Console output */}
          {step?.output && (
            <div className='mt-4'>
              <h4 className={`text-xs font-medium ${t.textMuted} mb-2`}>CONSOLE OUTPUT</h4>
              <div className={`${t.codeBg} rounded-lg p-3 font-mono text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                {step.output}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation panel */}
      <div className={`${t.cardBg} rounded-xl p-4 border ${t.border} mb-6`}>
        <p className={`text-sm ${t.text} leading-relaxed`}>
          <span className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} font-medium mr-2`}>
            Step {currentStep + 1}/{executionTrace.length}:
          </span>
          {step?.explanation}
        </p>
      </div>

      {/* Controls */}
      <div className={`${t.cardBg} rounded-xl p-5 border ${t.border}`}>
        {/* Progress bar */}
        <div className={`h-1.5 rounded-full overflow-hidden mb-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div
            className={`h-full transition-all duration-300 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}
            style={{ width: `${((currentStep + 1) / executionTrace.length) * 100}%` }}
          />
        </div>

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            title='Reset'
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                       ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            title='Previous'
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={handlePlayPause}
            className={`p-3 rounded-full transition-all
                       ${theme === 'dark' 
                         ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                         : 'bg-blue-600 hover:bg-blue-700 text-white'
                       }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} fill='currentColor' /> : <Play size={20} fill='currentColor' />}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep >= executionTrace.length - 1}
            className={`p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                       ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            title='Next'
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`w-full mt-4 py-2.5 text-sm font-medium rounded-lg border transition-colors
                     ${theme === 'dark' 
                       ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' 
                       : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                     }`}
        >
          Continue to Coding
        </button>
      )}
    </div>
  )
}
