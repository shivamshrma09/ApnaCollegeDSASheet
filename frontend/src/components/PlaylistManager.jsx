import React, { useState } from 'react';

const PlaylistManager = ({ 
  playlists, 
  onCreatePlaylist, 
  onUpdatePlaylist, 
  onDeletePlaylist, 
  onViewPlaylist,
  problems = []
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPlaylist) {
      await onUpdatePlaylist(editingPlaylist.id, formData);
      setEditingPlaylist(null);
    } else {
      await onCreatePlaylist(formData);
      setShowCreateForm(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setFormData({ name: playlist.name, description: playlist.description });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPlaylist(null);
    setFormData({ name: '', description: '' });
  };

  const getProblemsInPlaylist = (playlistProblems) => {
    if (!problems.length || !playlistProblems) return [];
    const allProblems = problems.flatMap(topic => topic.problems);
    return playlistProblems.map(id => allProblems.find(p => p.id === id)).filter(Boolean);
  };

  return (
    <div className="playlist-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>My Playlists</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          + Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Playlist Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter playlist name"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Enter playlist description"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {editingPlaylist ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {playlists.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            No playlists yet
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Create your first playlist to organize your favorite problems
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {playlists.map(playlist => {
            const playlistProblems = getProblemsInPlaylist(playlist.problems);
            return (
              <div
                key={playlist.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>
                      {playlist.name}
                    </h3>
                    {playlist.description && (
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                        {playlist.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                      <span>{playlist.problems?.length || 0} problems</span>
                      <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(playlist)}
                      style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePlaylist(playlist.id)}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {playlistProblems.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Problems in this playlist:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {playlistProblems.slice(0, 5).map(problem => (
                        <div
                          key={problem.id}
                          className="playlist-problem-item"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        >
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontWeight: '500',
                              color: '#1f2937',
                              textDecoration: 'none',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          >
                            {problem.title}
                          </a>
                          <span
                            className="difficulty-badge"
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: problem.difficulty === 'Easy' ? '#d1fae5' : problem.difficulty === 'Medium' ? '#fffbeb' : '#fee2e2',
                              color: problem.difficulty === 'Easy' ? '#047857' : problem.difficulty === 'Medium' ? '#a16207' : '#991b1b'
                            }}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                      ))}
                      {playlistProblems.length > 5 && (
                        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', padding: '4px' }}>
                          +{playlistProblems.length - 5} more problems
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;