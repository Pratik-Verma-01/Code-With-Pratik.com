export default async function handler(req, res) {
  
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://code-with-pratik.vercel.app';
    const SITE_NAME = process.env.SITE_NAME || 'CodeWithPratik';

    if (!API_KEY) return res.status(500).json({ error: "Missing API Key" });

    const { message, ai_name, project_context, history } = req.body || {};

    if (!message) return res.status(400).json({ error: "Message is required" });

    const aiRole = ai_name || 'Nova';
    const systemPrompt = `You are ${aiRole}. CONTEXT: ${project_context ? project_context.slice(0, 3000) : 'No context.'}`;

    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message }
    ];

    // 2. CALL OPENROUTER (Changed Model to Llama 3 - More Stable)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // YAHAN CHANGE KIYA HAI 👇
        model: 'meta-llama/llama-3.2-3b-instruct:free', 
        messages: messages,
        stream: true, 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Agar error aaye to console mein dikhao
      console.error("OpenRouter Error:", errorText);
      return res.status(500).json({ error: `AI Provider Error: ${errorText}` });
    }

    // 3. STREAM RESPONSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    if (!response.body) throw new Error("No response body");

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
    console.error("Server Crash:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
