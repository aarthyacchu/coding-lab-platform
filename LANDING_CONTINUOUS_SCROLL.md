# Landing Page - Continuous Scroll-Driven Experience

## Design Philosophy

**One continuous canvas** — no formal section boundaries, no background shifts, no divider lines. The entire page is a single flowing scroll experience with layered parallax depth.

## Icon Style (Monoline)

**Simple monoline line-art icons** inside colored ring outlines:
- Lucide-react icons (already in stack — perfect monoline style)
- `strokeWidth={1.5}` for consistent uniform stroke
- No fill, no duotone, no flat-fill illustrations
- Sized consistently inside circular borders
- Optional small all-caps caption underneath (e.g., "HINT", "CODE", "REPORT")

**Badge structure:**
```jsx
<div className='w-12 h-12 rounded-full border-2 border-{color} flex items-center justify-center'>
  <Icon size={20} className='text-{color}' strokeWidth={1.5} />
</div>
```

## Hero Section

### Icon Badge Row
7 monoline icon badges with varied muted ring colors + captions:
1. **User** (rose) — "LEARN"
2. **Lightbulb** (amber) — "HINT"
3. **Terminal** (emerald) — "CODE"
4. **BarChart3** (blue) — "REPORT"
5. **Shield** (violet) — "GUARD"
6. **Trophy** (cyan) — "BADGE"
7. **CheckCircle** (pink) — "QUIZ"

### Cycling Headline
```
Where students learn logic,
then [• {cycling word}] it themselves.
```

**Cycling words:** build → debug → learn → grow → ship  
**Interval:** 2 seconds  
**Animation:** Smooth cross-fade/slide (opacity + translateY)  
**Reduced motion:** Freezes on first word ("build"), no cycling

### Structure
- Tagline with cycling pill word
- Short subtext line
- Two CTAs (solid + ghost)
- Two floating decorative badges with hand-drawn accents (bottom corners, desktop only)

## Continuous Scroll Body

### No Formal Sections
- One continuous background color (no shifts)
- No divider lines
- No eyebrow-labeled blocks
- No bounded section containers

### Real Parallax System

**Three mock UI panels** appear at different scroll depths:
1. **AI Logic Explainer** (top ~800px)
2. **Code Editor + Hint** (middle ~1500px)
3. **Teacher Dashboard** (lower ~2200px)

**Each panel:**
- Drifts at slightly different speed than surrounding copy
- Has scroll-driven 3D tilt that deepens as it passes through viewport center
- Continuously tied to scroll position (not one-time settle)
- Glow behind, layered shadow, hover effect

**Parallax speeds:**
- Ambient background icon badges: `-0.15` to `-0.25` (drift backward slowly)
- Mock UI panels: `0.05` to `0.08` (drift forward slightly)
- Floating copy text: `0.02` (minimal drift)

### 3D Tilt Calculation
```jsx
const get3DTilt = (baseOffset, strength = 0.02) => {
  const viewportCenter = window.innerHeight / 2
  const elementOffset = baseOffset - scrollY
  const distanceFromCenter = viewportCenter - elementOffset
  const rotation = distanceFromCenter * strength
  const clampedRotation = Math.max(-8, Math.min(8, rotation))
  return { 
    transform: `perspective(1000px) rotateX(${-clampedRotation}deg) rotateY(${clampedRotation * 0.5}deg)`
  }
}
```

**Result:** Panels rotate as they move through the viewport — looking down at them as they approach center, looking up at them as they pass

### Ambient Icon Badges (Background Layer)
Scattered monoline icon badges throughout the page:
- Float at slower parallax speed (`-0.15` to `-0.25`)
- Low opacity (`opacity-15` to `opacity-20`)
- Create layered depth feeling
- Desktop only (`hidden lg:block`)
- Positioned at various scroll depths (600px, 900px, 1400px, 2000px, 2600px)

### Floating Copy
Short supporting text for each panel appears nearby:
- What it is, one line
- Floats in the flow (not inside bounded section)
- Subtle parallax (`0.02`)

## Closing Strip + Footer

Still natural end of page:
- Simple row of 3 plain-text capabilities (no fake stats)
- Footer with single line

Can use gentle fade/rise as they enter (natural page end)

