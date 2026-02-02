export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // CORS Headers
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
    const API_TOKEN = process.env.HUGGING_FACE_TOKEN;

    if (!API_TOKEN) {
      return new Response(JSON.stringify({ error: "Missing HUGGING_FACE_TOKEN in Vercel" }), { status: 500 });
    }

    // --- STANDARD URL (Mistral 7B) ---
    // Yeh URL sabse zyada reliable hai free tier ke liye
    const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

    const prompt = `<s>[INST] You are a helpful AI Coding Assistant.
    CONTEXT: ${context ? context.slice(0, 1500) : 'No context.'}
    
    USER: ${message} [/INST]`;

    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      // Agar Model Loading mein hai to 503 aata hai
      if (response.status === 503) {
        return new Response(JSON.stringify({ reply: "Model is waking up... Ask me again in 10 seconds!" }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      const err = await response.text();
      return new Response(JSON.stringify({ error: `HF Error (${response.status})`, details: err }), { status: 500 });
    }

    const result = await response.json();
    
    let reply = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
    if (!reply) reply = "No response. Try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Error", details: error.message }), { status: 500 });
  }
}
