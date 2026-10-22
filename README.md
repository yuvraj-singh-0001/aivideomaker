# 🎬 CineAI Studio — 1-Click AI Cinematic Video Maker
### (Hindi, Hinglish & English Story to Complete Cinematic Movie)

**CineAI Studio** ek client-ready web application hai jahan koi bhi user apni kahani Hindi, Hinglish ya English mein likhe, apne characters ki photo upload kare aur 1 button click karte hi uski complete cinematic video automatically generate ho jati hai.

---

## 🌟 Key Features

1. **Zero Paid API Requirement (100% Free / Self-Contained)**:
   - **Story Decomposer**: Built-in intelligent cinema grammar NLP engine jo story ko shots, camera angles aur lighting mein split karta hai.
   - **Visual Clip Generation**: Free Pollinations.ai (Flux & SDXL) engine (Zero API key, unlimited free HD renders).
   - **Voiceover**: Web Speech API native browser speech synthesis (Hindi `hi-IN` & English `en-IN`/`en-US`).
   - **Background Music**: Web Audio API procedural cinema score engine (Jungle Horror, Romance, Temple Mystic, Action Thriller, Cyberpunk) with automatic voice-ducking.
   - **Video Compositor**: HTML5 Canvas + MediaRecorder generating real downloadable `.mp4` video files with Ken Burns camera movement, subtitles, and audio.

2. **Full Responsive Support**:
   - Mobile and Desktop friendly.
   - 16:9 Cinema / YouTube and 9:16 Shorts / Instagram Reels aspect ratio.

---

## 📱 4 Screens Architecture (As Requested)

### **Screen 1 — My Projects (`ScreenProjects.jsx`)**
- User apne projects create aur manage karta hai (jaise *“Horror Story”*, *“Love Story”*, *“Historical Story”*).
- Search, genre filter, duplicate, delete aur local storage persistence.
- Pre-loaded starter template: *"Ek ladka raat ko jungle mein kho jata hai. Use ek purana mandir milta hai, jahan uski mulaqat ek rahasyamayi aadmi se hoti hai."*

### **Screen 2 — Story Creator (`ScreenStoryCreator.jsx`)**
- Story script textarea with Hindi/Hinglish/English support.
- Visual art style selection:
  - 🎬 Dark Cinematic (Anamorphic 35mm film)
  - 🎨 Anime / Studio Ghibli
  - ✨ 3D Animation (Pixar/Disney)
  - 📽️ Bollywood Vintage (1970s)
  - 🌆 Cyberpunk Sci-Fi
- Character Studio: Photo upload, role assignment (Hero, Heroine, Mystery Man) aur appearance tags.
- Voice & BGM Mood selection.
- **"🎬 Start Automatic AI Filmmaking"** 1-Click button.

### **Screen 3 — Automatic AI Filmmaking (`ScreenAIFilmmaking.jsx`)**
- Visual AI Pipeline Stepper:
  1. Story Decomposition (Narrative beat parsing)
  2. Camera Direction (Wide drone shot, Dutch angle, Close-up, Dolly zoom)
  3. Visual Rendering (Flux/SDXL frame generation)
  4. Voiceover & Dialogue Synthesis
  5. Audio & Score Composition
- Interactive Storyboard:
  - Each shot card displays camera angle, lighting, SFX audio cue, dialogue, and prompt.
  - Ability to re-roll individual visuals or modify camera angles.

### **Screen 4 — Final Video & Theatre (`ScreenFinalVideo.jsx`)**
- Full cinematic player with real-time Ken Burns smooth camera motion.
- Glowing movie-style subtitles with stroke for high readability.
- Dual-channel mixed audio (Voiceover + ducked background music).
- Player controls: Play, Pause, Replay, Subtitles Toggle, Mute, Fullscreen.
- **"Download Final Video (MP4)"** button that stitches all frames and audio into a downloadable video file.
- Screenplay script download (.TXT).

---

## 🚀 How to Run Locally

### Option 1: Run everything with 1 command
```bash
npm start
```
Yeh command backend server (`http://localhost:5000`) aur Vite client frontend (`http://localhost:5174`) dono ko ek sath start kar deta hai.

### Option 2: Run separately
1. **Start Backend**:
   ```bash
   cd server
   node index.js
   ```
2. **Start Frontend Client**:
   ```bash
   cd client
   npm run dev
   ```
   Open `http://localhost:5174` in your browser.
