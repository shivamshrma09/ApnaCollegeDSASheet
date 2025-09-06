import React from 'react';

const RichTextDisplay = ({ content }) => {
  if (!content) return null;

  // Simple HTML content display
  const displayContent = typeof content === 'string' ? content : JSON.stringify(content);

  return (
    <div 
      style={{
        lineHeight: '1.6',
        color: '#374151',
        fontSize: '14px'
      }}
      dangerouslySetInnerHTML={{ 
        __html: displayContent.replace(/\n/g, '<br>') 
      }}
    />
  );
};

export default RichTextDisplay;