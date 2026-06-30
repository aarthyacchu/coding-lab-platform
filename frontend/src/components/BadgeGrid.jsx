// frontend/src/components/BadgeGrid.jsx
// Badge grid with glassmorphic cards and accent-color glow for earned badges

const ALL_BADGES = [
  { id: 'first_program', name: 'First Program', icon: '🏅', desc: 'Complete first lab' },
  { id: 'no_hints',      name: 'No Hints',       icon: '🧠', desc: 'Submit without hints' },
  { id: 'perfect_quiz',  name: 'Perfect Quiz',   icon: '⭐', desc: '100% quiz score' },
  { id: 'five_streak',   name: '5-Day Streak',   icon: '🔥', desc: '5 sessions in a row' },
  { id: 'debugger',      name: 'Debugger',       icon: '🐛', desc: 'Solved with 3+ errors' },
  { id: 'speed_run',     name: 'Speed Run',      icon: '⚡', desc: 'Submitted under 20 min' },
  { id: 'lab_complete',  name: 'Lab Complete',   icon: '📚', desc: 'All programs done' },
  { id: 'clean_code',    name: 'Clean Code',     icon: '🎯', desc: 'Zero violations' },
]

export default function BadgeGrid({ earnedBadges = [], theme = 'dark' }) {
  const t = {
    dark: {
      earnedBg: 'rgba(129, 140, 248, 0.08)',
      earnedBorder: 'border-[#818CF8]/30',
      earnedShadow: '0 0 20px rgba(129, 140, 248, 0.15)',
      earnedText: 'text-[#A5B4FC]',
      lockedBg: 'rgba(26, 26, 29, 0.4)',
      lockedBorder: 'border-white/10',
      lockedText: 'text-[#737373]'
    },
    light: {
      earnedBg: 'rgba(99, 102, 241, 0.08)',
      earnedBorder: 'border-[#6366F1]/30',
      earnedShadow: '0 0 20px rgba(99, 102, 241, 0.12)',
      earnedText: 'text-[#6366F1]',
      lockedBg: 'rgba(245, 245, 245, 0.6)',
      lockedBorder: 'border-[#E5E5E5]',
      lockedText: 'text-[#A3A3A3]'
    }
  }[theme]

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-5'>
      {ALL_BADGES.map(badge => {
        const isEarned = earnedBadges.includes(badge.id)
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center text-center p-5 rounded-xl
                       border transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] relative
                       ${isEarned
                           ? `${t.earnedBorder} hover:-translate-y-1 cursor-default`
                           : `${t.lockedBorder} opacity-40`}`}
            style={isEarned ? {
              backgroundColor: t.earnedBg,
              boxShadow: t.earnedShadow
            } : {
              backgroundColor: t.lockedBg
            }}
            title={badge.desc}
          >
            <span className={`text-3xl mb-2 ${!isEarned && 'grayscale opacity-50'}`}>
              {badge.icon}
            </span>
            <span className={`text-xs font-semibold ${isEarned ? t.earnedText : t.lockedText}`}>
              {badge.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
