import { allowCors, handleError } from './_utils.js';
import { aiChatSchema } from '../src/lib/validators.js';

// SYSTEM PERSONAS
const PERSONAS = {
  Nova: "You are Nova, an enthusiastic and general-purpose coding assistant. You love helping beginners and experts alike. Keep answers concise but friendly.",
  Astra: "You are Astra, a specialized debugging assistant. You focus strictly on finding errors, logical flaws, and security vulnerabilities in code provided. Be precise and technical.",
  Zen: "You are Zen, an optimization expert. Your goal is to make code run faster, use less memory, and follow clean code principles. You prefer functional programming patterns.",
  Echo: "You are Echo, a refactoring assistant. You rewrite code to be more readable and maintainable without changing its behavior. You love DRY and KISS principles.",
  Lumen: "You are Lumen, a documentation wizard. You explain complex code in simple terms and generate JSDoc/Markdown comments for functions.",
  Atlas: "You are Atlas, a software architect. You think in systems, scalability, and database schemas. You advise on structure, tech stack, and high-level design."
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Validate Input
    const body = aiChatSchema.parse(req.body);
    const { message, ai_name, project_context, history } = body;

    // 2. Check Secrets
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
    const SITE_NAME = process.env.SITE_NAME || 'CodeWithPratik';

    if (!API_KEY) {
      console.error('Missing OPENROUTER_API_KEY');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    // 3. Construct Messages
    const systemMessage = {
      role: 'system',
      content: `${PERSONAS[ai_name]} 
      
      CONTEXT:
      ${project_context ? `The user is working on this project:\n${project_context}` : 'No specific project context.'}
      
      You are powered by Claude 3.5 Sonnet. Format responses in Markdown. Use code blocks for code.`
    };

    // Filter history to keep it lightweight (last 10 messages max)
    const recentHistory = history.slice(-10);
    const messages = [systemMessage, ...recentHistory, { role: 'user', content: message }];

    // 4. Call OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: messages,
        stream: true, // Enable streaming
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter API Error:', err);
      throw new Error(`Upstream API Error: ${response.status}`);
    }

    // 5. Handle Streaming Response
    // Vercel Serverless (Node.js) stream handling
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      // Pass the raw chunk to the client (client will parse SSE)
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    handleError(res, error);
  }
}

export default allowCors(handler);
