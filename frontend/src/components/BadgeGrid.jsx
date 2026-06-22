// frontend/src/components/BadgeGrid.jsx

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

export default function BadgeGrid({ earnedBadges = [] }) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
      {ALL_BADGES.map(badge => {
        const isEarned = earnedBadges.includes(badge.id)
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center text-center p-3 rounded-xl
                         border transition-all
                         ${isEarned
                             ? 'bg-blue-50 border-blue-200'
                             : 'bg-gray-50 border-gray-200 opacity-40'}`}
            title={badge.desc}
          >
            <span className={`text-2xl mb-1 ${!isEarned && 'grayscale'}`}>
              {badge.icon}
            </span>
            <span className={`text-xs font-medium
                              ${isEarned ? 'text-blue-700' : 'text-gray-400'}`}>
              {badge.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