## Reduced Motion Support

`prefers-reduced-motion: reduce` disables:
- ✅ All parallax transforms
- ✅ Cycling headline (freezes on "build")
- ✅ 3D tilt effects
- ✅ Scroll-driven animations

Falls back to:
- Static layout
- Simple one-time fade-ins (if any)
- No transform calculations

## Theme System (Preserved)

**Light/Dark toggle** in nav (sun/moon icon)  
**Persisted:** `localStorage` key `codelab-theme`  
**Default:** System preference or dark  
**Transition:** Smooth `300ms` color transitions

**Primary accent:** Indigo (#6366F1 light, #818CF8 dark)

## Technical Implementation

### State Management
```jsx
const [theme, setTheme] = useState(/* localStorage + system preference */)
const [scrollY, setScrollY] = useState(0)
const [currentWordIndex, setCurrentWordIndex] = useState(0)
const [reducedMotion, setReducedMotion] = useState(false)
```

### Scroll Handler
```jsx
useEffect(() => {
  if (reducedMotion) return
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [reducedMotion])
```

### Parallax Helper
```jsx
const getParallax = (speed) => {
  if (reducedMotion) return {}
  return { transform: `translateY(${scrollY * speed}px)` }
}
```

### Cycling Words
```jsx
useEffect(() => {
  if (reducedMotion) return
  const interval = setInterval(() => {
    setCurrentWordIndex((prev) => (prev + 1) % cyclingWords.length)
  }, 2000)
  return () => clearInterval(interval)
}, [reducedMotion])
```

## Responsive Behavior

**Desktop (lg+):**
- Full parallax effects
- Ambient background badges visible
- Floating decorative hero badges visible
- 2-column grid for panel + copy

**Mobile/Tablet:**
- Parallax simplified or disabled (to avoid jank)
- Ambient badges hidden
- Decorative badges hidden
- Single column stack

**Touch-friendly:** All interactive elements have adequate tap targets

## Performance Considerations

- Scroll handler uses `{ passive: true }`
- Transform calculations are lightweight
- Reduced motion fallback for accessibility
- Parallax can be conditionally disabled on mobile to prevent performance issues

## What Changed from Previous Version

**Removed:**
- ❌ Formal section boundaries
- ❌ Background color shifts between sections
- ❌ Border dividers
- ❌ Eyebrow labels
- ❌ One-time "settle into place" animations

**Added:**
- ✅ Continuous single-canvas scroll experience
- ✅ Real parallax on all elements (different speeds)
- ✅ Scroll-driven 3D tilt on panels (continuously calculated)
- ✅ Ambient floating icon badges throughout page
- ✅ Cycling headline word with smooth animation
- ✅ Layered depth feeling from parallax speed variations

**Preserved:**
- ✅ Light/dark theme toggle
- ✅ Monoline icon badge style
- ✅ Three mock UI panels (editor, explainer, dashboard)
- ✅ Indigo primary accent
- ✅ Routes and navigation logic
- ✅ Reduced motion support
- ✅ Tailwind v4 + lucide-react stack

## To Test

```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173`

**Test checklist:**
- [ ] Theme toggle works (persists on reload)
- [ ] Headline word cycles every 2 seconds
- [ ] Scroll creates parallax effect on all elements
- [ ] Panels have 3D tilt that changes as you scroll
- [ ] Ambient icon badges drift slowly in background
- [ ] No formal section boundaries or dividers
- [ ] One continuous canvas feeling
- [ ] Floating copy text near panels
- [ ] Capabilities strip + footer at natural page end
- [ ] Reduced motion disables parallax and cycling
- [ ] Responsive on mobile (simplified parallax)
- [ ] Smooth performance while scrolling

## The Experience

**As you scroll:**
1. Hero with cycling word pill
2. Ambient badges drift slowly backward
3. First panel (AI Explainer) drifts forward, tilts in 3D
4. Copy floats nearby at different speed
5. Second panel (Editor) appears, drifts at different speed, tilts differently
6. More ambient badges in background
7. Third panel (Dashboard) appears with its own parallax rhythm
8. Everything feels layered and alive
9. Natural page end with capabilities + footer

**The result:** A cohesive, flowing scroll experience with depth and motion, not a series of discrete sections
