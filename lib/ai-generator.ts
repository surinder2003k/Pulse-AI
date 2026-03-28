// lib/ai-generator.ts

export async function generateContentWithFallback(prompt: string, temperature: number = 0.7): Promise<string> {
  const providers = [
    {
      name: "Groq (LLaMA-3)",
      execute: async () => {
        const key = process.env.GROQ_API_KEY;
        if (!key) throw new Error("Missing GROQ_API_KEY");
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature
          })
        });
        if (!res.ok) throw new Error(`Groq Error: ${await res.text()}`);
        const data = await res.json();
        return data.choices[0].message.content;
      }
    },
    {
      name: "OpenAI (GPT-4o-mini)",
      execute: async () => {
        const key = process.env.OPENAI_API_KEY;
        if (!key) throw new Error("Missing OPENAI_API_KEY");
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature
          })
        });
        if (!res.ok) throw new Error(`OpenAI Error: ${await res.text()}`);
        const data = await res.json();
        return data.choices[0].message.content;
      }
    },
    {
      name: "Gemini (2.0 Flash)",
      execute: async () => {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("Missing GEMINI_API_KEY");
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature, responseMimeType: "application/json" }
          })
        });
        if (!res.ok) throw new Error(`Gemini Error: ${await res.text()}`);
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      }
    },
    {
      name: "Together AI (Meta-Llama-3-70B)",
      execute: async () => {
        const key = process.env.TOGETHER_API_KEY;
        if (!key) throw new Error("Missing TOGETHER_API_KEY");
        const res = await fetch("https://api.together.xyz/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "meta-llama/Llama-3-70b-chat-hf",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature
          })
        });
        if (!res.ok) throw new Error(`Together AI Error: ${await res.text()}`);
        const data = await res.json();
        return data.choices[0].message.content;
      }
    }
  ];

  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`[AI Generator] Attempting with ${provider.name}...`);
      const result = await provider.execute();
      console.log(`[AI Generator] Success with ${provider.name}!`);
      return result;
    } catch (error: any) {
      console.warn(`[AI Generator] Failed with ${provider.name}: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(`All AI Providers failed. Last error: ${lastError?.message}`);
}
