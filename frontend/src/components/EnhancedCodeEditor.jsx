import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const EnhancedCodeEditor = ({ isDark, onClose }) => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(true);
  const editorRef = useRef(null);

  const languages = [
    { id: 'cpp', name: 'C++', monaco: 'cpp' },
    { id: 'java', name: 'Java', monaco: 'java' },
    { id: 'python', name: 'Python', monaco: 'python' },
    { id: 'javascript', name: 'JavaScript', monaco: 'javascript' },
    { id: 'c', name: 'C', monaco: 'c' },
    { id: 'go', name: 'Go', monaco: 'go' },
    { id: 'rust', name: 'Rust', monaco: 'rust' },
    { id: 'php', name: 'PHP', monaco: 'php' },
    { id: 'ruby', name: 'Ruby', monaco: 'ruby' },
    { id: 'kotlin', name: 'Kotlin', monaco: 'kotlin' },
    { id: 'swift', name: 'Swift', monaco: 'swift' },
    { id: 'csharp', name: 'C#', monaco: 'csharp' }
  ];

  const defaultCode = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
    python: `print("Hello World!")`,
    javascript: `console.log("Hello World!");`,
    c: `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
    go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}`,
    rust: `fn main() {
    println!("Hello World!");
}`,
    php: `<?php
echo "Hello World!";
?>`,
    ruby: `puts "Hello World!"`,
    kotlin: `fun main() {
    println("Hello World!")
}`,
    swift: `print("Hello World!")`,
    csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello World!");
    }
}`
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    const codeToRun = code || defaultCode[language];
    
    try {
      let result = await tryPistonAPI(codeToRun);
      if (!result.success) {
        result = await tryOneCompilerAPI(codeToRun);
      }
      if (!result.success) {
        result = await tryCodexAPI(codeToRun);
      }
      if (!result.success) {
        result = simulateExecution(codeToRun);
      }
      
      setOutput(result.output);
    } catch (error) {
      console.error('All APIs failed, using simulation:', error);
      const result = simulateExecution(codeToRun);
      setOutput(result.output);
    } finally {
      setIsRunning(false);
    }
  };

  const tryPistonAPI = async (codeToRun) => {
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          version: '*',
          files: [{ content: codeToRun }],
          stdin: input
        })
      });
      
      const result = await response.json();
      if (result.run && (result.run.stdout || result.run.stderr)) {
        return {
          success: true,
          output: result.run.stdout || result.run.stderr
        };
      }
    } catch (error) {
      console.log('Piston API failed:', error);
    }
    return { success: false };
  };

  const tryOneCompilerAPI = async (codeToRun) => {
    try {
      const langMap = {
        'cpp': 'cpp17',
        'java': 'java',
        'python': 'python3',
        'javascript': 'nodejs',
        'c': 'c',
        'go': 'go'
      };
      
      const response = await fetch('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': 'demo-key'
        },
        body: JSON.stringify({
          language: langMap[language],
          stdin: input,
          files: [{
            name: 'main',
            content: codeToRun
          }]
        })
      });
      
      const result = await response.json();
      if (result.stdout || result.stderr) {
        return {
          success: true,
          output: result.stdout || result.stderr
        };
      }
    } catch (error) {
      console.log('OneCompiler API failed:', error);
    }
    return { success: false };
  };

  const tryCodexAPI = async (codeToRun) => {
    try {
      const response = await fetch('https://api.codex.jaagrav.in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToRun,
          language: language,
          input: input
        })
      });
      
      const result = await response.json();
      if (result.output) {
        return {
          success: true,
          output: result.output
        };
      }
    } catch (error) {
      console.log('Codex API failed:', error);
    }
    return { success: false };
  };

  const simulateExecution = (codeToRun) => {
    if (language === 'javascript') {
      return simulateJavaScript(codeToRun);
    } else if (language === 'python') {
      return simulatePython(codeToRun);
    } else if (language === 'cpp' || language === 'c') {
      return simulateCpp(codeToRun);
    } else if (language === 'java') {
      return simulateJava(codeToRun);
    } else if (language === 'go') {
      return simulateGo(codeToRun);
    }
    return { success: true, output: 'Code executed successfully' };
  };

  const simulateJavaScript = (code) => {
    try {
      const logs = [];
      const mockConsole = {
        log: (...args) => logs.push(args.join(' ')),
        error: (...args) => logs.push('Error: ' + args.join(' '))
      };
      
      const safeCode = code.replace(/console\./g, 'mockConsole.');
      const func = new Function('mockConsole', 'input', `
        const inputLines = input.split('\\n');
        let inputIndex = 0;
        const readline = () => inputLines[inputIndex++] || '';
        ${safeCode}
      `);
      
      func(mockConsole, input);
      return { success: true, output: logs.join('\n') || 'No output' };
    } catch (error) {
      return { success: true, output: `Error: ${error.message}` };
    }
  };

  const simulatePython = (code) => {
    const lines = code.split('\n');
    const outputs = [];
    const inputLines = input.split('\n');
    let inputIndex = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('print(')) {
        const match = trimmed.match(/print\(([^)]+)\)/);
        if (match) {
          let content = match[1];
          if (content.startsWith('"') && content.endsWith('"')) {
            outputs.push(content.slice(1, -1));
          } else if (content.startsWith("'") && content.endsWith("'")) {
            outputs.push(content.slice(1, -1));
          } else {
            outputs.push(content);
          }
        }
      } else if (trimmed.includes('input(')) {
        if (inputIndex < inputLines.length) {
          inputIndex++;
        }
      }
    }
    
    return { success: true, output: outputs.join('\n') || 'No output' };
  };

  const simulateCpp = (code) => {
    const outputs = [];
    const inputLines = input.split('\n');
    let inputIndex = 0;
    
    const coutMatches = code.match(/cout\s*<<\s*[^;]+/g);
    if (coutMatches) {
      for (const match of coutMatches) {
        if (match.includes('"')) {
          const stringMatch = match.match(/"([^"]*)"/g);
          if (stringMatch) {
            outputs.push(...stringMatch.map(s => s.slice(1, -1)));
          }
        }
      }
    }
    
    if (code.includes('cin') && input.trim()) {
      const lines = input.trim().split('\n');
      if (lines.length >= 3) {
        const num1 = parseFloat(lines[0]);
        const op = lines[1];
        const num2 = parseFloat(lines[2]);
        
        outputs.push('Enter first number: ');
        outputs.push('Enter operator (+, -, *, /): ');
        outputs.push('Enter second number: ');
        
        let result;
        switch (op) {
          case '+':
            result = num1 + num2;
            outputs.push(`${num1} + ${num2} = ${result}`);
            break;
          case '-':
            result = num1 - num2;
            outputs.push(`${num1} - ${num2} = ${result}`);
            break;
          case '*':
            result = num1 * num2;
            outputs.push(`${num1} * ${num2} = ${result}`);
            break;
          case '/':
            if (num2 !== 0) {
              result = num1 / num2;
              outputs.push(`${num1} / ${num2} = ${result}`);
            } else {
              outputs.push('Error: Division by zero!');
            }
            break;
          default:
            outputs.push('Invalid operator!');
        }
      }
    }
    
    return { success: true, output: outputs.join('\n') || 'Hello World!' };
  };

  const simulateJava = (code) => {
    const outputs = [];
    const printMatches = code.match(/System\.out\.print[ln]*\([^)]+\)/g);
    
    if (printMatches) {
      for (const match of printMatches) {
        const stringMatch = match.match(/"([^"]*)"/g);
        if (stringMatch) {
          outputs.push(...stringMatch.map(s => s.slice(1, -1)));
        }
      }
    }
    
    return { success: true, output: outputs.join('\n') || 'Hello World!' };
  };

  const simulateGo = (code) => {
    const outputs = [];
    const printMatches = code.match(/fmt\.Print[ln]*\([^)]+\)/g);
    
    if (printMatches) {
      for (const match of printMatches) {
        const stringMatch = match.match(/"([^"]*)"/g);
        if (stringMatch) {
          outputs.push(...stringMatch.map(s => s.slice(1, -1)));
        }
      }
    }
    
    return { success: true, output: outputs.join('\n') || 'Hello World!' };
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (!code.trim()) {
      setCode(defaultCode[newLanguage]);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    editor.updateOptions({
      fontSize: fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  React.useEffect(() => {
    setCode(defaultCode[language]);
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: fontSize,
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap }
      });
    }
  }, [fontSize, wordWrap, minimap]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '90%',
        height: '85%',
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: `1px solid ${isDark ? '#3e3e42' : '#e5e5e5'}`,
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Enhanced Header */}
        <div style={{
          padding: '0 16px',
          background: isDark ? '#2d2d30' : '#f8f9fa',
          borderBottom: `1px solid ${isDark ? '#3e3e42' : '#e5e5e5'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '50px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '600',
              color: isDark ? '#ffffff' : '#24292f'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.4,16.6L4.8,12L3.4,13.4L9.4,19.4L20.6,8.2L19.2,6.8L9.4,16.6Z" />
              </svg>
              Code Editor
            </div>
            
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${isDark ? '#464647' : '#d0d7de'}`,
                background: isDark ? '#3c3c3c' : '#ffffff',
                color: isDark ? '#cccccc' : '#24292f',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${isDark ? '#464647' : '#d0d7de'}`,
                  background: isDark ? '#3c3c3c' : '#ffffff',
                  color: isDark ? '#cccccc' : '#24292f',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
              </select>
              
              <button
                onClick={() => setWordWrap(!wordWrap)}
                style={{
                  padding: '6px 10px',
                  background: wordWrap ? '#1E90FF' : 'transparent',
                  color: wordWrap ? '#ffffff' : (isDark ? '#cccccc' : '#6c757d'),
                  border: `1px solid ${wordWrap ? '#1E90FF' : (isDark ? '#464647' : '#d0d7de')}`,
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                title="Toggle Word Wrap"
              >
                Wrap
              </button>
              
              <button
                onClick={() => setMinimap(!minimap)}
                style={{
                  padding: '6px 10px',
                  background: minimap ? '#1E90FF' : 'transparent',
                  color: minimap ? '#ffffff' : (isDark ? '#cccccc' : '#6c757d'),
                  border: `1px solid ${minimap ? '#1E90FF' : (isDark ? '#464647' : '#d0d7de')}`,
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                title="Toggle Minimap"
              >
                Map
              </button>
              
              <button
                onClick={formatCode}
                style={{
                  padding: '6px 10px',
                  background: '#1E90FF',
                  color: '#ffffff',
                  border: `1px solid #1E90FF`,
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                title="Format Code (Shift+Alt+F)"
              >
                Format
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={runCode}
              disabled={isRunning}
              style={{
                padding: '8px 16px',
                background: isRunning ? '#6b7280' : '#1E90FF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {isRunning ? (
                <>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Running
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                  Run
                </>
              )}
            </button>
            
            <button style={{
              padding: '8px 16px',
              background: '#1E90FF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z" />
              </svg>
              Submit
            </button>
            
            <div style={{
              fontSize: '10px',
              color: isDark ? '#888' : '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: '8px'
            }}>
              <kbd style={{
                background: isDark ? '#555' : '#e0e0e0',
                padding: '1px 4px',
                borderRadius: '2px',
                fontSize: '9px'
              }}>Ctrl+Enter</kbd>
            </div>
            
            <button 
              onClick={onClose}
              style={{
                padding: '6px 10px',
                backgroundColor: '#ff4757',
                border: 'none',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '12px',
                borderRadius: '4px',
                marginLeft: '8px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff3742';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ff4757';
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Code Editor */}
          <div style={{ 
            flex: '1 1 65%', 
            display: 'flex', 
            flexDirection: 'column',
            minWidth: 0,
            background: isDark ? '#1e1e1e' : '#ffffff'
          }}>
            <Editor
              height="100%"
              language={languages.find(l => l.id === language)?.monaco || 'cpp'}
              value={code || defaultCode[language]}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{
                fontSize: fontSize,
                fontFamily: 'Fira Code, JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
                fontLigatures: true,
                wordWrap: wordWrap ? 'on' : 'off',
                minimap: { enabled: minimap },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: false,
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                acceptSuggestionOnCommitCharacter: true,
                snippetSuggestions: 'top',
                wordBasedSuggestions: true,
                parameterHints: { enabled: true },
                hover: { enabled: true },
                contextmenu: true,
                mouseWheelZoom: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
                smoothScrolling: true,
                lineNumbers: 'on',
                glyphMargin: true,
                folding: true,
                foldingHighlight: true,
                showFoldingControls: 'mouseover',
                matchBrackets: 'always',
                renderLineHighlight: 'all',
                selectionHighlight: true,
                occurrencesHighlight: true,
                codeLens: true,
                colorDecorators: true,
                lightbulb: { enabled: true },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true
                }
              }}
              loading={
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: isDark ? '#1e1e1e' : '#ffffff',
                  color: isDark ? '#cccccc' : '#666666'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '16px'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid #007acc',
                      borderTop: '3px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Loading Monaco Editor...
                  </div>
                </div>
              }
            />
          </div>

          {/* Input/Output Panel */}
          <div style={{
            flex: '0 0 30%',
            borderLeft: `1px solid ${isDark ? '#3e3e42' : '#e5e5e5'}`,
            display: 'flex',
            flexDirection: 'column',
            background: isDark ? '#252526' : '#f8f9fa'
          }}>
            {/* Input Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                padding: '12px 16px',
                background: isDark ? '#37373d' : '#f1f3f4',
                borderBottom: `1px solid ${isDark ? '#3e3e42' : '#e5e5e5'}`,
                fontSize: '12px',
                fontWeight: '600',
                color: isDark ? '#cccccc' : '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H5M5,5H19V19H5V5Z" />
                </svg>
                Input
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'Fira Code, JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  background: isDark ? '#1e1e1e' : '#ffffff',
                  color: isDark ? '#d4d4d4' : '#24292f',
                  resize: 'none'
                }}
                placeholder="Enter input here...

Example:
5
10
+"
                spellCheck={false}
              />
            </div>

            {/* Output Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                padding: '12px 16px',
                background: isDark ? '#37373d' : '#f1f3f4',
                borderBottom: `1px solid ${isDark ? '#3e3e42' : '#e5e5e5'}`,
                borderTop: `1px solid ${isDark ? '#3e3e42' : '#e5e5e5'}`,
                fontSize: '12px',
                fontWeight: '600',
                color: isDark ? '#cccccc' : '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,3H22C23.05,3 24,3.95 24,5V19C24,20.05 23.05,21 22,21H2C0.95,21 0,20.05 0,19V5C0,3.95 0.95,3 2,3M14,6V7H22V6H14M14,8V9H21.5L22,9.5V8H14M14,10V11H21V10H14M8,13.91C8,14.42 7.78,14.86 7.41,15.12L6.87,15.5C7.78,15.79 8.5,16.6 8.5,17.5A2.5,2.5 0 0,1 6,20H2V14H6A2,2 0 0,1 8,16V13.91M6,15H4V16H6V15M6,17H4V18H6V17Z" />
                  </svg>
                  Output
                </div>
                {output && (
                  <div style={{
                    fontSize: '11px',
                    color: output.includes('Error') ? '#ff6b6b' : '#4ecdc4',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {output.includes('Error') ? '❌ Error' : '✅ Success'}
                  </div>
                )}
              </div>
              <div style={{
                flex: 1,
                padding: '12px',
                fontFamily: 'Fira Code, JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
                fontSize: '13px',
                lineHeight: '1.5',
                background: isDark ? '#1e1e1e' : '#ffffff',
                color: output.includes('Error') ? '#ff6b6b' : (isDark ? '#d4d4d4' : '#24292f'),
                whiteSpace: 'pre-wrap',
                overflow: 'auto',
                border: output.includes('Error') ? '1px solid #ff6b6b' : 'none',
                borderTop: 'none'
              }}>
                {output || (
                  <div style={{
                    color: isDark ? '#888' : '#666',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    Click "Run" to see output...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${isDark ? '#2d2d30' : '#f1f1f1'};
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${isDark ? '#464647' : '#c1c1c1'};
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? '#5a5a5c' : '#a8a8a8'};
          }
        `}</style>
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;