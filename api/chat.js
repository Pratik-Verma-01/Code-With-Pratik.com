export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // 1. CORS Headers
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
      return new Response(JSON.stringify({ error: "Server Config Error: Missing HUGGING_FACE_TOKEN" }), { status: 500 });
    }

    // --- FIX: UPDATED URL (router.huggingface.co) ---
    // Using Mistral-7B-Instruct-v0.2 which is very stable on free tier
    const MODEL_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2";

    const prompt = `<s>[INST] You are an expert Coding Assistant.
    CONTEXT: ${context ? context.slice(0, 2000) : 'No context.'}
    
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
          max_new_tokens: 500, // Thoda kam kiya taaki timeout na ho
          return_full_text: false,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: "HF API Error", details: err }), { status: 500 });
    }

    const result = await response.json();
    
    // Hugging Face kabhi Array deta hai kabhi Object, dono handle karein
    let reply = "";
    if (Array.isArray(result)) {
      reply = result[0]?.generated_text;
    } else {
      reply = result?.generated_text;
    }

    if (!reply) reply = "I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Error", details: error.message }), { status: 500 });
  }
}
