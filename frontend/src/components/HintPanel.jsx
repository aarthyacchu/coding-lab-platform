// frontend/src/components/HintPanel.jsx
// Log2Base2-style tiered hint system with progressive revelation

import { useState } from 'react'
import { Lightbulb, X, Loader2, Lock, Sparkles, Code, FileText } from 'lucide-react'
import { getHint } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'

const HINT_LIMIT = 3

// Visual tier indicators
const HINT_TIERS = [
  { 
    number: 1, 
    name: 'Conceptual', 
    icon: Sparkles, 
    description: 'High-level approach',
    color: { dark: 'from-blue-500 to-cyan-500', light: 'from-blue-400 to-cyan-400' }
  },
  { 
    number: 2, 
    name: 'Pseudocode', 
    icon: FileText, 
    description: 'Logic breakdown',
    color: { dark: 'from-purple-500 to-pink-500', light: 'from-purple-400 to-pink-400' }
  },
  { 
    number: 3, 
    name: 'Partial Solution', 
    icon: Code, 
    description: 'Code guidance',
    color: { dark: 'from-orange-500 to-red-500', light: 'from-orange-400 to-red-400' }
  }
]

export default function HintPanel({ program, code, hintsUsed, onHintUsed, onClose }) {
  const { theme } = useTheme()
  const [hint, setHint] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hintHistory, setHintHistory] = useState([])

  const hintsRemaining = HINT_LIMIT - hintsUsed
  const isLocked = hintsUsed >= HINT_LIMIT

  // Theme classes
  const t = {
    dark: {
      bg: 'bg-[#1A1A1D]',
      text: 'text-[#EDEDED]',
      textMuted: 'text-[#A1A1A3]',
      border: 'border-white/10',
      cardBg: 'bg-[#0F0F10]'
    },
    light: {
      bg: 'bg-white',
      text: 'text-[#171717]',
      textMuted: 'text-[#737373]',
      border: 'border-[#E5E5E5]',
      cardBg: 'bg-[#FAFAFA]'
    }
  }[theme]

  async function handleGetHint() {
    if (isLocked || isLoading) return
    setIsLoading(true)
    setError('')

    try {
      const result = await getHint(
        program.id,
        program.title,
        program.description,
        program.concepts || [],
        code,
        hintsUsed + 1 // hintNumber — 1-indexed
      )

      // Add to history with tier information
      const tierInfo = HINT_TIERS[hintsUsed]
      setHintHistory(prev => [...prev, {
        number: hintsUsed + 1,
        text: result.hint,
        tier: tierInfo
      }])

      setHint(result.hint)
      onHintUsed() // tells Session.jsx to increment hintsUsed

    } catch (err) {
      setError(err.message || 'Could not get hint. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Overlay backdrop
    <div className='fixed inset-0 z-40 flex justify-end'>
      {/* Click backdrop to close */}
      <div
        className='flex-1 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`w-[420px] ${t.bg} border-l ${t.border} flex flex-col h-full shadow-2xl transition-colors duration-300`}>

        {/* Panel header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
          <div className='flex items-center gap-2'>
            <Lightbulb size={18} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
            <span className={`${t.text} font-semibold`}>AI Hint System</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                              ${isLocked
                                  ? theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                                  : theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'}`}>
              {isLocked ? 'Exhausted' : `${hintsRemaining} remaining`}
            </span>
            <button 
              onClick={onClose} 
              className={`${t.textMuted} transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'}`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tier progression indicator */}
        <div className={`px-5 py-4 border-b ${t.border}`}>
          <p className={`text-xs ${t.textMuted} mb-3`}>Progressive hints unlock deeper guidance</p>
          <div className='flex items-center gap-2'>
            {HINT_TIERS.map((tier, index) => {
              const TierIcon = tier.icon
              const isUnlocked = index < hintsUsed
              const isCurrent = index === hintsUsed
              const isLocked = index > hintsUsed

              return (
                <div key={tier.number} className='flex-1'>
                  <div className='relative'>
                    {/* Connecting line */}
                    {index < HINT_TIERS.length - 1 && (
                      <div 
                        className={`absolute left-1/2 top-6 w-full h-0.5 -z-10 transition-colors duration-300
                                   ${isUnlocked 
                                     ? theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                                     : theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                                   }`}
                      />
                    )}

                    {/* Tier circle */}
                    <div className='flex flex-col items-center'>
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10
                                   ${isUnlocked || isCurrent
                                     ? `bg-gradient-to-br ${tier.color[theme]} shadow-lg`
                                     : theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                                   }
                                   ${isCurrent ? 'ring-4 ring-offset-2 ' + (theme === 'dark' ? 'ring-blue-500/30 ring-offset-[#1A1A1D]' : 'ring-blue-500/30 ring-offset-white') : ''}`}
                      >
                        {isLocked ? (
                          <Lock size={18} className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
                        ) : (
                          <TierIcon size={18} className='text-white' />
                        )}
                      </div>
                      <p className={`text-[10px] font-medium mt-2 text-center leading-tight
                                    ${isUnlocked || isCurrent ? t.text : t.textMuted}`}>
                        {tier.name}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hint history scroll area */}
        <div className='flex-1 overflow-y-auto p-5 space-y-4'>
          {hintHistory.length === 0 && !isLocked && (
            <div className='text-center py-12'>
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center
                             ${theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
                <Lightbulb size={28} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />
              </div>
              <h3 className={`text-sm font-semibold ${t.text} mb-1`}>Need a hint?</h3>
              <p className={`text-xs ${t.textMuted} max-w-xs mx-auto leading-relaxed`}>
                Get progressive guidance without spoiling the solution. Each hint builds on the previous one.
              </p>
            </div>
          )}

          {/* Render all previous hints */}
          {hintHistory.map(h => {
            const TierIcon = h.tier.icon
            return (
              <div 
                key={h.number}
                className={`${t.cardBg} rounded-xl p-4 border ${t.border} transition-all duration-300`}
              >
                <div className='flex items-center gap-2 mb-3'>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${h.tier.color[theme]}`}>
                    <TierIcon size={14} className='text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className={`text-xs font-semibold ${t.text}`}>
                      Tier {h.number}: {h.tier.name}
                    </p>
                    <p className={`text-[10px] ${t.textMuted}`}>
                      {h.tier.description}
                    </p>
                  </div>
                </div>
                <p className={`${t.text} text-sm leading-relaxed`}>
                  {h.text}
                </p>
              </div>
            )
          })}

          {/* Loading state */}
          {isLoading && (
            <div className={`${t.cardBg} rounded-xl p-4 border ${t.border} flex items-center gap-3`}>
              <Loader2 size={16} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
              <div>
                <p className={`text-sm font-medium ${t.text}`}>Generating hint...</p>
                <p className={`text-xs ${t.textMuted}`}>Analyzing your code</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={`rounded-xl p-4 border text-sm
                           ${theme === 'dark' 
                             ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                             : 'bg-red-50 border-red-200 text-red-700'
                           }`}>
              {error}
            </div>
          )}

          {/* Locked state */}
          {isLocked && (
            <div className={`${t.cardBg} rounded-xl p-6 border ${t.border} text-center`}>
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center
                             ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-100'}`}>
                <Lock size={24} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />
              </div>
              <h3 className={`text-sm font-semibold ${t.text} mb-1`}>All hints used</h3>
              <p className={`text-xs ${t.textMuted} leading-relaxed`}>
                You've exhausted all 3 hint tiers. Try to solve the remaining challenges on your own!
              </p>
            </div>
          )}
        </div>

        {/* Get hint button */}
        <div className={`p-5 border-t ${t.border}`}>
          <button
            onClick={handleGetHint}
            disabled={isLocked || isLoading}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all
                       ${isLocked || isLoading
                           ? theme === 'dark' ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                           : theme === 'dark' 
                             ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 shadow-lg hover:shadow-xl' 
                             : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl'
                       }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className='animate-spin' /> 
                <span>Generating...</span>
              </>
            ) : isLocked ? (
              <>
                <Lock size={16} /> 
                <span>No Hints Remaining</span>
              </>
            ) : (
              <>
                <Lightbulb size={16} /> 
                <span>Get {HINT_TIERS[hintsUsed]?.name} Hint</span>
              </>
            )}
          </button>
          
          {!isLocked && !isLoading && (
            <p className={`text-xs text-center ${t.textMuted} mt-2`}>
              Next: {HINT_TIERS[hintsUsed]?.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}