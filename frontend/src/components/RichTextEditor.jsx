import React, { useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const { isDark } = useTheme();
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertCodeSnippet = (language) => {
    insertText(`\n\`\`\`${language}\n`, '\n\`\`\`\n');
  };

  const renderPreview = (text) => {
    const codeBlockBg = isDark ? '#0f172a' : '#1f2937';
    const codeBlockColor = isDark ? '#e2e8f0' : '#e5e7eb';
    const inlineCodeBg = isDark ? '#374151' : '#f3f4f6';
    const inlineCodeColor = isDark ? '#e2e8f0' : '#1f2937';
    const quoteBorderColor = isDark ? '#60a5fa' : '#3b82f6';
    const quoteColor = isDark ? '#9ca3af' : '#6b7280';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size: 1.5em; font-weight: bold; margin: 0.5em 0;">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.3em; font-weight: bold; margin: 0.4em 0;">$1</h2>')
      .replace(/`([^`]+)`/g, `<code style="background: ${inlineCodeBg}; color: ${inlineCodeColor}; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>`)
      .replace(/^> (.*$)/gm, `<blockquote style="border-left: 3px solid ${quoteBorderColor}; padding-left: 12px; margin: 8px 0; color: ${quoteColor};">$1</blockquote>`)
      .replace(/^• (.*$)/gm, '<li style="margin-left: 20px;">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li style="margin-left: 20px; list-style-type: decimal;">$1</li>')
      .replace(/```([\s\S]*?)```/g, `<pre style="background: ${codeBlockBg}; color: ${codeBlockColor}; padding: 12px; border-radius: 6px; overflow-x: auto; font-family: monospace; margin: 8px 0; border: 1px solid ${isDark ? '#4b5563' : '#374151'};"><code>$1</code></pre>`)
      .replace(/\n/g, '<br>');
  };

  const toolbarButtons = [
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6,10.79C16.57,10.11 17.25,9.02 17.25,8C17.25,5.74 15.5,4 13.25,4C11,4 9.25,5.74 9.25,8C9.25,9.02 9.93,10.11 10.9,10.79C9.25,11.26 8,12.74 8,14.5C8,16.26 9.74,18 11.5,18H15C16.26,18 17.5,16.74 17.5,15.5C17.5,12.74 16.25,11.26 14.6,10.79H15.6M11.5,16C10.83,16 10.5,15.67 10.5,15C10.5,14.33 10.83,14 11.5,14H15C15.67,14 16,14.33 16,15C16,15.67 15.67,16 15,16H11.5M13.25,10C12.58,10 11.75,9.17 11.75,8.5C11.75,7.83 12.58,7 13.25,7C13.92,7 14.75,7.83 14.75,8.5C14.75,9.17 13.92,10 13.25,10Z"/></svg>,
      title: 'Bold', 
      action: () => insertText('**', '**') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z"/></svg>,
      title: 'Italic', 
      action: () => insertText('*', '*') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z"/></svg>,
      title: 'Underline', 
      action: () => insertText('<u>', '</u>') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M14,18V16H16.5L18.5,4H15V2H21V4H20.5L18.5,16H21V18H14Z"/></svg>,
      title: 'Heading 1', 
      action: () => insertText('\n# ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M21,6.5C21,7.3 20.3,8 19.5,8H16V16H19.5C20.3,16 21,16.7 21,17.5C21,18.3 20.3,19 19.5,19H13V4H19.5C20.3,4 21,4.7 21,5.5V6.5Z"/></svg>,
      title: 'Heading 2', 
      action: () => insertText('\n## ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"/></svg>,
      title: 'Bullet List', 
      action: () => insertText('\n• ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z"/></svg>,
      title: 'Numbered List', 
      action: () => insertText('\n1. ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,10.68 7.8,12.17 9,13.09V16H15V13.09C16.2,12.17 17,10.68 17,9A5,5 0 0,0 12,4Z"/></svg>,
      title: 'Tip', 
      action: () => insertText('\n💡 **Tip:** ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/></svg>,
      title: 'Warning', 
      action: () => insertText('\n⚠️ **Warning:** ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/></svg>,
      title: 'Success', 
      action: () => insertText('\n✅ **Success:** ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/></svg>,
      title: 'Link', 
      action: () => insertText('[', '](url)') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/></svg>,
      title: 'Inline Code', 
      action: () => insertText('`', '`') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14,17H17L19,13V7H5V13L7,17H10V19A1,1 0 0,0 11,20H13A1,1 0 0,0 14,19V17M12,2A1,1 0 0,1 13,3V4H19A2,2 0 0,1 21,6V13A2,2 0 0,1 19,15H17L15,19V20A3,3 0 0,1 12,23H12A3,3 0 0,1 9,20V19L7,15H5A2,2 0 0,1 3,13V6A2,2 0 0,1 5,4H11V3A1,1 0 0,1 12,2Z"/></svg>,
      title: 'Quote', 
      action: () => insertText('\n> ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19,13H5V11H19V13Z"/></svg>,
      title: 'Divider', 
      action: () => insertText('\n---\n') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>,
      title: 'Note', 
      action: () => insertText('\n📝 **Note:** ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2L13.09,8.26L22,9L14,14L17,23L12,18L7,23L10,14L2,9L10.91,8.26L12,2Z"/></svg>,
      title: 'Approach', 
      action: () => insertText('\n🎯 **Approach:** ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12C2,6.5 6.47,2 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/></svg>,
      title: 'Time Complexity', 
      action: () => insertText('\n⏰ **Time:** O() ') 
    },
    { 
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4Z"/></svg>,
      title: 'Space Complexity', 
      action: () => insertText('\n💾 **Space:** O() ') 
    }
  ];

  const codeLanguages = [
    { label: 'JS', lang: 'javascript' },
    { label: 'PY', lang: 'python' },
    { label: 'CPP', lang: 'cpp' },
    { label: 'JAVA', lang: 'java' },
    { label: 'C', lang: 'c' }
  ];

  return (
    <div style={{ 
      border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`, 
      borderRadius: '12px', 
      overflow: 'hidden',
      backgroundColor: isDark ? '#1f2937' : 'white'
    }}>
      {/* Enhanced toolbar */}
      <div style={{
        padding: '12px',
        backgroundColor: isDark ? '#374151' : '#f8fafc',
        borderBottom: `1px solid ${isDark ? '#4b5563' : '#e2e8f0'}`,
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Formatting buttons */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {toolbarButtons.map((btn, index) => (
            <button
              key={index}
              type="button"
              title={btn.title}
              style={{
                padding: '6px 8px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '6px',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? '#e5e7eb' : '#374151',
                cursor: 'pointer',
                minWidth: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onClick={btn.action}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? '#1f2937' : 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Preview toggle */}
        <button
          type="button"
          title="Toggle Preview"
          style={{
            padding: '6px 12px',
            border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '6px',
            backgroundColor: showPreview ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#1f2937' : 'white'),
            color: showPreview ? 'white' : (isDark ? '#e5e7eb' : '#374151'),
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginLeft: 'auto'
          }}
          onClick={() => setShowPreview(!showPreview)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
          </svg>
          {showPreview ? 'Edit' : 'Preview'}
        </button>

        {/* Code language buttons */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          {codeLanguages.map((lang, index) => (
            <button
              key={index}
              type="button"
              title={`${lang.lang} code block`}
              style={{
                padding: '4px 6px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '4px',
                backgroundColor: isDark ? '#374151' : '#f8fafc',
                color: isDark ? '#60a5fa' : '#3b82f6',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '600',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace'
              }}
              onClick={() => insertCodeSnippet(lang.lang)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#1e40af' : '#dbeafe';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? '#374151' : '#f8fafc';
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>


      </div>
      
      {/* Content area */}
      <div style={{ display: 'flex', minHeight: '300px' }}>
        {/* Text area */}
        {!showPreview && (
          <textarea
            ref={textareaRef}
            className="rich-text-area"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              minHeight: '300px',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              backgroundColor: isDark ? '#1f2937' : 'white',
              color: isDark ? '#e5e7eb' : '#374151',
              tabSize: 2
            }}
          />
        )}
        
        {/* Preview area */}
        {showPreview && (
          <div
            style={{
              width: '100%',
              minHeight: '300px',
              padding: '16px',
              backgroundColor: isDark ? '#1f2937' : 'white',
              color: isDark ? '#e5e7eb' : '#374151',
              fontSize: '14px',
              lineHeight: '1.6',
              overflow: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        )}
      </div>
      
      {/* Enhanced helper text */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: isDark ? '#374151' : '#f8fafc',
        borderTop: `1px solid ${isDark ? '#4b5563' : '#e2e8f0'}`,
        fontSize: '12px',
        color: isDark ? '#9ca3af' : '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
        </svg>
        <span>
          Use **bold**, *italic*, `code`, &gt; quotes, • lists to format your notes. 
          <strong>Code blocks:</strong> JS, PY, CPP, JAVA, C supported.
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;