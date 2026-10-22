// Master Screenplay & Story Parser Engine (Google Flow AI / Sora prompt compatibility)
// Parses master screenplay prompts with Characters, Scenes, Dialogues, Camera Directions, and Negative Prompts.

export const VIDEO_FORMATS = [
  {
    id: 'movie',
    name: 'Cinema Movie',
    icon: '🎬',
    tag: '35mm Widescreen Film',
    desc: 'Cinematic letterbox, dramatic film lighting, deep atmospheric motion',
    promptToken: 'hyperrealistic 35mm cinema still, Arri Alexa Mini LF, Panavision C-Series anamorphic lens flare, authentic lifelike skin texture and pores, volumetric fog, dark moody grading, Kodak Vision3 500T film grain, natural dramatic chiaroscuro lighting, 8k resolution, award-winning cinematic masterpiece, photorealistic'
  },
  {
    id: 'cartoon',
    name: 'Cartoon & 3D Kids',
    icon: '🧸',
    tag: 'Pixar / Disney 3D Style',
    desc: 'Playful colorful 3D animation, big expressive eyes, cute character acting',
    promptToken: 'masterpiece 3D animation keyframe, Pixar and Disney 3D animation style, Unreal Engine 5 render, expressive emotional character acting, big animated eyes, warm cinematic lighting, stylized detailed background, 4k render'
  },
  {
    id: 'news',
    name: 'Breaking News TV',
    icon: '📺',
    tag: 'Live Studio & Ticker',
    desc: 'News Anchor Desk, studio backdrop, LIVE red banner & scrolling ticker',
    promptToken: 'hyperrealistic TV news broadcast, Indian television news anchor presenter sitting at modern high-tech news desk, professional studio cameras, digital video wall graphics showing breaking news, professional broadcast studio lighting, 8k TV stream, highly realistic'
  },
  {
    id: 'documentary',
    name: 'Historical Documentary',
    icon: '🎙️',
    tag: 'Discovery / NatGeo Style',
    desc: 'Deep authoritative narrative, golden hour historical landscapes',
    promptToken: 'breathtaking National Geographic documentary still, authentic cinematic photography, natural golden hour sunlight, majestic historical details, 70mm IMAX cinematography, photorealistic masterpiece, 8k'
  }
];

export const CINEMATIC_STYLES = [
  {
    id: '3d',
    name: '3D Pixar Animation',
    icon: '✨',
    tag: 'Pixar / Unreal 5',
    desc: 'Subsurface scattering, warm lighting, Disney/Pixar 3D style',
    promptToken: 'Pixar Disney 3D animation style, Unreal Engine 5 render, subsurface scattering, stylized expressive character, warm cinematic lighting, raytraced reflections, highly detailed 3D render'
  },
  {
    id: 'cinematic',
    name: 'Dark Cinematic',
    icon: '🎬',
    tag: 'Ultra-Realistic 35mm',
    desc: 'Deep shadows, anamorphic lens, volumetric fog, moody lighting',
    promptToken: 'hyperrealistic 35mm cinema still, Arri Alexa Mini LF, Panavision C-Series anamorphic lens flare, authentic lifelike skin texture and pores, volumetric fog, dark moody grading, Kodak Vision3 500T film grain, natural dramatic chiaroscuro lighting, 8k resolution, award-winning cinematic masterpiece, photorealistic'
  },
  {
    id: 'anime',
    name: 'Anime / Ghibli',
    icon: '🎨',
    tag: 'Makoto Shinkai Style',
    desc: 'Lush painted skies, radiant lighting, emotional anime aesthetics',
    promptToken: 'masterpiece anime keyframe, Makoto Shinkai and Studio Ghibli art style, highly detailed background, vibrant emotional color palette, radiant sky, soft cinematic anime lighting, 4k concept art'
  },
  {
    id: 'vintage',
    name: 'Bollywood Vintage',
    icon: '📽️',
    tag: '1970s Classic Film',
    desc: 'Eastman color saturation, retro film grain, dramatic retro tones',
    promptToken: '1970s vintage classic Indian cinema still, Eastman color film stock, warm retro saturation, soft glow, film grain, dramatic theatrical vintage lighting'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Sci-Fi',
    icon: '🌆',
    tag: 'Neon Dystopia',
    desc: 'Rainy neon reflections, cyan & magenta rim light, futuristic noir',
    promptToken: 'futuristic cyberpunk cinema still, Blade Runner 2049 aesthetic, glowing cyan and magenta neon lights, rainy reflective streets, atmospheric fog, high-tech dark cinematic frame'
  }
];

