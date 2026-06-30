# Landing Page Rebuild - Light/Dark Theme Toggle

## Design System

### Primary Accent Color: Indigo
- **Light mode:** `#6366F1` (vibrant indigo)
- **Dark mode:** `#818CF8` (softer indigo)
- Used consistently for: buttons, links, headline pill, icon accents

### Hero Badge Ring Colors (Muted Pastels - The One Playful Moment)
A family of 6-7 muted accent colors for the icon badge row only:
- **Rose:** `rose-600/400` with `rose-200/700` rings
- **Amber:** `amber-600/400` with `amber-200/700` rings
- **Emerald:** `emerald-600/400` with `emerald-200/700` rings
- **Blue:** `blue-600/400` with `blue-200/700` rings
- **Violet:** `violet-600/400` with `violet-200/700` rings
- **Cyan:** `cyan-600/400` with `cyan-200/700` rings
- **Pink:** `pink-600/400` with `pink-200/700` rings

### Dark Theme Palette
- **Background:** `#1A1A1A` (warm dark, not pure black)
- **Background alt:** `#1E1E1E` (sections)
- **Card background:** `#242424`
- **Text primary:** `#E8E6E3` (off-white)
- **Text secondary:** `#9B9A97` (warm mid-gray)
- **Text tertiary:** `#6B6B6B` (muted gray)
- **Border:** `#2F2F2F` (low-contrast)
- **Shadow:** Deep layered (`0_20px_50px_rgba(0,0,0,0.5)`)
- **Glow:** Indigo tint (`#818CF8/5`)

### Light Theme Palette
- **Background:** `#FDFCFB` (warm cream, not stark white)
- **Background alt:** `#F8F7F6` (sections)
- **Card background:** `white`
- **Text primary:** `#1A1A1A` (dark)
- **Text secondary:** `#6B6B6B` (mid-gray)
- **Text tertiary:** `#9B9A97` (light gray)
- **Border:** `#E5E3E0` (soft beige)
- **Shadow:** Soft subtle (`0_20px_50px_rgba(0,0,0,0.08)`)
- **Glow:** Indigo tint (`#6366F1/5`)

### Theme Toggle
- **Location:** Nav bar, right side before auth buttons
- **Icon:** Sun (when dark mode active), Moon (when light mode active)
- **Persistence:** `localStorage` key `codelab-theme`
- **Default:** System preference or dark mode
- **Transition:** Smooth `300ms` color transitions, no flash

## Hero Section (Notion Pattern)

### Icon Badge Row
7 circular badges with different muted pastel ring colors:
1. **User** (rose) — Student/learner
2. **Lightbulb** (amber) — AI hints
3. **Terminal** (emerald) — Code editor
4. **BarChart3** (blue) — Teacher reports
5. **Shield** (violet) — Integrity/proctoring
6. **Trophy** (cyan) — Badges/achievements
7. **CheckCircle** (pink) — Quizzes/validation

### Tagline Headline
```
Where students learn logic,
then [• build] it themselves.
```
- Two-line bold tagline
- "build" inside rounded pill with primary accent color
- Small dot bullet (`•`) before "build" inside the pill
- Large size: `text-5xl sm:text-6xl font-bold`

### Subtext
One short supporting line:
"AI-guided coding labs for college courses — proctored sessions, smart hints, automatic teacher reports."

### CTAs
- **Primary:** "Start a session" (solid indigo button) → `/signup`
- **Secondary:** "I already have an account" (ghost button) → `/login`

### Floating Decorative Badges
Two small icon badges near bottom corners:
- **Bottom left:** Sparkles icon with small "+" sparkle accent nearby
- **Bottom right:** CheckCircle icon with hand-drawn swoosh line nearby
- Hidden on mobile (`hidden lg:block`)
- Subtle, not cluttered

## Feature Sections

### Structure
Alternating layout pattern down the page:
1. **AI Explains Logic:** Image left / Text right
2. **Code Editor with Hints:** Text left / Image right
3. **Teacher Reports:** Image left / Text right

