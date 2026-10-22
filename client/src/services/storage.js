// Flow AI Studio - Universal Persistent Storage
// Pure dynamic architecture - ZERO hardcoded stories or pre-baked scripts.

const STORAGE_KEY = 'cineai_flow_projects_v2';

export const SAMPLE_PROJECTS = [];

export function getProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Start with a clean empty list or single fresh project ready for ANY user prompt
      const initial = [
        {
          id: `proj-${Date.now()}`,
          title: 'My AI Movie',
          genre: 'Cinema Movie',
          genreId: 'movie',
          videoFormat: 'movie',
          styleId: 'cinematic',
          aspectRatio: '16:9',
          voiceLang: 'hi-IN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          story: '',
          characters: [],
          scenes: []
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
  } catch (err) {
    console.error('Storage read error:', err);
    return [];
  }
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

export function saveProject(project) {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    projects[existingIndex] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }
  saveProjects(projects);
  return updatedProject;
}

export function deleteProject(id) {
  const projects = getProjects().filter(p => p.id !== id);
  saveProjects(projects);
  return projects;
}
