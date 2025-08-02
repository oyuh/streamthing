'use client';

import { useEffect, useState } from 'react';
import { FaSave, FaPlus, FaEdit, FaTrash, FaEye, FaCheck } from 'react-icons/fa';

interface Theme {
  id: number;
  name: string;
  css: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ThemeEditor() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingCSS, setEditingCSS] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');

  // Default CSS for new themes
  const defaultCSS = `#nowPlaying {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  transition: opacity 0.5s ease;
}

#albumArt {
  height: 70px;
  width: 70px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.6);
}

#info {
  display: flex;
  flex-direction: column;
}

#track {
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 2px 5px rgba(0,0,0,0.7);
}

#artist {
  font-size: 14px;
  opacity: 0.85;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

#progressTime {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 6px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}`;

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/spotify/themes');
      const data = await response.json();
      setThemes(data);
    } catch (error) {
      console.error('Failed to fetch themes:', error);
    }
  };

  const handleSave = async () => {
    if (!currentTheme || !editingName.trim() || !editingCSS.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/spotify/themes/${currentTheme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingName,
          css: editingCSS,
          isActive: currentTheme.isActive,
        }),
      });

      if (response.ok) {
        await fetchThemes();
        setIsEditing(false);
        alert('Theme saved successfully!');
      } else {
        alert('Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Error saving theme');
    }
    setIsLoading(false);
  };

  const handleCreateTheme = async () => {
    if (!newThemeName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/spotify/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newThemeName,
          css: defaultCSS,
          isActive: false,
        }),
      });

      if (response.ok) {
        await fetchThemes();
        setShowNewThemeForm(false);
        setNewThemeName('');
        alert('Theme created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create theme');
      }
    } catch (error) {
      console.error('Error creating theme:', error);
      alert('Error creating theme');
    }
    setIsLoading(false);
  };

  const handleSetActive = async (theme: Theme) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/spotify/themes/${theme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...theme,
          isActive: true,
        }),
      });

      if (response.ok) {
        await fetchThemes();
        alert('Theme activated successfully!');
      } else {
        alert('Failed to activate theme');
      }
    } catch (error) {
      console.error('Error activating theme:', error);
      alert('Error activating theme');
    }
    setIsLoading(false);
  };

  const handleDelete = async (theme: Theme) => {
    if (!confirm(`Are you sure you want to delete "${theme.name}"?`)) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/spotify/themes/${theme.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchThemes();
        if (currentTheme?.id === theme.id) {
          setCurrentTheme(null);
          setIsEditing(false);
        }
        alert('Theme deleted successfully!');
      } else {
        alert('Failed to delete theme');
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      alert('Error deleting theme');
    }
    setIsLoading(false);
  };

  const startEditing = (theme: Theme) => {
    setCurrentTheme(theme);
    setEditingName(theme.name);
    setEditingCSS(theme.css);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Spotify Theme Editor</h1>
          <button
            onClick={() => setShowNewThemeForm(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-lg transition"
          >
            <FaPlus size={16} />
            New Theme
          </button>
        </div>

        {showNewThemeForm && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Create New Theme</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Theme Name</label>
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2"
                  placeholder="Enter theme name..."
                />
              </div>
              <button
                onClick={handleCreateTheme}
                disabled={isLoading || !newThemeName.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewThemeForm(false);
                  setNewThemeName('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Theme List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Themes</h2>
            <div className="space-y-2">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`bg-zinc-800 rounded-lg p-4 cursor-pointer transition ${
                    currentTheme?.id === theme.id ? 'ring-2 ring-blue-500' : 'hover:bg-zinc-700'
                  }`}
                  onClick={() => startEditing(theme)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{theme.name}</h3>
                      <p className="text-sm text-zinc-400">
                        {new Date(theme.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {theme.isActive && (
                        <FaCheck className="text-green-500" size={16} />
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/spotify', '_blank');
                          }}
                          className="p-1 text-zinc-400 hover:text-white transition"
                          title="Preview"
                        >
                          <FaEye size={14} />
                        </button>
                        {!theme.isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetActive(theme);
                            }}
                            className="p-1 text-zinc-400 hover:text-green-500 transition"
                            title="Set Active"
                          >
                            <FaCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(theme);
                          }}
                          className="p-1 text-zinc-400 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {isEditing && currentTheme ? (
              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    Editing: {currentTheme.name}
                    {currentTheme.isActive && (
                      <span className="ml-2 text-sm bg-green-500 text-black px-2 py-1 rounded">
                        ACTIVE
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open('/spotify', '_blank')}
                      className="flex items-center gap-2 bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      <FaEye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      <FaSave size={16} />
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme Name</label>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">CSS Styles</label>
                    <textarea
                      value={editingCSS}
                      onChange={(e) => setEditingCSS(e.target.value)}
                      className="w-full h-96 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 font-mono text-sm"
                      placeholder="Enter your CSS here..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <FaEdit className="mx-auto text-4xl text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Select a Theme to Edit</h3>
                <p className="text-zinc-400">
                  Choose a theme from the list on the left to start editing, or create a new one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
