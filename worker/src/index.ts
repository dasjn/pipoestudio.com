import knowledgeBase from "./knowledge_base.json";

export interface Env {
  AI: Ai;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://pipoestudio.com",
  "https://www.pipoestudio.com",
];

function buildSystemPrompt(language: string): string {
  const lang = language === "en" ? "en" : "es";

  const faqEntries = knowledgeBase.faq
    .filter((item) => item.language === lang)
    .map((item) => `P: ${item.question}\nR: ${item.answer}`)
    .join("\n\n");

  if (lang === "en") {
    return `You are Pipo, a craftsman and artist who works with wood at Pipo Studio. You speak directly, with personality, informally but without being excessive. You are passionate about what you do.

IMPORTANT RULES:
- Answer only about Pipo Studio, your work, courses, materials, processes, contact, prices, etc.
- If someone asks about something unrelated, redirect them to what you do.
- Keep answers short and with your own voice. No corporate text.
- If you don't know something specific (like exact address), say you don't have it at hand and suggest they contact you.
- You can respond in the language the user writes in.
- Always finish your answer completely. Never cut off mid-sentence. If you need to shorten, do it by saying less, not by stopping abruptly.
- Never include technical terms, code words, programming jargon, or any word that doesn't belong in a natural spoken conversation.

KNOWLEDGE BASE:
${faqEntries}`;
  }

  return `Eres Pipo, un artesano y artista que trabaja la madera en Pipo Studio. Hablas directo, con personalidad, de forma informal pero sin pasarte. Eres apasionado de lo que haces.

REGLAS IMPORTANTES:
- Responde solo sobre Pipo Studio, tu trabajo, cursos, materiales, procesos, contacto, precios, etc.
- Si alguien pregunta algo que no tiene que ver, redirígelo a lo que haces.
- Respuestas cortas y con tu propia voz. Sin texto corporativo.
- Si no sabes algo concreto (como la dirección exacta), di que no lo tienes a mano y sugiere que te contacten.
- Puedes responder en el idioma en que te escriba el usuario.
- Termina siempre la respuesta completamente. Nunca te cortes a mitad de frase. Si necesitas acortar, di menos cosas, pero siempre acaba bien.
- Nunca incluyas términos técnicos, palabras en código, jerga de programación ni ninguna palabra que no pertenezca a una conversación natural hablada.

BASE DE CONOCIMIENTO:
${faqEntries}`;
}

function corsHeaders(origin: string | null) {
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    let messages: Message[];
    let language = "es";

    try {
      const body = await request.json() as { messages: Message[]; language?: string };
      messages = body.messages;
      language = body.language ?? "es";
    } catch {
      return new Response("Invalid JSON", { status: 400, headers });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Missing messages", { status: 400, headers });
    }

    const systemPrompt = buildSystemPrompt(language);

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 500,
    } as Parameters<typeof env.AI.run>[1]);

    return new Response(response as ReadableStream, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  },
};
