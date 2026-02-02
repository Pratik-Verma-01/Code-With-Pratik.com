import { allowCors } from './_utils.js';
import { z } from 'zod'; // Direct Zod import (No src file dependency)

// --- SCHEMA DEFINITION (LOCALLY) ---
// Hum yahi define kar rahe hain taaki import error na aaye
const aiChatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000),
  ai_name: z.string(),
  project_context: z.string().optional(),
  history: z.array(z.any()).optional().default([]),
});

// --- SYSTEM PERSONAS ---
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
    // 1. Secrets Check
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://code-with-pratik.vercel.app';
    const SITE_NAME = process.env.SITE_NAME || 'CodeWithPratik';

    if (!API_KEY) {
      console.error("CRITICAL: OPENROUTER_API_KEY is missing in Vercel Envs");
      // Specific error message bhejo taaki user ko pata chale
      return res.status(500).json({ error: "Server Config Error: Missing API Key" });
    }

    // 2. Validate Input
    const body = aiChatSchema.parse(req.body);
    const { message, ai_name, project_context, history } = body;

    // 3. Construct Messages
    const personaPrompt = PERSONAS[ai_name] || PERSONAS['Nova'];
    
    const systemMessage = {
      role: 'system',
      content: `${personaPrompt} 
      
      CONTEXT OF PROJECT:
      ${project_context ? project_context.slice(0, 3000) : 'No specific project context.'}
      
      You are powered by Claude 3.5 Sonnet. Format responses in Markdown. Use code blocks for code.`
    };

    // Filter history (Last 6 messages only to save tokens)
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    
    // Final Message Payload
    const messages = [
      systemMessage, 
      ...recentHistory, 
      { role: 'user', content: message }
    ];

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
        stream: true, // Streaming ON
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter API Error:', errText);
      throw new Error(`OpenRouter Error (${response.status}): ${errText}`);
    }

    // 5. Stream Response Back
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
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error('[SERVER ERROR]:', error);
    
    // Zod Validation Error
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid Input', details: error.errors });
    }

    // Generic Error with Message
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message || "Unknown server error" 
    });
  }
}

export default allowCors(handler);
