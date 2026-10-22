import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScreenProjects from './components/ScreenProjects';
import ScreenStoryCreator from './components/ScreenStoryCreator';
import ScreenAIFilmmaking from './components/ScreenAIFilmmaking';
import ScreenFinalVideo from './components/ScreenFinalVideo';
import { getProjects, saveProject, deleteProject, saveProjects } from './services/storage';
import { decomposeStory } from './services/aiDirector';
import './App.css';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('projects'); // 'projects', 'creator', 'filmmaking', 'final'
  const [isProcessing, setIsProcessing] = useState(false);

  // Load projects from storage on mount
  useEffect(() => {
    const loaded = getProjects();
    setProjects(loaded);
    if (loaded.length > 0) {
      setActiveProject(loaded[0]);
    }
  }, []);

  // Screen 1: Select project
  const handleSelectProject = (project, targetScreen = 'filmmaking') => {
    setActiveProject(project);
    setCurrentScreen(targetScreen);
  };

  // Screen 1: Create new project
  const handleCreateProject = ({ title, genre, genreId, story = '' }) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: title || 'New Cinematic Story',
      genre: genre || 'Horror Story',
      genreId: genreId || 'horror',
      styleId: 'cinematic',
      aspectRatio: '16:9',
      voiceLang: 'hi-IN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      story: story,
      characters: [],
      scenes: []
    };

    const saved = saveProject(newProj);
    setProjects(getProjects());
    setActiveProject(saved);
    setCurrentScreen('creator');
  };

  // Screen 1: Duplicate project
  const handleDuplicateProject = (project) => {
    const duplicated = {
      ...project,
      id: `proj-${Date.now()}`,
      title: `${project.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveProject(duplicated);
    setProjects(getProjects());
  };

  // Screen 1: Delete project
  const handleDeleteProject = (id) => {
    const remaining = deleteProject(id);
    setProjects(remaining);
    if (activeProject?.id === id) {
      setActiveProject(remaining[0] || null);
    }
  };

  // Update active project
  const handleUpdateProject = (updated) => {
    const saved = saveProject(updated);
    setActiveProject(saved);
    setProjects(getProjects());
  };

  // Screen 2 -> Screen 3: Start AI Filmmaking
  const handleStartFilmmaking = async (projectData) => {
    setIsProcessing(true);
    try {
      // Dynamic AI screenplay deconstruction for ANY user prompt
      const result = await decomposeStory(
        projectData.story,
        projectData.genreId || 'horror',
        projectData.characters || [],
        projectData.styleId || 'cinematic',
        projectData.videoFormat || 'movie'
      );

      const generatedScenes = result.scenes || (Array.isArray(result) ? result : []);
      const dynamicTitle = result.title || projectData.title;
      const dynamicCharacters = (result.characters && result.characters.length > 0)
        ? result.characters 
        : projectData.characters;
      const dynamicFormat = result.videoFormat || projectData.videoFormat;
      const dynamicStyle = result.styleId || projectData.styleId;
      const dynamicGenre = result.genreId || projectData.genreId;

      const updatedProject = {
        ...projectData,
        title: (dynamicTitle && dynamicTitle !== 'New Story Project') ? dynamicTitle : projectData.title,
        characters: dynamicCharacters,
        videoFormat: dynamicFormat,
        styleId: dynamicStyle,
        genreId: dynamicGenre,
        scenes: generatedScenes
      };

      handleUpdateProject(updatedProject);

      // Persist to backend database as well
      try {
        fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProject)
        }).catch(() => {});
      } catch {
        // Backend optional sync
      }

      setCurrentScreen('filmmaking');
    } catch (err) {
      console.error('Filmmaking decomposition error:', err);
      // Fallback: still navigate
      setCurrentScreen('filmmaking');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-root">
      {/* Top Universal Navbar */}
      <Navbar
        currentScreen={currentScreen}
        setScreen={setCurrentScreen}
        activeProject={activeProject}
        onNewProjectClick={() => {
          handleCreateProject({
            title: 'New Story Project',
            genre: 'Horror Story',
            genreId: 'horror',
            story: ''
          });
        }}
      />

      {/* Main Screen Router */}
      <main className="main-content">
        {currentScreen === 'projects' && (
          <ScreenProjects
            projects={projects}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicateProject}
          />
        )}

        {currentScreen === 'creator' && activeProject && (
          <ScreenStoryCreator
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onStartFilmmaking={handleStartFilmmaking}
            isProcessing={isProcessing}
          />
        )}

        {currentScreen === 'filmmaking' && activeProject && (
          <ScreenAIFilmmaking
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onProceedToFinal={() => setCurrentScreen('final')}
            onBackToCreator={() => setCurrentScreen('creator')}
          />
        )}

        {currentScreen === 'final' && activeProject && (
          <ScreenFinalVideo
            project={activeProject}
            onBackToFilmmaking={() => setCurrentScreen('filmmaking')}
            onBackToStory={() => setCurrentScreen('creator')}
          />
        )}
      </main>
    </div>
  );
}
