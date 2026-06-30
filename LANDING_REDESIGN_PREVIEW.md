# Landing Page Redesign - Notion-Style Premium Dark

## Design Philosophy

**Notion-inspired premium dark theme** — sleek, friendly, and approachable with realistic product mockups.

### Color Choice: Soft Teal (#3EABA5)
A calm, education-forward teal that feels friendly and modern without the tech-blue coldness or overused purple/cyan.

**Why teal?** Conveys clarity, learning, and trustworthiness. Used **sparingly** for:
- Primary buttons and CTAs
- Icon accents
- Hover states
- Small highlights (tags, hint labels)

### Base Colors (Notion-style warm dark palette)
- Background: `#191919` (warm dark gray, not black)
- Card background: `#202020` (slightly lighter)
- Primary text: `#E8E6E3` (off-white, not pure white)
- Secondary text: `#9B9A97` (warm mid-gray)
- Tertiary text: `#6B6B6B` (muted gray)
- Borders: `#2F2F2F` (subtle, low-contrast)

**Mood:** Soft, calm, premium — not stark or high-contrast like typical dark modes.

## Structure

**Alternating text-visual sections** (Notion's product page pattern):

1. **Hero** — Clean centered introduction with single CTA
2. **Pick a Program** — Copy left, Program Library mockup right
3. **AI Explains Logic** — Logic Explainer mockup left, copy right
4. **Code with Hints** — Copy left, Editor with Hint mockup right  
5. **Teacher Reports** — Dashboard Report mockup left, copy right
6. **CTA** — Final call to action, centered
7. **Footer** — Minimal single-line footer

### Product Mockups (Realistic, Not Abstract)

Each mockup is styled like a believable screenshot:

**1. Program Library Card**
- Dark card background with border
- List of program cards (Fibonacci, Binary Search, Merge Sort)
- Difficulty tags (Easy/Medium/Hard)
- Hover states on cards

**2. AI Logic Explainer Panel**
- Sparkles icon + "Understand the Logic" header
- Structured explanation: "What this program does" + "The approach"
- Checkmarks for bullet points
- Italicized note at bottom explaining AI never gives code

**3. Code Editor with AI Hint**
- Realistic editor chrome (3 dots, filename)
- Dark code editor with syntax highlighting (teal for keywords)
- Python code snippet with cursor
- AI hint panel at bottom with Lightbulb icon
- "Hint #1 of 3" counter

**4. Teacher Dashboard Report**
- BarChart icon + "Student Performance Report" header
- Student name + program + tier badge
- 2x2 metrics grid (Time, Hints, Pass rate, Quiz)
- "Weak concepts detected" section with tags

## Typography

**Clean, friendly sans-serif system** (no dramatic display faces):
- Headlines: `text-3xl` / `text-4xl`, `font-semibold` (600 weight)
- Body: `text-base`, regular weight
- Labels: `text-xs`, `uppercase`, wide tracking
- Code: `font-mono`

**Hierarchy through weight and size,** not through drama or color gradients.

## Motion (Restrained Notion-Style)

- **Gentle scroll reveals:** Fade in + slight upward lift (`translate-y-8` to `0`)
- **Duration:** 700ms ease-out
- **Once only:** No looping, no parallax
- **Subtle hover effects:** 
  - Buttons: slight lift (`-translate-y-0.5`) + shadow increase
  - Program cards: border color change
- **Respects `prefers-reduced-motion`:** Shows final states immediately

## Visual Details

### Rounded Corners
Generous rounding throughout (Notion's signature):
- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` / `rounded-md`
- Tags: `rounded` / `rounded-full`
- Editor chrome: `rounded-xl`

### Shadows
Soft, subtle shadows (not dramatic):
- Cards: `shadow-lg`
- Buttons on hover: `shadow-md`

### Borders
Low-contrast, barely visible:
- `border-[#2F2F2F]` (warm dark gray)
- Accent borders: `border-[#3EABA5]/20` or `/30` (very subtle teal)

## Layout & Spacing

- **Max width:** `max-w-6xl` for content, `max-w-4xl` for hero/CTA
- **Section spacing:** `py-20` (generous vertical rhythm)
- **Grid:** 2-column on desktop (`lg:grid-cols-2`), stacks on mobile
- **Gap:** `gap-12` between text and mockups
- **Padding:** `px-6` consistent horizontal padding

## What Was Removed
❌ Apple-style enormous whitespace  
❌ Full-viewport sections  
❌ Pinned scroll effects  
❌ Oversized headline type (7xl/8xl)  
❌ Single-color minimalism  
❌ Stark high-contrast dark mode  

## What Was Added
✅ Notion-style warm dark palette  
✅ Realistic product mockups (not abstract visuals)  
✅ Alternating text-visual layout  
✅ Generous rounded corners  
✅ Soft shadows  
✅ Friendly, approachable type scale  
✅ Low-contrast borders  
✅ Teal accent used sparingly  

## What Was Kept
✅ All navigation routes (`/login`, `/signup`)  
✅ React Router logic  
✅ Tailwind v4 + lucide-react stack  
✅ No new dependencies  
✅ Responsive design  
✅ Reduced motion support  

## To Test
```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173`

**Test checklist:**
- [ ] Warm dark background (#191919), not stark black
- [ ] Teal accent (#3EABA5) on buttons, icons, tags
- [ ] Alternating text-visual sections down the page
- [ ] Realistic product mockups for each feature
- [ ] Gentle fade + lift animations on scroll
- [ ] Generous rounded corners everywhere
- [ ] Low-contrast, soft aesthetic
- [ ] Friendly, legible type (not oversized)
- [ ] Subtle hover effects on buttons/cards
- [ ] Responsive: stacks cleanly on mobile
- [ ] Reduced motion disables scroll animations

## The Difference
- Previous (Apple): Stark near-black, enormous whitespace, one idea per full screen, oversized confident type, single accent used rarely
- **Current (Notion): Warm dark grays, friendly spacing, alternating text-visual sections, realistic product mockups, soft teal accent, calm premium feel**

