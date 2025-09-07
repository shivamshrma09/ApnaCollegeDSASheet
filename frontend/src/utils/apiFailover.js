// API Failover System for Interview Mode
class APIFailoverManager {
  constructor() {
    this.primaryAPI = 'https://api.openai.com/v1';
    this.fallbackAPIs = [
      'https://api.anthropic.com/v1',
      'https://api.cohere.ai/v1',
      'https://api.together.xyz/v1'
    ];
    this.currentAPIIndex = 0;
    this.rateLimitResetTime = null;
  }

  async makeRequest(endpoint, options = {}) {
    const apis = [this.primaryAPI, ...this.fallbackAPIs];
    
    for (let i = 0; i < apis.length; i++) {
      try {
        const apiUrl = apis[i];
        const response = await fetch(`${apiUrl}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.getAPIKey(apiUrl)}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 429) {
          // Rate limit exceeded, try next API
          console.warn(`Rate limit exceeded for ${apiUrl}, switching to fallback`);
          continue;
        }

        if (response.ok) {
          return response;
        }

        throw new Error(`API request failed: ${response.status}`);
      } catch (error) {
        console.error(`API ${apis[i]} failed:`, error);
        if (i === apis.length - 1) {
          throw new Error('All APIs failed');
        }
      }
    }
  }

  getAPIKey(apiUrl) {
    if (apiUrl.includes('openai')) {
      return import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY || 'fallback-key';
    } else if (apiUrl.includes('anthropic')) {
      return import.meta.env.VITE_ANTHROPIC_API_KEY || import.meta.env.REACT_APP_ANTHROPIC_API_KEY || 'fallback-key';
    } else if (apiUrl.includes('cohere')) {
      return import.meta.env.VITE_COHERE_API_KEY || import.meta.env.REACT_APP_COHERE_API_KEY || 'fallback-key';
    } else if (apiUrl.includes('together')) {
      return import.meta.env.VITE_TOGETHER_API_KEY || import.meta.env.REACT_APP_TOGETHER_API_KEY || 'fallback-key';
    }
    return 'fallback-key';
  }

  async generateInterviewQuestion(problemData) {
    try {
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Generate an interview question based on: ${problemData.title}`
          }],
          max_tokens: 150
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      // Fallback to local questions if all APIs fail
      return this.getLocalFallbackQuestion(problemData);
    }
  }

  getLocalFallbackQuestion(problemData) {
    const fallbackQuestions = [
      `Explain the approach to solve ${problemData.title}`,
      `What's the time complexity of your solution for ${problemData.title}?`,
      `Can you optimize the solution for ${problemData.title}?`,
      `What edge cases should we consider for ${problemData.title}?`
    ];
    return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
  }
}

export default new APIFailoverManager();