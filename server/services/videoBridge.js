/**
 * ============================================================================
 * OPEN-SOURCE VIDEO GENERATION ENGINE BRIDGE (Wan 2.1 & LTX-Video)
 * ============================================================================
 * Architecture bridge for running open-source Text-to-Video models:
 *  - Wan 2.1 (Alibaba Cloud 1.3B / 14B) - State-of-the-Art 3D Animation & Realism
 *  - LTX-Video (Lightricks 2B) - Real-time 480p/720p rapid video generation
 * 
 * Supports:
 *  1. Self-Hosted Local GPU (NVIDIA RTX 3060/4060/4090 via ComfyUI / PyTorch)
 *  2. Cloud GPU Instance (RunPod / Vast.ai @ $0.20/hour)
 *  3. Hybrid Fast Cinema Mode (Zero-cost 60fps Ken Burns + 35mm grain + particles)
 * 
 * MOBILE APP DEVELOPER USAGE:
 * POST /api/video-engine/generate-clip
 * Body: { "prompt": "...", "cameraAngle": "...", "duration": 5, "mode": "hybrid"|"wan2.1" }
 * ============================================================================
 */

const VIDEO_ENGINES = {
  'hybrid': {
    name: 'CineAI Hybrid Motion Engine',
    desc: 'Instant 60fps dynamic camera pan/zoom + 35mm grain + floating particles + synced audio',
    cost: '100% Free (Zero API key needed)',
    renderTime: 'Instant (< 200ms)',
    resolution: '1080p Full HD (1920x1080)'
  },
  'wan2.1': {
    name: 'Alibaba Wan 2.1 Diffusion Transformer',
    desc: 'True open-source spatio-temporal video diffusion with 3D character physics',
    weights: 'https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B',
    vramRequirement: '8GB VRAM (1.3B) or 24GB VRAM (14B FP8)',
    cost: 'Free (Self-hosted on Local GPU or $0.20/hr RunPod)',
    renderTime: '15 - 35 seconds per 5s clip',
    resolution: '720p / 1080p'
  },
  'ltx-video': {
    name: 'Lightricks LTX-Video',
    desc: 'Ultra-fast open-source video generation optimized for real-time mobile pipelines',
    weights: 'https://huggingface.co/Lightricks/LTX-Video',
    vramRequirement: '8GB - 12GB VRAM',
    cost: 'Free (Self-hosted)',
    renderTime: '6 - 12 seconds per 5s clip',
    resolution: '720p HD'
  }
};

/**
 * Returns technical specifications and connection instructions for video engines
 */
function getVideoEngineSpecs() {
  return {
    status: 'ready',
    activeEngine: 'hybrid',
    engines: VIDEO_ENGINES,
    selfHostingGuide: {
      step1: 'Clone Wan 2.1 or LTX-Video from HuggingFace',
      step2: 'Install PyTorch with CUDA: pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124',
      step3: 'Run the ComfyUI or FastAPI inference worker on port 8188 or 8000',
      step4: 'Set VIDEO_ENGINE_URL=http://localhost:8188 in your server/.env'
    }
  };
}

module.exports = {
  getVideoEngineSpecs,
  VIDEO_ENGINES
};
