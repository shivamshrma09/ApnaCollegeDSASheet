import React from 'react';

const PlaylistSheet = ({ isOpen, onClose, playlist, userId, completedProblems, starredProblems, sheetType }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '800px',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{playlist?.name || 'Playlist'}</h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}>✕</button>
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <p>Playlist content will be displayed here.</p>
          <p>Problems: {playlist?.problems?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSheet;