export default async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const API_KEY = process.env.OPENROUTER_API_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://codewithpratik1.vercel.app';
    const SITE_NAME = process.env.SITE_NAME || 'CodeWithPratik';

    if (!API_KEY) return res.status(500).json({ error: "Missing API Key" });

    const { message, ai_name, project_context, history } = req.body || {};
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Prepare Prompt
    const systemPrompt = `You are ${ai_name || 'Nova'}. Helpful coding assistant.
    CONTEXT: ${project_context ? project_context.slice(0, 2000) : 'No context.'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history.slice(-4) : []), // Kam history bhejo (Faster)
      { role: 'user', content: message }
    ];

    // CALL MISTRAL 7B (Most Reliable Free Model)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free', 
        messages: messages,
        stream: true,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: `Provider Error: ${err}` });
    }

    // Stream Response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
    res.end();

  } catch (error) {
    console.error("Crash:", error);
    return res.status(500).json({ error: "Server Crash", details: error.message });
  }
}
