'use client';

import PageLayout from '@/components/dashboard/PageLayout';
import { useEffect, useState } from 'react';
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaEye,
  FaCheck,
  FaPalette,
  FaSync,
  FaLink,
} from 'react-icons/fa';

interface Theme {
  id: number;
  name: string;
  css: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultCSS = `/* Dark Minimal Theme */
#nowPlaying {
  --artist-accent: #9ca3af;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e5e7eb;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  box-shadow: 0 4px 18px rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: opacity 0.4s ease;
}

#albumArt {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 9px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
}

#info {
  display: flex;
  flex-direction: column;
}

#track {
  font-size: 15px;
  line-height: 1.1;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.65);
  color: #f9fafb;
}

#artist {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1;
  color: var(--artist-accent);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

#progressTime {
  margin-top: 3px;
  font-size: 11px;
  letter-spacing: 0.2px;
  color: #94a3b8;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}`;

export default function ThemeEditor() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingCSS, setEditingCSS] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/spotify/themes');
      if (!response.ok) {
        throw new Error('Failed to fetch themes');
      }
      const data = await response.json();
      setThemes(data);
    } catch (err) {
      console.error('Failed to fetch themes', err);
      setError('Unable to load themes. Please refresh.');
    }
  };

  const startEditing = (theme: Theme) => {
    setCurrentTheme(theme);
    setEditingName(theme.name);
    setEditingCSS(theme.css);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentTheme || !editingName.trim() || !editingCSS.trim()) return;
    setIsLoading(true);
    setError('');
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

      if (!response.ok) {
        throw new Error('Failed to save theme');
      }

      await fetchThemes();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save theme', err);
      setError('Could not save the theme.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTheme = async () => {
    if (!newThemeName.trim()) return;
    setIsLoading(true);
    setError('');
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

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to create theme');
      }

      await fetchThemes();
      setShowNewThemeForm(false);
      setNewThemeName('');
    } catch (err) {
      console.error('Failed to create theme', err);
      setError('Could not create the theme.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (theme: Theme) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/spotify/themes/${theme.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...theme,
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to activate theme');
      }

      await fetchThemes();
    } catch (err) {
      console.error('Failed to activate theme', err);
      setError('Could not activate the theme.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (theme: Theme) => {
    if (!confirm(`Delete "${theme.name}"? This cannot be undone.`)) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/spotify/themes/${theme.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete theme');
      }

      await fetchThemes();
      if (currentTheme?.id === theme.id) {
        setCurrentTheme(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to delete theme', err);
      setError('Could not delete the theme.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (theme: Theme) => {
    const url = `${window.location.origin}/spotify?theme=${theme.id}`;
    navigator.clipboard.writeText(url).then(() => {
      // Could add a toast here, but for now just log or maybe set a temporary success state
      // Using the error state for a quick success message hack or just rely on user knowing it worked
      // Let's just alert for now or maybe use a temporary text change on the button if I could
      // Actually, let's just use the error banner for success messages too but style it differently?
      // Or just a simple alert since we don't have a toast system handy in this file
      // Let's try to be cleaner and maybe just console log, but user needs feedback.
      // I'll add a temporary "Copied!" state to the button if I can, but that's complex for a list.
      // I'll just use window.alert for simplicity as requested "add a button... for copying that link"
      // Wait, user said "stop using browser dialogs please" earlier.
      // I should probably not use alert.
      // I'll add a simple "Link copied to clipboard" message in the error/status area.
      setError('Link copied to clipboard!');
      setTimeout(() => setError(''), 3000);
    });
  };

  return (
    <PageLayout
      title="Themes"
      icon={FaPalette}
      description="CSS editor"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchThemes()}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 transition hover:border-zinc-700 hover:text-white disabled:opacity-50"
          >
            <FaSync className={`text-xs ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowNewThemeForm(true)}
            className="flex h-9 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 text-sm text-white transition hover:border-zinc-700"
          >
            <FaPlus className="text-xs" />
            New
          </button>
        </div>
      }
      contentWidth="xl"
    >
      {error ? (
        <div className={`mb-4 rounded-lg border p-3 text-sm ${
          error === 'Link copied to clipboard!'
            ? 'border-green-900 bg-green-950/30 text-green-400'
            : 'border-red-900 bg-red-950/30 text-red-400'
        }`}>
          {error}
        </div>
      ) : null}

      {showNewThemeForm ? (
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-2 block text-xs text-zinc-500">Theme name</label>
              <input
                type="text"
                value={newThemeName}
                onChange={(event) => setNewThemeName(event.target.value)}
                placeholder="Neon Nights, Minimal Dark..."
                className="w-full rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-zinc-700 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleCreateTheme()}
              disabled={isLoading || !newThemeName.trim()}
              className="rounded border border-zinc-700 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-zinc-600 disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewThemeForm(false);
                setNewThemeName('');
              }}
              className="rounded border border-zinc-800 bg-black px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
        {/* Theme list sidebar */}
        <aside className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3">
          <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
            <span>Library</span>
            <span>{themes.length} saved</span>
          </div>
          <div className="space-y-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => startEditing(theme)}
                className={`w-full rounded border px-3 py-2 text-left transition ${
                  currentTheme?.id === theme.id
                    ? 'border-zinc-700 bg-white/5 text-white'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{theme.name}</p>
                    <p className="text-xs text-zinc-600">
                      {new Date(theme.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {theme.isActive ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded border border-green-900 bg-green-950/30 text-green-400">
                        <FaCheck className="text-[8px]" />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCopyLink(theme);
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded border border-zinc-800 bg-black text-zinc-500 transition hover:border-zinc-700 hover:text-white"
                      title="Copy Link"
                    >
                      <FaLink className="text-[8px]" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(`/spotify?theme=${theme.id}`, '_blank');
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded border border-zinc-800 bg-black text-zinc-500 transition hover:border-zinc-700 hover:text-white"
                      title="Preview"
                    >
                      <FaEye className="text-[8px]" />
                    </button>
                    {!theme.isActive ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleSetActive(theme);
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded border border-green-900 bg-green-950/30 text-green-400 transition hover:border-green-700"
                        title="Set active"
                      >
                        <FaCheck className="text-[8px]" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleDelete(theme);
                      }}
                      className="flex h-5 w-5 items-center justify-center rounded border border-red-900 bg-red-950/30 text-red-400 transition hover:border-red-700"
                      title="Delete"
                    >
                      <FaTrash className="text-[8px]" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
            {themes.length === 0 ? (
              <div className="rounded border border-dashed border-zinc-800 bg-black p-6 text-center text-xs text-zinc-600">
                No themes yet
              </div>
            ) : null}
          </div>
        </aside>

        {/* Theme editor */}
        <section className="min-h-[500px] rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          {isEditing && currentTheme ? (
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-white">{currentTheme.name}</h2>
                  <p className="text-xs text-zinc-500">
                    {new Date(currentTheme.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(currentTheme)}
                    className="flex h-8 items-center gap-2 rounded border border-zinc-800 bg-black px-3 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    <FaLink className="text-[10px]" />
                    Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(`/spotify?theme=${currentTheme.id}`, '_blank')}
                    className="flex h-8 items-center gap-2 rounded border border-zinc-800 bg-black px-3 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                  >
                    <FaEye className="text-[10px]" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={isLoading}
                    className="flex h-8 items-center gap-2 rounded border border-zinc-700 bg-white/5 px-3 text-xs text-white transition hover:border-zinc-600 disabled:opacity-50"
                  >
                    <FaSave className="text-[10px]" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-zinc-500">Theme name</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  className="w-full rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white focus:border-zinc-700 focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="mb-2 block text-xs text-zinc-500">CSS</label>
                <textarea
                  value={editingCSS}
                  onChange={(event) => setEditingCSS(event.target.value)}
                  className="h-[380px] w-full rounded border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-white focus:border-zinc-700 focus:outline-none"
                  spellCheck={false}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-zinc-500">
              <FaPalette className="mb-3 text-2xl text-zinc-700" />
              <p>Select a theme to begin editing</p>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
