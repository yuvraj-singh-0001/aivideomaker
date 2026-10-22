import React, { useState } from 'react';
import { Film, Clapperboard, FolderKanban, PenTool, Sparkles, Video, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import MobileApiModal from './MobileApiModal';

export default function Navbar({ currentScreen, setScreen, activeProject, onNewProjectClick }) {
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  const toggleAudioPreview = () => {
    if (isPlayingAudioPreview) {
      audioEngine.stopScore();
      setIsPlayingAudioPreview(false);
    } else {
      audioEngine.playScore(activeProject?.genreId || 'horror');
      setIsPlayingAudioPreview(true);
    }
  };

  const steps = [
    { id: 'projects', label: '1. My Projects', icon: FolderKanban },
    { id: 'creator', label: '2. Story Creator', icon: PenTool },
    { id: 'filmmaking', label: '3. AI Filmmaking', icon: Sparkles },
    { id: 'final', label: '4. Final Video', icon: Video },
  ];

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-inner">
          {/* Brand */}
          <div className="navbar-brand" onClick={() => setScreen('projects')}>
            <div className="brand-icon-box">
              <Clapperboard className="brand-icon" size={24} />
            </div>
            <div className="brand-titles">
              <span className="brand-name cinema-font">CineAI Studio</span>
              <span className="brand-tagline">1-Click AI Hindi/Hinglish Filmmaker</span>
            </div>
          </div>

          {/* Screen Steps Navigation */}
          <nav className="screen-stepper">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentScreen === step.id;
              const isDisabled = (step.id === 'filmmaking' || step.id === 'final') && (!activeProject || !activeProject.scenes || activeProject.scenes.length === 0);

              return (
                <button
                  key={step.id}
                  className={`step-nav-btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && setScreen(step.id)}
                  disabled={isDisabled}
                  title={isDisabled ? 'Generate or open a story first' : step.label}
                >
                  <Icon size={16} />
                  <span className="step-label">{step.label}</span>
                  {isActive && <div className="step-active-indicator" />}
                </button>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="navbar-actions">
            {/* Mobile API Hub Button */}
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowApiModal(true)}
              title="View Mobile App Developer API Documentation & Code Snippets"
            >
              <Smartphone size={16} className="text-gold" />
              <span>Mobile API 📱</span>
            </button>

            <button 
              className={`btn-sound-toggle ${isPlayingAudioPreview ? 'playing' : ''}`}
              onClick={toggleAudioPreview}
              title={isPlayingAudioPreview ? 'Mute Procedural Cinema Score' : 'Preview Cinematic Sound Score'}
            >
              {isPlayingAudioPreview ? <Volume2 size={18} className="pulse-icon" /> : <VolumeX size={18} />}
              <span className="sound-text">{isPlayingAudioPreview ? 'Score Playing' : 'Cinema BGM'}</span>
            </button>

            <button className="btn btn-primary btn-sm" onClick={onNewProjectClick}>
              <Sparkles size={16} />
              <span>+ New Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile API Docs Modal */}
      <MobileApiModal 
        isOpen={showApiModal} 
        onClose={() => setShowApiModal(false)} 
      />
    </>
  );
}
