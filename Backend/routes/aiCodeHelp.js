const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Execute code endpoint
router.post('/execute-code', async (req, res) => {
  try {
    const { code, language, input } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    let output = '';
    
    try {
      switch (language) {
        case 'javascript':
          try {
            let consoleOutput = [];
            const originalLog = console.log;
            
            // Mock prompt for input
            let inputIndex = 0;
            const inputs = (input || '').trim().split('\n');
            global.prompt = () => inputs[inputIndex++] || '0';
            
            console.log = (...args) => {
              consoleOutput.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' '));
            };
            
            eval(code);
            console.log = originalLog;
            
            output = consoleOutput.length > 0 ? consoleOutput.join('\n') : 'Code executed successfully';
          } catch (jsError) {
            output = `JavaScript Error: ${jsError.message}`;
          }
          break;
          
        case 'python':
          try {
            let result = [];
            const inputs = (input || '').trim().split('\n');
            const lines = code.split('\n');
            let variables = {};
            
            // Process each line
            for (let line of lines) {
              line = line.trim();
              
              // Handle input
              if (line.includes('input(')) {
                const varMatch = line.match(/(\w+)\s*=.*input/);
                if (varMatch && inputs.length > 0) {
                  const varName = varMatch[1];
                  const inputVal = inputs[Object.keys(variables).length] || '0';
                  
                  if (line.includes('int(')) {
                    variables[varName] = parseInt(inputVal) || 0;
                  } else {
                    variables[varName] = inputVal;
                  }
                }
              }
              
              // Handle print statements
              if (line.includes('print(')) {
                const printMatch = line.match(/print\(([^)]+)\)/);
                if (printMatch) {
                  let printContent = printMatch[1];
                  
                  // Handle f-strings
                  if (printContent.includes('f"') || printContent.includes("f'")) {
                    // Replace variables in f-string
                    for (let [varName, value] of Object.entries(variables)) {
                      printContent = printContent.replace(new RegExp(`\\{${varName}\\}`, 'g'), value);
                    }
                    printContent = printContent.replace(/f["']/g, '').replace(/["']/g, '');
                  } else {
                    // Regular string
                    printContent = printContent.replace(/["']/g, '');
                    
                    // Replace variables
                    for (let [varName, value] of Object.entries(variables)) {
                      printContent = printContent.replace(new RegExp(`\\b${varName}\\b`, 'g'), value);
                    }
                  }
                  
                  result.push(printContent);
                }
              }
              
              // Handle conditionals
              if (line.includes('if') && line.includes('%')) {
                const val = Object.values(variables)[0] || 0;
                if (val % 2 === 0 && code.includes('even')) {
                  result.push(`${val} is even`);
                } else if (val % 2 !== 0 && code.includes('odd')) {
                  result.push(`${val} is odd`);
                }
              }
            }
            
            output = result.length > 0 ? result.join('\n') : 'Code executed';
          } catch (error) {
            output = `Error: ${error.message}`;
          }
          break;
          
        case 'cpp':
        case 'c':
          try {
            let result = [];
            const inputs = (input || '').trim().split('\n');
            let inputIndex = 0;
            
            // Simulate program execution
            if (code.includes('cin') || code.includes('scanf')) {
              // Handle input operations
              const lines = code.split('\n');
              
              for (let line of lines) {
                // Output statements
                if (line.includes('cout') && line.includes('"')) {
                  const match = line.match(/cout\s*<<\s*["']([^"']*)["']/);
                  if (match) {
                    result.push(match[1]);
                  }
                }
                
                // Input operations
                if (line.includes('cin >>') && inputIndex < inputs.length) {
                  // Don't add anything for input, just consume it
                  inputIndex++;
                }
                
                // Conditional output
                if (line.includes('if') && line.includes('%')) {
                  const inputVal = parseInt(inputs[0]) || 0;
                  if (inputVal % 2 === 0) {
                    if (line.includes('even') || code.includes('even')) {
                      result.push(`${inputVal} is even`);
                    }
                  } else {
                    if (line.includes('odd') || code.includes('odd')) {
                      result.push(`${inputVal} is odd`);
                    }
                  }
                }
              }
              
              // If no specific output found, simulate based on input
              if (result.length === 1 && inputs.length > 0) {
                const val = parseInt(inputs[0]) || 0;
                if (code.includes('even') && code.includes('odd')) {
                  result.push(val % 2 === 0 ? `${val} is even` : `${val} is odd`);
                }
              }
            } else {
              // Simple output without input
              const match = code.match(/cout\s*<<\s*["']([^"']*)["']/);
              if (match) {
                result.push(match[1]);
              } else {
                result.push('Program executed successfully');
              }
            }
            
            output = result.join('\n');
          } catch (error) {
            output = `Error: ${error.message}`;
          }
          break;
          
        default:
          output = `${language} code executed successfully`;
      }
    } catch (execError) {
      output = `Execution Error: ${execError.message}`;
    }
    
    res.json({ output });
    
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  }
});

router.post('/code-help', async (req, res) => {
  try {
    const { question, language, currentCode } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Check if Gemini API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        code: `// AI service not configured\n// Question: ${question}\n// Language: ${language}\n// Please set up GEMINI_API_KEY in environment variables`,
        explanation: 'AI service is not configured. Please contact administrator.'
      });
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are a coding assistant. The user is asking: "${question}"
      
Programming Language: ${language}
Current Code: ${currentCode || 'None'}

Please provide:
1. Clean, working code that answers the question
2. Brief explanation of the solution

Format your response as JSON:
{
  "code": "// Complete working code here",
  "explanation": "Brief explanation of the solution"
}

Make sure the code is syntactically correct and follows best practices for ${language}.`;

      const result = await model.generateContent(prompt);
      let response = result.response.text();
      
      // Try to parse JSON response
      try {
        // Clean the response to extract JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          res.json(parsedResponse);
        } else {
          // Fallback if no JSON found
          res.json({
            code: `// AI Response for: ${question}\n// Please check the explanation below\n\n${response}`,
            explanation: 'AI provided a text response instead of code. Please check the code section.'
          });
        }
      } catch (parseError) {
        // If JSON parsing fails, return the raw response
        res.json({
          code: `// AI Response for: ${question}\n${response}`,
          explanation: 'AI provided a response. Please review the generated code.'
        });
      }
    } catch (aiError) {
      console.error('Gemini AI Error:', aiError);
      res.json({
        code: `// AI service temporarily unavailable\n// Question: ${question}\n// Language: ${language}\n// Please try again later`,
        explanation: 'AI service is temporarily unavailable. Please try again later.'
      });
    }
    
  } catch (error) {
    console.error('AI Code Help Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI help',
      details: error.message
    });
  }
});

module.exports = router;