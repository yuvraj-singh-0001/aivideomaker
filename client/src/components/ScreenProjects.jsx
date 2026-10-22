import React, { useState } from 'react';
import { Film, Plus, Search, Trash2, Copy, Play, Calendar, Clock, Layers, Users, Sparkles } from 'lucide-react';

export default function ScreenProjects({
  projects,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Horror');
  const [newGenreId, setNewGenreId] = useState('horror');

  const genres = [
    { id: 'all', label: 'All Projects' },
    { id: 'horror', label: 'Horror Story' },
    { id: 'romance', label: 'Love Story' },
    { id: 'ancient', label: 'Historical Story' },
    { id: 'action', label: 'Thriller / Action' },
    { id: 'cyber', label: 'Sci-Fi' }
  ];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.story.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || p.genreId === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateProject({
      title: newTitle.trim(),
      genre: newGenre,
      genreId: newGenreId
    });

    setNewTitle('');
    setShowModal(false);
  };


  return (
    <div className="screen-container">
      {/* Hero Banner */}
      <section className="projects-hero glass-panel">
        <div className="hero-content">
          <div className="badge badge-gold">
            <Sparkles size={14} /> AI Cinema Workspace
          </div>
          <h1 className="hero-title cinema-font">Screen 1 — My Projects</h1>
          <p className="hero-subtitle">
            Manage your cinematic stories in Hindi, Hinglish, or English. Create horror mysteries, love sagas, or historical epics with 1-click automatic AI filmmaking.
          </p>
        </div>

        <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          <span>Create New Project</span>
        </button>
      </section>

      {/* Filter and Search Bar */}
      <div className="projects-filter-bar glass-panel">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects or story text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="genre-pill-group">
          {genres.map(g => (
            <button
              key={g.id}
              className={`genre-pill ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => {
          const thumbnail = project.scenes && project.scenes[0]?.imageUrl
            ? project.scenes[0].imageUrl
            : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';

          const scenesCount = project.scenes?.length || 0;
          const totalDuration = project.scenes?.reduce((acc, s) => acc + (s.duration || 6), 0) || 0;

          return (
            <div key={project.id} className="project-card glass-panel">
              {/* Card Thumbnail */}
              <div className="card-thumb-wrapper" onClick={() => onSelectProject(project, 'filmmaking')}>
                <img src={thumbnail} alt={project.title} className="card-thumb-img" />
                <div className="thumb-overlay">
                  <div className="play-badge">
                    <Play size={20} fill="#ffffff" />
                  </div>
                </div>
                <div className="thumb-badges">
                  <span className="badge badge-gold">{project.genre || 'Horror'}</span>
                  <span className="badge badge-cyan">{project.aspectRatio || '16:9'}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="card-content">
                <h3 className="card-title" onClick={() => onSelectProject(project, 'creator')}>
                  {project.title}
                </h3>
                <p className="card-story-snippet">
                  {project.story || 'No story text entered yet. Open creator to write...'}
                </p>

                {/* Metadata */}
                <div className="card-meta">
                  <div className="meta-item">
                    <Layers size={14} />
                    <span>{scenesCount} Shots</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>~{totalDuration}s</span>
                  </div>
                  {project.characters && project.characters.length > 0 && (
                    <div className="meta-item characters-meta">
                      <Users size={14} />
                      <span>{project.characters.length} Roles</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-sm flex-1"
                    onClick={() => onSelectProject(project, 'filmmaking')}
                  >
                    <Film size={15} />
                    <span>Open Director</span>
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectProject(project, 'creator')}
                    title="Edit Story & Characters"
                  >
                    Edit Story
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => onDuplicateProject(project)}
                    title="Duplicate Project"
                  >
                    <Copy size={16} />
                  </button>

                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => onDeleteProject(project.id)}
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty-state glass-panel">
          <Film size={48} className="empty-icon" />
          <h3 className="cinema-font">No Projects Found</h3>
          <p>No story projects matched your search. Create a new one or click below to launch one!</p>
          <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
            + Create New Story Project
          </button>
        </div>
      )}

      {/* Create New Project Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-dialog glass-panel-glow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="cinema-font">Create New Cinematic Project</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  placeholder="e.g., Horror Story — Ghane Jungle Ka Rahasya"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Genre / Mood</label>
                <div className="genre-select-grid">
                  {[
                    { id: 'horror', name: 'Horror Story', icon: '👻' },
                    { id: 'romance', name: 'Love Story', icon: '❤️' },
                    { id: 'ancient', name: 'Historical Story', icon: '🏛️' },
                    { id: 'action', name: 'Action Thriller', icon: '⚡' },
                    { id: 'cyber', name: 'Sci-Fi Cyberpunk', icon: '🛸' },
                  ].map(g => (
                    <button
                      type="button"
                      key={g.id}
                      className={`genre-card-btn ${newGenreId === g.id ? 'active' : ''}`}
                      onClick={() => {
                        setNewGenreId(g.id);
                        setNewGenre(g.name);
                      }}
                    >
                      <span className="genre-card-icon">{g.icon}</span>
                      <span className="genre-card-name">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Format Style</label>
                <p className="text-secondary" style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
                  Write ANY prompt on the next screen (Movies, 3D Animation, Sci-Fi, Documentaries, News, or Comedy).
                </p>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}>
                  <Sparkles size={16} />
                  <span>Create & Open Story Creator</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
