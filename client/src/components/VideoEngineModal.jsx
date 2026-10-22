import React, { useState, useEffect } from 'react';
import { 
  X, Cpu, Sparkles, Check, Zap, Server, ShieldCheck, Key, RefreshCw, ExternalLink 
} from 'lucide-react';

export default function VideoEngineModal({ isOpen, onClose }) {
  const [activeEngine, setActiveEngine] = useState(() => {
    return localStorage.getItem('flowai_video_engine') || 'hybrid';
  });
  const [falKey, setFalKey] = useState(() => {
    return localStorage.getItem('flowai_fal_key') || '';
  });
  const [replicateKey, setReplicateKey] = useState(() => {
    return localStorage.getItem('flowai_replicate_key') || '';
  });
  const [comfyUrl, setComfyUrl] = useState(() => {
    return localStorage.getItem('flowai_comfy_url') || 'http://localhost:8188';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('flowai_video_engine', activeEngine);
    localStorage.setItem('flowai_fal_key', falKey);
    localStorage.setItem('flowai_replicate_key', replicateKey);
    localStorage.setItem('flowai_comfy_url', comfyUrl);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(3, 4, 8, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div 
        className="glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(145deg, #0d1117, #161b22)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.15)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '8px', borderRadius: '10px', color: '#f59e0b' }}>
              <Cpu size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700 }}>
                AI Video Engine Settings (Option 2)
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Toggle between 100% Free Real Moving Video and Generative AI Diffusion
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Engine Selection Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
          {/* 1. Hybrid Free Motion Engine */}
          <div 
            onClick={() => setActiveEngine('hybrid')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: activeEngine === 'hybrid' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
              background: activeEngine === 'hybrid' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎬</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>Hybrid Real Moving Video Engine</strong>
                    <span style={{ background: '#10b981', color: '#041d13', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      RECOMMENDED • 100% FREE
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    Real moving HD video clips (Wikimedia / Curated Cinema) + 60fps dynamic motion + 35mm grain. Zero keys, zero rate limit.
                  </p>
                </div>
              </div>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: activeEngine === 'hybrid' ? '6px solid #f59e0b' : '2px solid #475569',
                background: '#0f172a'
              }} />
            </div>
          </div>

          {/* 2. Alibaba Wan 2.1 Video Diffusion */}
          <div 
            onClick={() => setActiveEngine('wan2.1')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: activeEngine === 'wan2.1' ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.08)',
              background: activeEngine === 'wan2.1' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>⚡</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>Alibaba Wan 2.1 Video Diffusion</strong>
                    <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                      SOTA Text-to-Video Diffusion
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    Generates true AI video diffusion clips via Fal.ai or Replicate or self-hosted GPU ComfyUI.
                  </p>
                </div>
              </div>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: activeEngine === 'wan2.1' ? '6px solid #8b5cf6' : '2px solid #475569',
                background: '#0f172a'
              }} />
            </div>

            {/* Wan 2.1 API Configuration Box */}
            {activeEngine === 'wan2.1' && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#c4b5fd', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={14} /> Fal.ai API Key (Optional)
                  </label>
                  <input 
                    type="password"
                    placeholder="fal_key_..."
                    value={falKey}
                    onChange={(e) => setFalKey(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      marginTop: '4px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Server size={14} /> Local ComfyUI URL (Self-Hosted RTX 3060/4060+)
                  </label>
                  <input 
                    type="text"
                    placeholder="http://localhost:8188"
                    value={comfyUrl}
                    onChange={(e) => setComfyUrl(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      marginTop: '4px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Lightricks LTX-Video */}
          <div 
            onClick={() => setActiveEngine('ltx')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: activeEngine === 'ltx' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
              background: activeEngine === 'ltx' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🚀</span>
                <div>
                  <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>Lightricks LTX-Video (2B)</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                    Ultra-fast open-weights video model designed for mobile and web real-time generation.
                  </p>
                </div>
              </div>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: activeEngine === 'ltx' ? '6px solid #38bdf8' : '2px solid #475569',
                background: '#0f172a'
              }} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem' }}>
            <ShieldCheck size={16} />
            <span>Option 2 Hybrid mode is 100% active and free</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#cbd5e1',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#07080d',
                padding: '8px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {savedSuccess ? <Check size={16} /> : <Zap size={16} />}
              <span>{savedSuccess ? 'Saved!' : 'Apply Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
