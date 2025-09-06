import React from 'react';
import EnhancedCodeEditor from './EnhancedCodeEditor';

const CodeEditorModal = ({ isDark, onClose }) => {
  return <EnhancedCodeEditor isDark={isDark} onClose={onClose} />;
};

export default CodeEditorModal;