### Each Section Contains
- **Icon badge pill eyebrow:** Small colored badge (reusing hero icon style) + uppercase label
- **Bold short headline:** `text-3xl sm:text-4xl font-bold`
- **One-line supporting text:** `text-base` secondary color
- **Mock UI panel:** Large, dominant, with 3D depth treatment

### 3D Depth Treatment (Unchanged)
- Glow behind card (indigo tint, low opacity)
- Layered shadows (theme-appropriate depth)
- Resting tilt (slight rotation on enter, settles to `rotate-0`)
- Hover lift (`-translate-y-1`) with shadow deepening
- Scroll-into-view animation (once only)

## Section Separation
- **Alternating backgrounds:** Primary bg / Alt bg
- **Borders:** Soft divider lines between sections
- **Spacing:** `py-28` generous vertical padding
- **No sticky nav** (regular sticky nav, not pinned content sections)

## Capabilities Strip (Before Footer)
Simple horizontal row of 3 plain-text capabilities:
1. "3 hints per program" / "never the answer"
2. "Plagiarism checked" / "structurally, across submissions"
3. "Reports generated" / "automatically after each session"

**Styling:** Clean text-only, no icons, centered grid layout

## Motion
- **Scroll reveals:** Gentle fade + lift on scroll-into-view
- **Mockup panels:** 3D tilt/depth settles into place once on scroll
- **Duration:** `700ms` for reveals, `500ms` for hover
- **Easing:** `ease-out`
- **Once only:** No looping, no parallax
- **Respects:** `prefers-reduced-motion` (shows final states immediately)

## Technical Implementation

### Theme Toggle Logic
```jsx
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('codelab-theme')
  if (saved) return saved
  // Default to system preference or dark
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
})

const toggleTheme = () => {
  const newTheme = theme === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
  localStorage.setItem('codelab-theme', newTheme)
}
```

### Theme Classes Object
```jsx
const themeClasses = {
  dark: { /* ...dark colors */ },
  light: { /* ...light colors */ }
}
const t = themeClasses[theme]
```

### Smooth Transitions
All color-changing elements have `transition-colors duration-300`:
- Main container `<div>`
- Nav bar
- All sections
- All text elements
- All cards/panels

## Responsive Behavior
- **Hero badges:** Full row on desktop, wraps on mobile
- **Floating decorative badges:** Hidden on mobile (`hidden lg:block`)
- **Feature sections:** 2-column grid on desktop, stacks on mobile
- **Capabilities strip:** 3-column grid on desktop, stacks on mobile
- **Touch-friendly:** All buttons and toggles have adequate tap targets

## Routes (Unchanged)
✅ `/login` — Login page  
✅ `/signup` — Signup page  
✅ All existing navigation logic preserved  

## Stack (Unchanged)
✅ Tailwind v4  
✅ lucide-react icons  
✅ react-router-dom  
✅ No additional dependencies  

## To Test

```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173`

**Test checklist:**
- [ ] Theme toggle in nav (sun/moon icon)
- [ ] Theme persists on page reload
- [ ] Smooth color transitions on theme switch (no flash)
- [ ] Hero icon badge row with 7 different colored badges
- [ ] Headline with "build" in indigo pill with dot bullet
- [ ] Two floating decorative badges in hero corners (desktop)
- [ ] Three feature sections with alternating layout
- [ ] Icon badge pill eyebrows on each section
- [ ] 3D depth on all mockup panels (glow, shadow, tilt, hover lift)
- [ ] Capabilities strip before footer
- [ ] Both themes look premium and intentional
- [ ] Dark theme: warm grays, soft shadows
- [ ] Light theme: cream background, subtle shadows
- [ ] Responsive on mobile (stacks properly)
- [ ] Reduced motion support

## The Rebuild Summary
**Complete redesign with:**
- Light/dark theme toggle (persisted, smooth transitions)
- Notion-inspired hero pattern (icon badge row, pill headline with dot bullet)
- Indigo as single primary accent (with muted pastel family for hero badges only)
- Premium intentional feel in both themes
- Warm color palettes (not stark)
- Same structure: alternating feature sections, 3D mockup panels
- Capabilities strip replacing generic benefits
- Floating decorative badges for "alive" detail