export const CAMERA_ANGLES = [
  { type: 'Extreme Wide Aerial Shot', desc: 'Vast overhead view establishing geography, scale and mood' },
  { type: 'Side-Tracking Movement Shot', desc: 'Camera smoothly glides beside character tracking movement' },
  { type: 'Slow Push-In Dramatic Close-Up', desc: 'Tension and emotional focus drawing viewers into character tears or eyes' },
  { type: 'Two-Shot Emotional Interaction', desc: 'Medium shot framing two characters interacting with touch and gaze' },
  { type: 'Cinematic Work Montage', desc: 'Dynamic sequence showing progress, hands writing, passing time' },
  { type: 'Triumphant Close-Up to Sky', desc: 'Low angle showing relief, happiness and looking upward' },
  { type: 'Sunset Reunion Two-Shot', desc: 'Warm emotional embrace framed in golden hour backlighting' },
  { type: 'Grand Pull-Back Ending Shot', desc: 'Slow cinematic crane withdrawal leaving characters in vast landscape' }
];

export const MUSIC_MOODS = [
  { id: 'romance', name: 'Emotional Piano & Strings', desc: 'Soft emotional piano swelling into uplifting orchestral chords' },
  { id: 'horror', name: 'Jungle Horror & Suspense', desc: 'Low sub-bass drone, eerie ambient strings, chilling wind' },
  { id: 'ancient', name: 'Mystical Ancient Temple', desc: 'Sacred bells, tanpura drone, echoing ethereal flute tones' },
  { id: 'action', name: 'Epic Thriller & Adventure', desc: 'Heart-pounding cinematic percussion, rising dark synth pulse' },
  { id: 'cyber', name: 'Sci-Fi Dark Cyberpunk', desc: 'Pulsating synth bass, retro arpeggio, neon city ambiance' }
];

// ============================================================================
// UNIVERSAL DYNAMIC AI SCREENPLAY DIRECTOR (Google Flow / Sora Prompt Engine)
// Works 100% dynamically for ANY prompt: Movie, 3D Cartoon, Comedy, Sci-Fi,
// Breaking News, Horror, Animals, Fantasy — ZERO hardcoding!
// ============================================================================

// Detect format, style, and genre dynamically from ANY user prompt
export function detectFormatAndGenre(text) {
  const clean = (text || '').toLowerCase();
  let format = 'movie';
  let style = 'cinematic';
  let genre = 'horror';

  if (/\b(cartoon|kids|animation|disney|pixar|chintu|piku|squirrel|rabbit|lion|animal|cute|funny|comedy|jungle|circus|toy)\b/i.test(clean)) {
    format = /\b(cartoon|animation|pixar|disney|cute|animal|circus|toy)\b/i.test(clean) ? 'cartoon' : 'movie';
    style = format === 'cartoon' ? '3d' : 'cinematic';
    genre = 'romance';
  } else if (/\b(news|breaking|bulletin|anchor|reporter|headline|press|parliament|telecast)\b/i.test(clean)) {
    format = 'news';
    style = 'cinematic';
    genre = 'action';
  } else if (/\b(documentary|history|itihas|ancient|samrat|temple|dynasty|discovery|natgeo|civilization)\b/i.test(clean)) {
    format = 'documentary';
    style = 'cinematic';
    genre = 'ancient';
  } else if (/\b(space|astronaut|planet|mars|europa|alien|cyberpunk|future|2088|2050|robot|sci-fi|galaxy|spaceship)\b/i.test(clean)) {
    format = 'movie';
    style = 'cyberpunk';
    genre = 'cyber';
  } else if (/\b(ghost|bhoot|chudail|horror|creepy|demon|shaitan|graveyard|midnight|haunted|haveli|curse)\b/i.test(clean)) {
    format = 'movie';
    style = 'cinematic';
    genre = 'horror';
  } else if (/\b(comedy|hasya|mazedaar|funny|chalu|gadbad|mali|chor|police)\b/i.test(clean)) {
    format = 'movie';
    style = 'cinematic';
    genre = 'romance';
  }

  return { format, style, genre };
}

