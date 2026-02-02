// Yeh line zaroori hai - Isse Vercel isko Fast Mode mein chalayega
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 1. Handle CORS (Security)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 2. Parse Body
    const body = await req.json();
    const { message, ai_name, project_context, history } = body;

    // 3. API Key Check
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'Server Error: Missing API Key' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Prepare Prompt
    const systemPrompt = `You are ${ai_name || 'Nova'}. Context: ${project_context ? project_context.slice(0, 1000) : 'None'}.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-4),
      { role: 'user', content: message }
    ];

    // 5. Call OpenRouter (Free Model)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://code-with-pratik.vercel.app',
        'X-Title': 'CodeWithPratik',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: 'Provider Error', details: err }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. Return Stream directly (Edge Runtime Magic)
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
