export const config = {
  runtime: 'edge', // Fast & No Timeout
};

export default async function handler(req) {
  // 1. CORS Headers (Security)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { message, context } = await req.json();
    
    // Check API Key
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ 
        reply: "⚠️ System Error: API Key missing in Vercel settings." 
      }), { status: 200 }); // Status 200 bheja taaki frontend crash na ho
    }

    // 2. Prepare Prompt
    const systemPrompt = `You are a helpful AI Assistant.
    CONTEXT: ${context ? context.slice(0, 2000) : 'No context.'}`;

    // 3. Call OpenRouter (Google Gemini Free - Super Stable)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://code-with-pratik.vercel.app',
        'X-Title': 'CodeWithPratik',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // FREE & STABLE
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false // Simple JSON response (No stream issues)
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ 
        reply: `⚠️ AI Provider Error: ${response.status}. Please try again.` 
      }), { status: 200 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI.";

    // 4. Send Reply
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      reply: `⚠️ Internal Error: ${error.message}` 
    }), { status: 200 });
  }
}
