// frontend/src/pages/student/StudentDashboard.jsx
// Dashboard with glassmorphic cards, gradient ambiance, and smooth animations

import { useEffect, useState, useRef } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../../services/firebase'
import BadgeGrid from '../../components/BadgeGrid'
import { Flame, Medal, BookOpen, ChevronRight, Trophy, Sparkles, Terminal } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function StudentDashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visibleElements, setVisibleElements] = useState(new Set(['stats', 'badges', 'cta']))
  const navigate = useNavigate()

  // Get theme from context
  const { theme } = useTheme()

  // Animated counter refs
  const [streakCount, setStreakCount] = useState(0)
  const [badgeCount, setBadgeCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)

  // Intersection observer refs
  const statsRef = useRef(null)
  const badgeGridRef = useRef(null)
  const ctaRef = useRef(null)

  // Check for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) setProfile(snap.data())
      setLoading(false)
    }
    loadProfile()
  }, [user.uid])

  // Animate counters when stats become visible
  useEffect(() => {
    if (!profile) return

    if (reducedMotion) {
      setStreakCount(profile.streak ?? 0)
      setBadgeCount(profile.badges?.length ?? 0)
      setSessionCount(0)
      return
    }

    if (!visibleElements.has('stats')) {
      setStreakCount(profile.streak ?? 0)
      setBadgeCount(profile.badges?.length ?? 0)
      setSessionCount(0)
      return
    }

    const targetStreak = profile.streak ?? 0
    const targetBadges = profile.badges?.length ?? 0
    const targetSessions = 0

    const duration = 600
    const steps = 30
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStreakCount(Math.floor(targetStreak * progress))
      setBadgeCount(Math.floor(targetBadges * progress))
      setSessionCount(Math.floor(targetSessions * progress))

      if (currentStep >= steps) {
        setStreakCount(targetStreak)
        setBadgeCount(targetBadges)
        setSessionCount(targetSessions)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [profile, visibleElements, reducedMotion])

  // Intersection observer for scroll animations
  useEffect(() => {
    if (reducedMotion) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.dataset.section]))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = [statsRef, badgeGridRef, ctaRef]
    elements.forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [reducedMotion])

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0F0F10]' : 'bg-[#FAFAFA]'}`}>
      <p className={theme === 'dark' ? 'text-[#A1A1A3]' : 'text-[#737373]'}>Loading your dashboard...</p>
    </div>
  )

  const isVisible = (section) => visibleElements.has(section)

  // Theme classes
  const t = {
    dark: {
      bg: 'bg-[#0F0F10]',
      text: 'text-[#EDEDED]',
      textMuted: 'text-[#A1A1A3]',
      cardBg: 'rgba(26, 26, 29, 0.7)',
      border: 'border-white/10'
    },
    light: {
      bg: 'bg-[#FAFAFA]',
      text: 'text-[#171717]',
      textMuted: 'text-[#737373]',
      cardBg: 'rgba(255, 255, 255, 0.7)',
      border: 'border-[#E5E5E5]'
    }
  }[theme]

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-300 relative overflow-hidden`}>
      
      {/* Ambient gradient background */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        {/* Subtle gradient wash */}
        <div 
          className='absolute inset-0 transition-all duration-300'
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, rgba(79, 70, 229, 0.06) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.03) 50%, rgba(167, 139, 250, 0.05) 100%)',
            opacity: theme === 'dark' ? 0.4 : 0.3
          }}
        />
        
        {/* Floating ambient badges - low opacity, in corners */}
        <div className={`absolute top-20 left-8 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-20' : 'opacity-15'}`}>
          <div className={`w-16 h-16 rounded-full border-2 ${theme === 'dark' ? 'border-amber-500' : 'border-amber-600'} flex items-center justify-center
                         ${!reducedMotion ? 'animate-float' : ''}`}>
            <Sparkles size={18} className={theme === 'dark' ? 'text-amber-400' : 'text-amber-500'} strokeWidth={2} />
          </div>
        </div>
        
        <div className={`absolute top-32 right-12 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-15' : 'opacity-12'}`}>
          <div className={`w-20 h-20 rounded-full border-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'} flex items-center justify-center
                         ${!reducedMotion ? 'animate-float-delayed' : ''}`}>
            <Terminal size={20} className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'} strokeWidth={2} />
          </div>
        </div>
        
        <div className={`absolute bottom-40 left-16 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-15' : 'opacity-12'}`}>
          <div className={`w-14 h-14 rounded-full border-2 ${theme === 'dark' ? 'border-violet-500' : 'border-violet-600'} flex items-center justify-center
                         ${!reducedMotion ? 'animate-float-delayed-2' : ''}`}>
            <Trophy size={16} className={theme === 'dark' ? 'text-violet-400' : 'text-violet-500'} strokeWidth={2} />
          </div>
        </div>
      </div>

      <main className='max-w-5xl mx-auto px-6 py-12 relative z-10'>
        {/* Welcome header */}
        <div className='mb-10'>
          <h1 className={`text-3xl lg:text-4xl font-bold ${t.text} leading-tight`}>
            Welcome back, {profile?.name || 'Student'}
          </h1>
          <p className={`${t.textMuted} mt-2 text-base`}>
            {profile?.department} • Year {profile?.year}
          </p>
        </div>

        {/* Stats row - glassmorphic cards with staggered entrance */}
        <div 
          ref={statsRef}
          data-section='stats'
          className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12'
        >
          {/* Streak card */}
          <div 
            className={`rounded-2xl border ${t.border} p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                       hover:-translate-y-1 cursor-default
                       ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              backgroundColor: t.cardBg,
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              boxShadow: theme === 'dark' 
                ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              transitionDelay: isVisible('stats') && !reducedMotion ? '0ms' : '0ms'
            }}
          >
            <div className='flex items-start justify-between mb-4'>
              <div className={`w-12 h-12 rounded-full border-2 ${theme === 'dark' ? 'border-orange-500' : 'border-orange-600'} flex items-center justify-center`}>
                <Flame size={20} className={theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-5xl font-bold ${t.text} mb-1`}>
              {streakCount}
            </p>
            <p className={`text-sm ${t.textMuted} font-medium`}>
              Day Streak
            </p>
          </div>

          {/* Badges card */}
          <div 
            className={`rounded-2xl border ${t.border} p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                       hover:-translate-y-1 cursor-default
                       ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              backgroundColor: t.cardBg,
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              boxShadow: theme === 'dark' 
                ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              transitionDelay: isVisible('stats') && !reducedMotion ? '100ms' : '0ms'
            }}
          >
            <div className='flex items-start justify-between mb-4'>
              <div className={`w-12 h-12 rounded-full border-2 ${theme === 'dark' ? 'border-yellow-500' : 'border-yellow-600'} flex items-center justify-center`}>
                <Medal size={20} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-5xl font-bold ${t.text} mb-1`}>
              {badgeCount}
            </p>
            <p className={`text-sm ${t.textMuted} font-medium`}>
              Badges Earned
            </p>
          </div>

          {/* Sessions card */}
          <div 
            className={`rounded-2xl border ${t.border} p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                       hover:-translate-y-1 cursor-default
                       ${isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              backgroundColor: t.cardBg,
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              boxShadow: theme === 'dark' 
                ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              transitionDelay: isVisible('stats') && !reducedMotion ? '200ms' : '0ms'
            }}
          >
            <div className='flex items-start justify-between mb-4'>
              <div className={`w-12 h-12 rounded-full border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-blue-600'} flex items-center justify-center`}>
                <BookOpen size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-5xl font-bold ${t.text} mb-1`}>
              {sessionCount}
            </p>
            <p className={`text-sm ${t.textMuted} font-medium`}>
              Sessions Completed
            </p>
          </div>
        </div>

        {/* Badge Grid section */}
        <div 
          ref={badgeGridRef}
          data-section='badges'
          className={`rounded-2xl border ${t.border} p-8 shadow-2xl mb-12 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                     ${isVisible('badges') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            backgroundColor: t.cardBg,
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)'
          }}
        >
          <h2 className={`text-xl font-bold ${t.text} mb-6`}>Your Badges</h2>
          <BadgeGrid earnedBadges={profile?.badges || []} />
        </div>

        {/* Start lab CTA - visual anchor */}
        <div 
          ref={ctaRef}
          data-section='cta'
          className={`rounded-3xl border border-white/10 p-10 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] relative overflow-hidden
                     ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.9) 0%, rgba(99, 102, 241, 0.85) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)'
          }}
        >
          {/* Background trophy accent */}
          <div className='absolute top-8 right-8 opacity-10'>
            <Trophy size={120} strokeWidth={1.5} />
          </div>
          
          <div className='relative z-10'>
            <h2 className='text-2xl lg:text-3xl font-bold text-white mb-2'>
              Ready for today's lab?
            </h2>
            <p className='text-blue-100 text-base mb-6 max-w-xl'>
              Pick a program and start your proctored session. Build real skills with AI-guided hints.
            </p>
            <button
              onClick={() => navigate('/student/programs')}
              className='bg-white text-[#6366F1] font-bold text-base px-8 py-4 rounded-xl
                         flex items-center gap-2 hover:bg-blue-50 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
                         hover:-translate-y-1 hover:shadow-xl shadow-lg'
            >
              Browse Programs <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 7s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-delayed-2 {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-delayed-2 {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
