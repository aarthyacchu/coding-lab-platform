# Landing Page - Asymmetric Bento Grid Layout

## Typography (Precise Values)

### H1 (Hero Headline)
- **Size:** `72px` mobile, `80px` desktop (`text-[72px] sm:text-[80px]`)
- **Weight:** `700` (`font-bold`)
- **Line height:** `1.1` (`leading-[1.1]`)
- **Letter spacing:** `-0.04em` (`tracking-[-0.04em]`)

### Hero Subtitle
- **Size:** `21px` (`text-[21px]`)
- **Weight:** `400` (regular)
- **Line height:** `1.5` (`leading-[1.5]`)
- **Color:** Muted/secondary text token (softened charcoal in light, softened off-white in dark)

### H2 (Card Headings)
- **Size:** `40-44px` (`text-[40px]` to `text-[44px]`)
- **Weight:** `700` (`font-bold`)
- **Line height:** `1.15` (`leading-[1.15]`)
- **Tracking:** Tight (`tracking-tight`)

### Eyebrow/Over-title
- **Size:** `14px` (`text-sm`)
- **Weight:** `500` (`font-medium`)
- **Style:** Uppercase with wide tracking
- **Color:** Muted text token

## Dynamic Word-Cycling Pill

**Structure:**
- Inline-block capsule with fully rounded corners (`rounded-full`)
- Padding: `px-6 py-1` (4px vertical, 24px horizontal, with 16px on icon side)
- Background: Soft desaturated pastel tint of primary accent (`accentSoft` token)

**AI Indicator Dot:**
- Small solid circle (`w-2 h-2 rounded-full`)
- Vibrant/electric accent color (`accentVibrant` token)
- Positioned immediately left of text
- Acts as status/active marker

**Cycling Words:**
- List: code → debug → learn → think → ship
- Interval: 2 seconds
- Animation: Smooth cross-fade (opacity + translateY)
- Freezes on first word under `prefers-reduced-motion`

**Implementation:**
```jsx
<span className='inline-flex items-center gap-3 bg-accent-soft px-6 py-1 rounded-full'>
  <span className='w-2 h-2 rounded-full bg-accent-vibrant' />
  <span className='relative inline-block w-28 h-[1.2em]'>
    {words.map((word, idx) => (
      <span className={`absolute ${idx === current ? 'opacity-100' : 'opacity-0'}`}>
        {word}
      </span>
    ))}
  </span>
</span>
```

## Bento Grid Layout

**Structure:** Asymmetric grid with varying card sizes:
1. **Card 1 (Full width):** AI Logic Explainer
2. **Card 2 (60/40 split):** Code Editor with Hints
3. **Card 3 (Full width, reverse):** Teacher Dashboard

**Spacing:**
- Grid gap: `space-y-6` (24px vertical between cards)
- Card padding: `p-8 sm:p-12` (32px to 48px responsive)
- Internal grid gap: `gap-12` (48px between content and mockup)

**Background Strategy:**
Each card has distinct solid background:
- Card 1: `cardBg1` token (neutral dark)
- Card 2: `cardAccentBg` token (accent-tinted)
- Card 3: `cardBg1` token (neutral dark)

Visually separates from page's base background

## Card Anatomy

Every Bento card contains:

### 1. Eyebrow/Over-title
- Icon badge (monoline icon in colored ring)
- Category label text
- Example: "AI Guidance", "Proctored Editor", "For Teachers"

### 2. Card Title
- Size: `text-[40px]` to `text-[44px]`
- Tight line height: `leading-[1.15]`
- Action-benefit phrasing:
  - "You understand the approach. The AI never codes it for you."
  - "Write code. Get hints when stuck."
  - "Zero grading. Full insight into every student."

### 3. Micro-CTA
- Small solid circle (`w-10 h-10 rounded-full`)
- High-contrast neutral background (`microCTA` token)
  - Near-black in light mode
  - Near-white in dark mode
- Clean arrow icon (`ArrowUpRight`) in inverse color
- Positioned under title

### 4. Mockup Canvas
- Existing mock UI panel (editor, explainer, dashboard)
- Styled as clean browser/app window
- Rounded corners (`rounded-2xl`)
- Subtle drop shadow
- Simplified UI text
- Positioned opposite the text
- Optional: can overflow slightly for depth

## Hover Interactions

**On card hover:**
```css
transform: translateY(-4px)
box-shadow: deepening shadow
transition: cubic-bezier(0.25, 1, 0.5, 1) 0.3s
```

**Micro-CTA arrow on hover:**
```css
transform: translateX(4px)
transition: transform 0.3s
```

**Implementation:**
```jsx
className='group hover:-translate-y-1 hover:shadow-[enhanced] 
           transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]'

// Arrow inside:
className='transition-transform duration-300 group-hover:translate-x-1'
```

## Color Tokens

### Dark Theme
- `bg`: `#0F0F10` (deep near-black)
- `text`: `#EDEDED` (off-white)
- `textMuted`: `#A1A1A3` (softened gray)
- `cardBg1`: `#1A1A1D` (neutral dark card)
- `cardBg2`: `#18181B` (slightly lighter)
- `cardAccentBg`: `#2D2D35` (accent-tinted card)
- `accent`: `#818CF8` (indigo)
- `accentSoft`: `#818CF8/10` with `#A5B4FC` text
- `accentVibrant`: `#818CF8`
- `microCTA`: `#EDEDED` bg with `#0F0F10` text

