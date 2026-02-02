import { allowCors } from './_utils.js';
import { z } from 'zod';

const aiChatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000),
  ai_name: z.string(),
  project_context: z.string().optional(),
  history: z.array(z.any()).optional().default([]),
});

const PERSONAS = {
  Nova: "You are Nova, an enthusiastic coding assistant.",
  Astra: "You are Astra, a debugging expert.",
  Zen: "You are Zen, an optimization expert.",
  Echo: "You are Echo, a refactoring assistant.",
  Lumen: "You are Lumen, a documentation wizard.",
  Atlas: "You are Atlas, a software architect."
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://code-with-pratik.vercel.app';
    const SITE_NAME = process.env.SITE_NAME || 'CodeWithPratik';

    if (!API_KEY) return res.status(500).json({ error: "Server Config Error: Missing API Key" });

    const body = aiChatSchema.parse(req.body);
    const { message, ai_name, project_context, history } = body;
    const personaPrompt = PERSONAS[ai_name] || PERSONAS['Nova'];
    
    const systemMessage = {
      role: 'system',
      content: `${personaPrompt} 
      CONTEXT: ${project_context ? project_context.slice(0, 3000) : 'No context.'}`
    };

    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    const messages = [systemMessage, ...recentHistory, { role: 'user', content: message }];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // YAHAN CHANGE KIYA HAI (FREE MODEL)
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        messages: messages,
        stream: true,
        temperature: 0.7,
        // Max tokens thoda kam kiya taaki free tier mein fit ho
        max_tokens: 2000 
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter Error:', errText);
      throw new Error(`OpenRouter Error (${response.status}): ${errText}`);
    }

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
    console.error(error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}

export default allowCors(handler);    while (true) {
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