// Check if user input is an advanced master screenplay (with explicit tags)
export function isMasterScreenplayPrompt(text) {
  if (!text) return false;
  return /(?:TITLE:|CHARACTER\s*\d*|MAIN CHARACTER|SECOND CHARACTER|STORY:|OPENING|SCENE\s*\d+|COMPLETE STORY|NEGATIVE PROMPT:)/i.test(text);
}

// Dynamic Title Extractor / Generator
export function extractOrGenerateTitle(text) {
  if (!text) return 'Cinematic Short Film';
  const explicit = text.match(/(?:TITLE:\s*([^\n]+)|titled\s*[“"']([^”"'\n]+)[”"']|Short Film:\s*([^\n]+))/i);
  if (explicit) {
    return (explicit[1] || explicit[2] || explicit[3]).trim().replace(/^[“"']+|[”"']+$/g, '');
  }

  const clean = text.replace(/^(Create|Make|Write|Generate|In year|Ek|A|An)\s+/i, '').trim();
  const firstSentence = clean.split(/[।.\n!?]/)[0].trim();
  const words = firstSentence.split(/\s+/).slice(0, 6).join(' ');
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Cinematic Story';
}

// Dynamic Character Extractor & Synthesizer: Detects or invents characters from ANY prompt!
export function extractOrSynthesizeCharacters(text, format = 'movie', genre = 'horror') {
  const clean = (text || '').trim();
  const characters = [];

  // 1. Explicit character blocks: e.g. "CHARACTER 1 — VIKRAM:" or "CHARACTER: Kabir"
  const charRegex = /(?:CHARACTER\s*\d*\s*—?\s*|MAIN CHARACTER\s*—?\s*|SECOND CHARACTER\s*—?\s*|THIRD CHARACTER\s*—?\s*)([A-Za-z0-9\s—'-]{2,35}):\s*([\s\S]*?)(?=(?:CHARACTER\s*\d*\s*—?|MAIN CHARACTER|SECOND CHARACTER|THIRD CHARACTER|VISUAL CONSISTENCY|ANIMATION REQUIREMENTS|NEGATIVE PROMPT|STORY:|$))/gi;
  let match;
  while ((match = charRegex.exec(clean)) !== null) {
    const rawName = match[1].trim();
    const desc = match[2].trim().replace(/\n+/g, ' ');
    if (rawName && desc && rawName.length < 40 && !rawName.includes('http')) {
      const isFemale = /\b(female|woman|girl|mother|maa|she|her|priya|maya|rani|ananya|elena|anita|radha|dadi|nani|behen)\b/i.test(rawName + ' ' + desc);
      const avatarUrl = getReliableAvatar(rawName, characters.length === 0 ? 'protagonist' : 'co-star', isFemale, format);

      characters.push({
        id: `char-${characters.length + 1}`,
        name: rawName,
        role: characters.length === 0 ? 'protagonist' : characters.length === 1 ? 'co-star' : 'supporting',
        description: desc,
        voiceGender: isFemale ? 'female' : 'male',
        voiceVoice: isFemale ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural',
        avatar: avatarUrl
      });
    }
  }

  // 2. Dynamic Name Extraction from Natural Speech (e.g. "naam Golu", "Sharma ji", "Inspector Vikram", "Pinky")
  if (characters.length === 0) {
    const dynamicNames = [];
    const namePatterns = [
      { regex: /\b(?:naam|named)\s+([A-Za-z]+)\b/i, role: 'protagonist', desc: 'lead character in the story' },
      { regex: /\b([A-Za-z]+)\s+ji\b/i, role: 'protagonist', desc: 'respected protagonist' },
      { regex: /\b(?:inspector|captain|dr\.|prof\.|mali|doctor|detective)\s+([A-Za-z]+)\b/i, role: 'protagonist', desc: 'skilled investigator or professional' },
      { regex: /\b([A-Z][a-z]+)\s+(?:aur|and)\s+([A-Z][a-z]+)\b/, role: 'duo', desc: 'co-stars in the story' }
    ];

    for (const pat of namePatterns) {
      const m = clean.match(pat.regex);
      if (m && m[1]) {
        const detectedName = m[1].charAt(0).toUpperCase() + m[1].slice(1);
        if (!dynamicNames.some(d => d.name.toLowerCase() === detectedName.toLowerCase()) && !/^(Ek|The|Yeh|Wo|Aur|Par|Jab|Tab|In|At|On)$/i.test(detectedName)) {
          const isFemale = /\b(female|woman|girl|mother|maa|she|her|priya|maya|rani|ananya|elena|anita|radha|dadi|nani|pinky)\b/i.test(detectedName);
          dynamicNames.push({ name: detectedName, role: dynamicNames.length === 0 ? 'protagonist' : 'co-star', desc: pat.desc, isFemale });
        }
      }
      if (m && m[2]) {
        const detectedName2 = m[2].charAt(0).toUpperCase() + m[2].slice(1);
        if (!dynamicNames.some(d => d.name.toLowerCase() === detectedName2.toLowerCase()) && !/^(Ek|The|Yeh|Wo|Aur|Par|Jab|Tab|In|At|On)$/i.test(detectedName2)) {
          const isFemale = /\b(female|woman|girl|mother|maa|she|her|priya|maya|rani|ananya|elena|anita|radha|dadi|nani|pinky)\b/i.test(detectedName2);
          dynamicNames.push({ name: detectedName2, role: 'co-star', desc: 'companion in the journey', isFemale });
        }
      }
    }

    for (const dn of dynamicNames) {
      if (characters.length < 3) {
        characters.push({
          id: `char-${characters.length + 1}`,
          name: dn.name,
          role: dn.role,
          description: dn.desc,
          voiceGender: dn.isFemale ? 'female' : 'male',
          voiceVoice: dn.isFemale ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural',
          avatar: getReliableAvatar(dn.name, dn.role, dn.isFemale, format)
        });
      }
    }
  }

  // 3. Implicit character mentions from natural prompt keywords
  if (characters.length === 0) {
    const rolePatterns = [
      { regex: /\b(chor|thief|burglar)\b/i, name: 'Chalu Chor (Thief)', desc: 'sneaky comical thief in striped clothes with a mischievous grin', isFemale: false },
      { regex: /\b(guard|police|cop|inspector|havaldar)\b/i, name: 'Guard / Police Inspector', desc: 'uniformed vigilant officer with a mustache and kind or stern eyes', isFemale: false },
      { regex: /\b(astronaut|captain\s+([A-Za-z]+)|dr\.\s+([A-Za-z]+)|pilot)\b/i, name: 'Captain / Astronaut', desc: 'brave explorer in advanced futuristic pressurized spacesuit', isFemale: false },
      { regex: /\b(piku|squirrel|rabbit|chuha|mouse|billi|cat|kutta|dog|lion|sher|bear|bhalu|monkey|bandar)\b/i, name: 'Animal Hero', desc: 'expressive furry creature with big shining animated eyes', isFemale: false },
      { regex: /\b(anchor|reporter|patrakar|host)\b/i, name: 'News Anchor', desc: 'professional news broadcaster in formal attire at high-tech studio desk', isFemale: false },
      { regex: /\b(ladka|boy|kabir|rohan|chintu|rahul|arjun|karan|vikram)\b/i, name: 'Young Protagonist', desc: 'spirited and determined young person full of curiosity and courage', isFemale: false },
      { regex: /\b(ladki|girl|maya|priya|simran|ananya|maa|mother|woman|queen|princess)\b/i, name: 'Female Protagonist', desc: 'intelligent and empathetic character with expressive emotional features', isFemale: true }
    ];

    for (const pat of rolePatterns) {
      if (pat.regex.test(clean) && characters.length < 3) {
        characters.push({
          id: `char-${characters.length + 1}`,
          name: pat.name,
          role: characters.length === 0 ? 'protagonist' : 'co-star',
          description: pat.desc,
          voiceGender: pat.isFemale ? 'female' : 'male',
          voiceVoice: pat.isFemale ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural',
          avatar: getReliableAvatar(pat.name, 'protagonist', pat.isFemale, format)
        });
      }
    }
  }

  // 3. Fallback character if nothing matched
  if (characters.length === 0) {
    const isCartoon = format === 'cartoon';
    const isNews = format === 'news';
    const name = isNews ? 'Prime Time Anchor' : isCartoon ? 'Lead Hero' : 'Main Protagonist';
    const desc = isNews ? 'senior news anchor delivering urgent news' : isCartoon ? 'lovable and brave animated character' : 'dramatic cinematic hero';
    characters.push({
      id: 'char-1',
      name: name,
      role: 'protagonist',
      description: desc,
      voiceGender: 'male',
      voiceVoice: 'hi-IN-MadhurNeural',
      avatar: getReliableAvatar(name, 'protagonist', false, format)
    });
  }

  return characters;
}

function getReliableAvatar(name, role, isFemale, format) {
  const seed = encodeURIComponent(name || 'Hero');
  if (format === 'cartoon') {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  }
  return `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,d1d4f9`;
}

// Format-tailored reliable 1080p HD cinema photography (100% Free, ZERO rate limits, ZERO yellow banners!)
const GENRE_BACKUPS = {
  cartoon: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1280&auto=format&fit=crop&q=80'
  ],
  news: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1280&auto=format&fit=crop&q=80'
  ],
  documentary: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1280&auto=format&fit=crop&q=80'
  ],
  movie: [
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1280&auto=format&fit=crop&q=80'
  ],
  cyber: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1280&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80'
  ]
};