### Light Theme
- `bg`: `#FAFAFA` (warm cream)
- `text`: `#171717` (near-black)
- `textMuted`: `#737373` (mid-gray)
- `cardBg1`: `white`
- `cardBg2`: `#F5F5F5` (light gray)
- `cardAccentBg`: `#EEF2FF` (indigo tint)
- `accent`: `#6366F1` (indigo)
- `accentSoft`: `#6366F1/10` with `#6366F1` text
- `accentVibrant`: `#6366F1`
- `microCTA`: `#171717` bg with `#FAFAFA` text

## Icon Style (Monoline)

**All icons use lucide-react:**
- Simple uniform stroke: `strokeWidth={1.5}`
- No fill, no duotone
- Inside colored ring outlines
- Sized consistently: `size={14}` to `size={18}`

**Badge structure:**
```jsx
<div className='w-8 h-8 rounded-full border-2 border-{color} flex items-center justify-center'>
  <Icon size={14} className='text-{color}' strokeWidth={1.5} />
</div>
```

## Entrance Animations

**Scroll-into-view:**
- One-time fade + slight upward lift
- Transition: `duration-700 ease-out`
- States:
  - Hidden: `opacity-0 translate-y-12`
  - Visible: `opacity-100 translate-y-0`
- Uses IntersectionObserver with `threshold: 0.15`

**Reduced motion:**
- Disables entrance animation (shows immediately)
- Disables word-cycling pill (freezes on first word)
- Implementation checks `prefers-reduced-motion: reduce`

## Responsive Behavior

**Desktop (lg+):**
- Bento grid maintains asymmetric layout
- Cards use 2-column grids internally
- Full hover effects

**Mobile/Tablet:**
- Bento rows stack to single column
- Internal card grids stack (content above mockup)
- Cards keep padding/anatomy
- Touch-friendly tap targets

**Grid breakpoints:**
- `lg:grid-cols-2` for full-width cards
- `lg:grid-cols-5` for 60/40 split (2 cols content, 3 cols mockup)

## Theme System (Preserved)

**Toggle:** Sun/moon icon in nav  
**Persistence:** `localStorage` key `codelab-theme`  
**Default:** System preference or dark  
**Transition:** Smooth `300ms` color transitions  
**No flash:** Theme loaded before render

## Technical Implementation

### State Management
```jsx
const [theme, setTheme] = useState(/* localStorage + system */)
const [currentWordIndex, setCurrentWordIndex] = useState(0)
const [reducedMotion, setReducedMotion] = useState(false)
const [visibleCards, setVisibleCards] = useState(new Set())
```

### Cycling Effect
```jsx
useEffect(() => {
  if (reducedMotion) return
  const interval = setInterval(() => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length)
  }, 2000)
  return () => clearInterval(interval)
}, [reducedMotion])
```

### Intersection Observer
```jsx
useEffect(() => {
  if (reducedMotion) {
    setVisibleCards(new Set(['hero', 'card1', 'card2', 'card3']))
    return
  }
  const observer = new IntersectionObserver(/* ... */)
  // Observe all card refs
}, [reducedMotion])
```

## What Changed from Previous Version

**Removed:**
- ❌ Continuous scroll/parallax system
- ❌ Scroll-driven 3D tilt
- ❌ Ambient floating badges
- ❌ Parallax speed variations
- ❌ Multiple section boundaries

**Added:**
- ✅ Asymmetric Bento Grid layout
- ✅ Precise typography values (72-80px headline, etc.)
- ✅ Dynamic word-cycling pill with AI indicator dot
- ✅ Micro-CTA circles with arrows
- ✅ Distinct card backgrounds (accent-tinted, neutral)
- ✅ Cubic-bezier hover transitions
- ✅ Action-benefit card titles

**Preserved:**
- ✅ Light/dark theme toggle
- ✅ Monoline icon badges
- ✅ Three mock UI panels
- ✅ Indigo primary accent
- ✅ Routes and navigation
- ✅ Reduced motion support
- ✅ Tailwind v4 + lucide-react

## To Test

```bash
# Server should already be running
# Visit http://localhost:5173
```

**Test checklist:**
- [ ] Hero headline at 72-80px
- [ ] Word cycles in pill every 2s (code → debug → learn → think → ship)
- [ ] AI indicator dot visible in pill
- [ ] Three Bento cards with distinct backgrounds
- [ ] Card titles use action-benefit phrasing
- [ ] Micro-CTA arrows present under each title
- [ ] Cards lift on hover (`translateY(-4px)`)
- [ ] Arrows shift right on card hover
- [ ] One-time fade-up entrance on scroll
- [ ] Theme toggle works (persists)
- [ ] Reduced motion disables cycling and animations
- [ ] Responsive: stacks cleanly on mobile
- [ ] All icons are monoline style (lucide-react)

## The Result

A modern, premium landing page with:
- **Bold, precise typography** (exact px values, tight tracking)
- **Living headline** (cycling word with AI indicator dot)
- **Asymmetric Bento Grid** (varying card sizes, distinct backgrounds)
- **Micro-interactions** (hover lift, arrow shift, cubic-bezier easing)
- **Action-benefit messaging** (clear value per card)
- **Premium feel** (high-contrast CTAs, simplified mockups, generous spacing)
