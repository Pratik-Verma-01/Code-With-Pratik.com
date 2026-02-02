export const config = {
  runtime: 'edge', // Fast & No Timeout
};

export default async function handler(req) {
  // CORS
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
      return new Response(JSON.stringify({ error: "Missing HUGGING_FACE_TOKEN" }), { status: 500 });
    }

    // Mistral-7B (Best Free Model on Hugging Face)
    const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

    const prompt = `<s>[INST] You are a helpful AI Coding Assistant.
    CONTEXT: ${context || 'No context.'}
    
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
          max_new_tokens: 1000,
          return_full_text: false,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: "HF API Error", details: err }), { status: 500 });
    }

    // Hugging Face JSON return karta hai (Stream nahi hota free tier mein usually)
    const result = await response.json();
    const reply = result[0]?.generated_text || "No response generated.";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
