# Goose Instructions — Story Teller Web App
# Project
Magical African Winter Adventure — Interactive Story Web App
# Tooling
goose developer extension (text_editor, shell, analyze, image_processor)

## GOAL
Create a **single-page, interactive choose-your-own-adventure web app** with:
- A magical **African heroine** on a **10-step journey**
- Multiple branching choices (at least 3 deep branches)
- At least **3 different endings**
- Save system using **localStorage**
- Mobile-friendly layout
- Winter festival aesthetic infused with African magical elements
- Use of **images**, **ambient background sound**, and **CSS animations**
- Works in-browser (index.html + script.js + styles.css)

The story setting should blend:
- Avatar: Way of Water (bioluminescent nature, spiritual energy)
- Black Panther (Afrofuturism, cultural richness, tribal symbols)
- The Lion King (coming-of-age heroism, nature themes)
- Winter fantasy festival (snow-like glowing particles, festive ambience)

The heroine’s name: **NAYA**  
Goal: **Recover the Heart-Stone of Iroko before the 10th moonrise.**  
Each step introduces a new challenge where the user chooses her path.

---

## PROJECT STRUCTURE
Create the following files:
index.html
styles.css
script.js
assets/
images/
bg-night-sky.webp
bg-biome.webp
naya.webp
symbol-forest.webp
symbol-mountain.webp
symbol-spirit.webp
audio/
ambient-wind.mp3
mystical-chime.mp3


If assets do not exist locally, create placeholder files.

---

## MAIN FEATURES
1. **Interactive Story Engine**
   - Story progresses in 10 steps.
   - Each step has 2–3 choices.
   - Choices branch into unique story paths.
   - At least 3 distinct endings:
     - Triumph Ending (Naya restores the Heart-Stone)
     - Tragic Ending (Naya is trapped in the Spirit Realm)
     - Wanderer Ending (Naya chooses a new destiny)

2. **UI Requirements**
   - Large centered story text area
   - Choice buttons with icons and hover glow
   - Winter-African aesthetic using:
     - Deep blues, purples, golds
     - Snow-like glowing particles animated with CSS
     - Cultural patterns (ASCII/emoji ok)
   - Persistent sound toggle button
   - Restart button

3. **Animations**
   - Soft snowfall particles (CSS keyframes)
   - Button hover shimmer
   - Background fade transitions between steps

4. **Sounds**
   - Looping ambient winter-forest wind
   - Soft chime sound on each choice click

5. **Save System**
   - Save story progress in `localStorage`:
     - currentStep
     - chosenPath array
   - When user refreshes, resume from last step.

6. **Responsive Design**
   - Mobile-first layout
   - Scale text and buttons gracefully

---

## IMPLEMENTATION STEPS FOR GOOSE

### 1. Create `index.html`
- Build full HTML skeleton.
- Include:
  - title: “Naya and the Heart-Stone”
  - main container for story text
  - choice buttons
  - restart + sound toggle
  - winter particle background layer
- Link `styles.css` and `script.js`.

### 2. Create `styles.css`
Include:
- Full-screen enchanted winter night background.
- Bioluminescent particle animation (CSS keyframes).
- African tribal-inspired glowing borders.
- Large readable text with magical theme.
- Gold-glow buttons with festive styling.
- Responsive layout rules.

### 3. Create `script.js`
Implement:
- Story data structure with 10 steps:


const story = {
step1: { text, choices: [...] },
step2: { ... },
...
}

- Choice handler to progress story.
- Branching logic with different endings.
- Background fade transitions.
- Sound player for ambient + chime.
- localStorage save/resume functions:
- saveProgress()
- loadProgress()
- clearProgress()

### 4. Add placeholder assets (if needed)
- Create placeholder images (solid color + text).
- Create silent or simple sound files (1–2 sec white noise).

### 5. Run development server
Use goose shell:


python3 -m http.server 5050

or 


npx serve .


### 6. Verify:
- Story runs step-by-step.
- Branching choices work.
- Endings trigger correctly.
- Restart resets storage.
- Styling is magical and winter-themed.
- Sounds play & are toggle-able.
- Mobile layout works.

---

## STORY OUTLINE FOR THE APP
Use the following summary inside script.js:

### Step 1:
Naya enters the glowing Winter Iroko Forest. She must choose:
- Path of Whispering Trees
- Path of Frozen Spirits

### Step 2:
She meets the winter guide, **Okani**, who tests her courage.

### Step 3:
Choose an elemental affinity:
- Water (Avatar-like)
- Earth (Lion King nature)
- Light (Black Panther tech-magic)

### Step 4:
First challenge (branch-dependent).

### Step 5:
Naya confronts illusions of doubt.

### Step 6:
Journey through the Spirit Lake of Memories.

### Step 7:
Battle the frost-shadow creature.

### Step 8:
Enter the Celestial Canopy.

### Step 9:
Final choice:
- Sacrifice
- Fight
- Transform

### Step 10:
Ending logic:
- Triumph, Tragic, or Wanderer.

All text is poetic, African-inspired, adventurous, with winter fantasy elements.

---

## FINAL COMMAND
After building all files, goose will finish by printing:



✨ Your magical African winter story world is ready. Run index.html in your browser to begin the adventure of Naya and the Heart-Stone.


