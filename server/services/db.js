/**
 * ============================================================================
 * PERSISTENT DATABASE ENGINE (Local JSON Store)
 * ============================================================================
 * Provides zero-configuration, robust persistence for Filmmaking Projects,
 * Characters, Scenes, Generated Voices, and Exported MP4 metadata.
 * 
 * MOBILE APP DEVELOPER USAGE:
 *  - GET  /api/projects          -> Returns list of all user video projects
 *  - GET  /api/projects/:id      -> Returns single project with all scene beats
 *  - POST /api/projects          -> Creates or updates a project
 *  - DELETE /api/projects/:id    -> Deletes a project
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_PROJECTS = [
  {
    id: 'proj-pixar-rahul',
    title: 'Ek Chhote Se Ladke Ka Bada Sapna',
    genre: '3D Pixar Animation',
    genreId: 'romance',
    videoFormat: 'cartoon',
    styleId: '3d',
    aspectRatio: '16:9',
    voiceLang: 'hi-IN',
    createdAt: '2026-10-21T18:00:00.000Z',
    updatedAt: new Date().toISOString(),
    story: 'Create a complete 2-minute cinematic 3D cartoon animated short film titled “Ek Chhote Se Ladke Ka Bada Sapna”.',
    characters: [
      {
        id: 'char-rahul',
        name: 'Rahul (16yo Village Boy)',
        role: 'hero',
        description: '16-year-old Indian village boy with slim body, messy black hair, wearing faded blue shirt and brown trousers',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
      },
      {
        id: 'char-mother',
        name: "Rahul's Mother",
        role: 'mother',
        description: '40-year-old loving Indian village woman wearing simple green sari with red border',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
      }
    ],
    scenes: [
      {
        id: 'scene-p1',
        sceneNumber: 1,
        title: 'Scene 1: Golden Sunrise Over Village',
        scriptText: 'Beautiful sunrise over a rural Indian village with mud houses, green fields, birds flying. Rahul stands outside looking at the horizon with hopeful eyes.',
        speaker: 'narrator',
        cameraAngle: 'Extreme Wide Aerial Shot',
        cameraDescription: 'Vast overhead view establishing geography, scale and mood',
        lighting: 'Warm golden sunrise rays illuminating green fields and mud houses',
        emotion: 'Hopeful Wonder',
        sfx: 'Morning village birds, gentle wind, distant rooster',
        voiceover: 'Ek sundar gaon mein, subah ke sunahre suraj ke sath Rahul ke aankhon mein ek bada sapna chamakta hai.',
        duration: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1280&auto=format&fit=crop&q=80',
        backupUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80',
        motionType: 'zoom-in'
      },
      {
        id: 'scene-p2',
        sceneNumber: 2,
        title: 'Scene 2: Daily Struggle & Late Night Study',
        scriptText: 'Rahul studying alone inside his small house under a warm lantern, turning notebook pages and writing carefully.',
        speaker: 'narrator',
        cameraAngle: 'Side-Tracking Movement Shot',
        cameraDescription: 'Camera tracking beside character in motion',
        lighting: 'Warm flickering lantern light, deep cozy shadows, midnight blue window',
        emotion: 'Quiet Determination',
        sfx: 'Turning notebook page sound, pencil scratching, nocturnal crickets',
        voiceover: 'Din bhar ki mehnat ke baad, raat ke diye ki roshni mein Rahul akela padhta rehta hai.',
        duration: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1280&auto=format&fit=crop&q=80',
        backupUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=1280&auto=format&fit=crop&q=80',
        motionType: 'pan-right'
      },
      {
        id: 'scene-p3',
        sceneNumber: 3,
        title: "Scene 3: Mother's Loving Words",
        scriptText: 'Mother sits beside Rahul, places comforting hand on his shoulder and wipes away his tears with love.',
        speaker: 'mother',
        cameraAngle: 'Two-Shot Emotional Interaction',
        cameraDescription: 'Medium shot framing two characters interacting with touch and gaze',
        lighting: 'Soft warm candlelight, emotional chiaroscuro, gentle eyes glowing',
        emotion: 'Loving Hope & Healing',
        sfx: 'Soft emotional piano swell, gentle whisper of breeze',
        voiceover: 'बेटा, गिर जाना हार नहीं है। हार तब है, जब तुम दोबारा उठने की कोशिश छोड़ दो।',
        duration: 5.2,
        imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1280&auto=format&fit=crop&q=80',
        backupUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=1280&auto=format&fit=crop&q=80',
        motionType: 'zoom-in'
      },
      {
        id: 'scene-p4',
        sceneNumber: 4,
        title: 'Scene 4: The Triumphant Result',
        scriptText: 'Rahul outside school checking his exam result, eyes wide with relief and huge smile of pure happiness.',
        speaker: 'narrator',
        cameraAngle: 'Triumphant Close-Up to Sky',
        cameraDescription: 'Low angle showing relief, happiness and looking upward',
        lighting: 'Bright triumphant sunshine, radiant daylight sky',
        emotion: 'Triumphant Joy & Relief',
        sfx: 'Uplifting joyful strings and bell chimes',
        voiceover: 'Aur aakhirkar mehnat rang laayi! Rahul ne safalta haasil kar li.',
        duration: 4.4,
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1280&auto=format&fit=crop&q=80',
        backupUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1280&auto=format&fit=crop&q=80',
        motionType: 'zoom-out'
      },
      {
        id: 'scene-p5',
        sceneNumber: 5,
        title: 'Scene 5: Sunset Reunion & Mother Hug',
        scriptText: 'Rahul as a successful young adult returns to his village, holding his mothers hands outside their home at sunset and hugging her.',
        speaker: 'rahul',
        cameraAngle: 'Sunset Reunion Two-Shot',
        cameraDescription: 'Warm emotional embrace framed in golden hour backlighting',
        lighting: 'Magical golden orange sunset backlight, glowing dust particles',
        emotion: 'Deep Gratitude & Unconditional Love',
        sfx: 'Rising emotional orchestral symphony, warm hug sound',
        voiceover: 'माँ, आज मैं जो कुछ भी हूँ, आपके विश्वास और आशीर्वाद की वजह से हूँ।',
        duration: 5.4,
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1280&auto=format&fit=crop&q=80',
        backupUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&auto=format&fit=crop&q=80',
        motionType: 'zoom-in'
      },
      {
        id: 'scene-p6',
        sceneNumber: 6,
        title: 'Scene 6: Grand Inspiring Finale',
        scriptText: 'Rahul and mother standing together looking at sunrise over village, camera pulling back into wide shot.',
        speaker: 'narrator',
        cameraAngle: 'Grand Pull-Back Ending Shot',
        cameraDescription: 'Slow cinematic crane withdrawal leaving characters in vast landscape',
        lighting: 'Magnificent golden sunrise over vast green fields',
        emotion: 'Grand Inspiration & Victory',
        sfx: 'Uplifting grand orchestral finale, soaring melody',
        voiceover: 'याद रखना, लोग तुम्हारी शुरुआत देखकर तुम्हें आंकेंगे, लेकिन तुम्हारी मेहनत तय करेगी कि तुम्हारी कहानी का अंत कैसा होगा।',
        duration: 6.2,
        imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1280&auto=format&fit=crop&q=80',
        backupUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1280&auto=format&fit=crop&q=80',
        motionType: 'zoom-out'
      }
    ]
  }
];

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_PROJECTS, null, 2), 'utf8');
      return DEFAULT_PROJECTS;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return DEFAULT_PROJECTS;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

function getAllProjects() {
  return readDB();
}

function getProjectById(id) {
  const projects = readDB();
  return projects.find(p => p.id === id) || null;
}

function saveProject(project) {
  const projects = readDB();
  const index = projects.findIndex(p => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.unshift({
      ...updatedProject,
      createdAt: updatedProject.createdAt || new Date().toISOString()
    });
  }

  writeDB(projects);
  return updatedProject;
}

function deleteProject(id) {
  const projects = readDB();
  const filtered = projects.filter(p => p.id !== id);
  writeDB(filtered);
  return filtered.length !== projects.length;
}

module.exports = {
  getAllProjects,
  getProjectById,
  saveProject,
  deleteProject
};
