// Koi external import nahi (Taaki crash na ho)
export default async function handler(req, res) {
  
  // 1. CORS HEADERS (Manual Setup)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle Preflight Request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST Allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. CHECK API KEY
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://code-with-pratik.vercel.app';
    const SITE_NAME = process.env.SITE_NAME || 'CodeWithPratik';

    if (!API_KEY) {
      return res.status(500).json({ error: "Server Config Error: Missing OPENROUTER_API_KEY" });
    }

    // 3. GET DATA (Manual Validation)
    const { message, ai_name, project_context, history } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 4. PREPARE PROMPT
    const aiRole = ai_name || 'Nova';
    const systemPrompt = `You are ${aiRole}, a coding assistant. 
    CONTEXT: ${project_context ? project_context.slice(0, 3000) : 'No context provided.'}`;

    // History limit (Last 6 messages)
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message }
    ];

    // 5. CALL OPENROUTER (Using STABLE FREE MODEL)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Yeh model 100% Free aur Stable hai
        model: 'google/gemini-2.0-flash-exp:free', 
        messages: messages,
        stream: true, 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      return res.status(response.status).json({ error: `AI Provider Error: ${errorText}` });
    }

    // 6. STREAM RESPONSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    if (!response.body) {
       throw new Error("No response body from AI provider");
    }

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
    console.error("Server Crash Error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
}