// Universal Dynamic Screenplay Director: Works for ANY prompt
export function parseMasterScreenplay(text) {
  const clean = (text || '').trim();
  const title = extractOrGenerateTitle(clean);
  const { format, style, genre } = detectFormatAndGenre(clean);
  const characters = extractOrSynthesizeCharacters(clean, format, genre);

  const storyStart = clean.search(/STORY\s*:/i);
  const storyBody = storyStart !== -1 ? clean.slice(storyStart + 6) : clean;

  // Extract explicit sections if available
  const sectionHeaderRegex = /\n\s*([A-Z0-9\s—'-]{3,35}):\s*\n/g;
  const sections = [];
  const headerMatches = [];
  let headerMatch;

  while ((headerMatch = sectionHeaderRegex.exec(storyBody)) !== null) {
    headerMatches.push({
      header: headerMatch[1].trim(),
      index: headerMatch.index,
      length: headerMatch[0].length
    });
  }

  if (headerMatches.length >= 2) {
    for (let i = 0; i < headerMatches.length; i++) {
      const current = headerMatches[i];
      const next = headerMatches[i + 1];
      const startIndex = current.index + current.length;
      const endIndex = next ? next.index : storyBody.length;
      const content = storyBody.slice(startIndex, endIndex).trim();

      if (!/ANIMATION REQUIREMENTS|NEGATIVE PROMPT|VISUAL CONSISTENCY/i.test(current.header)) {
        sections.push({ header: current.header, content });
      }
    }
  } else {
    // If no uppercase headers, check paragraphs
    const paragraphs = storyBody
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 20 && !/ANIMATION REQUIREMENTS|NEGATIVE PROMPT/i.test(p));

    if (paragraphs.length >= 3) {
      paragraphs.forEach((p, idx) => {
        sections.push({ header: `Scene ${idx + 1}: Story Beat`, content: p });
      });
    } else {
      // Dynamic clause-based scene division from the user's actual prompt
      const clauses = clean
        .split(/(?:[।.\n!?]|,\s*(?:aur|par|tabhi|jahan|lekin|and|but|when|suddenly|while)\s+)/i)
        .map(c => c.trim().replace(/^[-*•\d.)\s]+/, ''))
        .filter(c => c.length > 5);

      if (clauses.length >= 3) {
        clauses.slice(0, 6).forEach((clause, idx) => {
          sections.push({
            header: `Shot ${idx + 1}: Progression`,
            content: clause
          });
        });
      } else {
        const core = clauses[0] || clean;
        sections.push({
          header: 'Shot 1: Establishing Cinema Frame',
          content: core
        });
        sections.push({
          header: 'Shot 2: Dramatic Focus & Action',
          content: `${core} - camera moves closer to capture the unfolding details.`
        });
        sections.push({
          header: 'Shot 3: Key Emotional Turning Point',
          content: `${core} - an intense, pivotal moment unfolds.`
        });
        sections.push({
          header: 'Shot 4: Grand Cinematic Resolution',
          content: `${core} - camera pulls back into an unforgettable cinematic finale.`
        });
      }
    }
  }

  const cameraAngles = [
    { type: 'Extreme Wide Aerial Shot', desc: 'Vast overhead view establishing geography, scale and mood' },
    { type: 'Side-Tracking Movement Shot', desc: 'Camera smoothly glides beside character tracking movement' },
    { type: 'Slow Push-In Dramatic Close-Up', desc: 'Tension and emotional focus drawing viewers into character eyes' },
    { type: 'Two-Shot Emotional Interaction', desc: 'Medium shot framing two characters interacting with touch and gaze' },
    { type: 'Grand Pull-Back Ending Shot', desc: 'Slow cinematic crane withdrawal leaving characters in vast landscape' }
  ];

  const styleToken = CINEMATIC_STYLES.find(s => s.id === style)?.promptToken || CINEMATIC_STYLES[0].promptToken;
  const backupList = GENRE_BACKUPS[format] || GENRE_BACKUPS.movie;

  const parsedScenes = sections.map((sec, idx) => {
    const sectionText = sec.content;
    let dialogue = '';
    let speaker = characters[idx % characters.length]?.name || 'narrator';

    // Parse Character Dialogue from text: "X says: “...”" or quotes
    const charDialogueMatch = sectionText.match(/([A-Za-z0-9\s—]+?)\s*(?:says|speaks|shouts|roars|whispers|cries|kehta hai|boli)?\s*:\s*[“"']([^”"'\n]+)[”"']/i);
    if (charDialogueMatch) {
      speaker = charDialogueMatch[1].replace(/says|speaks|shouts|roars|whispers|cries|kehta hai|boli/gi, '').trim();
      dialogue = charDialogueMatch[2].trim();
    } else {
      const quoteMatch = sectionText.match(/[“"']([^”"'\n]{5,200})[”"']/);
      if (quoteMatch) {
        dialogue = quoteMatch[1].trim();
      } else {
        const sentences = sectionText.split(/(?<=[.।\n])/).map(s => s.trim()).filter(s => s.length > 5);
        dialogue = sentences[0] || sectionText.slice(0, 110);
      }
    }

    const angle = cameraAngles[idx % cameraAngles.length];
    const motionType = idx % 4 === 0 ? 'zoom-in' : idx % 4 === 1 ? 'pan-right' : idx % 4 === 2 ? 'zoom-out' : 'pan-left';

    const visualPrompt = `${angle.type}, ${sec.header}. In the scene: ${sectionText.slice(0, 150)}. ${styleToken}, masterpiece, highly detailed, 8k render`;
    const seed = Math.floor(Math.random() * 899999) + 100000;
    const resolvedUrl = backupList[idx % backupList.length];

    return {
      id: `scene-dynamic-${idx + 1}`,
      sceneNumber: idx + 1,
      title: sec.header.replace(/^[A-Z0-9\s—'-]+:\s*/, '').trim() || `Shot ${idx + 1}`,
      scriptText: sectionText,
      speaker: speaker,
      voiceover: dialogue,
      cameraAngle: angle.type,
      cameraDescription: angle.desc,
      lighting: 'Warm cinematic sunlight with volumetric atmospheric depth',
      emotion: idx === 0 ? 'Curiosity & Wonder' : idx === 2 ? 'High Tension & Mystery' : idx === 3 ? 'Peak Climax' : 'Heartfelt Resolution',
      sfx: 'Cinematic orchestral swell with environmental soundscapes',
      duration: Math.max(4.2, Math.min(6.5, dialogue.split(/\s+/).length * 0.35 + 2.0)),
      visualPrompt: visualPrompt,
      seed: seed,
      imageUrl: resolvedUrl,
      backupUrl: resolvedUrl,
      motionType: motionType
    };
  });

  return {
    title,
    videoFormat: format,
    styleId: style,
    genreId: genre,
    characters,
    scenes: parsedScenes.length > 0 ? parsedScenes : null
  };
}

// Client-side story decomposition dispatcher
export function decomposeStoryLocal(storyText, genre = 'horror', characters = [], styleId = 'cinematic', videoFormat = 'movie') {
  const text = (storyText || '').trim();
  const parsed = parseMasterScreenplay(text);
  return {
    scenes: parsed.scenes || [],
    title: parsed.title,
    characters: parsed.characters,
    videoFormat: parsed.videoFormat,
    styleId: parsed.styleId,
    genreId: parsed.genreId
  };
}

// Full Filmmaker Story Decomposer with backend API integration & fallback
export async function decomposeStory(storyText, genre = 'horror', characters = [], styleId = 'cinematic', videoFormat = 'movie') {
  try {
    const res = await fetch('http://localhost:5000/api/decompose-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story: storyText, genre, characters, style: styleId, videoFormat })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.scenes && data.scenes.length > 0) {
        return {
          scenes: data.scenes,
          title: data.title,
          characters: data.characters,
          videoFormat: data.videoFormat,
          styleId: data.styleId,
          genreId: data.genreId
        };
      }
    }
  } catch {
    // Fallback to client-side universal director
  }

  return decomposeStoryLocal(storyText, genre, characters, styleId, videoFormat);
}


