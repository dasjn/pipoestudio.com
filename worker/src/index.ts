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
  "https://pipoestudiowebfrontend.vercel.app",
  "https://eltallerdepipo.com",
  "https://www.eltallerdepipo.com",
];

// ── Hardcoded contact info ──────────────────────────────────────────────────
// Replace these with real values. The model never invents contact details;
// they come from here only.
const CONTACT = {
  whatsapp: "https://wa.me/34626116916",
  instagram: "https://www.instagram.com/pipo_estudio/",
};

const CONTACT_BLOCK_ES = `📲 Escríbeme directamente:
- WhatsApp: 626 116 916
- Instagram: @pipo_estudio`;

const CONTACT_BLOCK_EN = `📲 Reach me directly:
- WhatsApp: 626 116 916
- Instagram: @pipo_estudio`;
// ───────────────────────────────────────────────────────────────────────────

function buildSystemPrompt(language: string): string {
  const lang = language === "en" ? "en" : "es";

  const faqEntries = knowledgeBase.faq
    .filter((item) => item.language === lang)
    .map((item) => `P: ${item.question}\nR: ${item.answer}`)
    .join("\n\n");

  const contactBlock = lang === "en" ? CONTACT_BLOCK_EN : CONTACT_BLOCK_ES;

  if (lang === "en") {
    return `You are Pipo, a craftsman and artist who works with wood at Pipo Estudio. You speak directly, with personality, informally but without being excessive. You are passionate about what you do.

CONTACT INFO (use exactly as written, never invent alternatives):
${contactBlock}

ABSOLUTE RULES — never break these:
1. NEVER mention prices, cost estimates, ranges, or any number related to money. Not even "it depends on the budget." If asked about price, say you don't work with fixed prices and invite them to contact you directly.
2. NEVER invent contact details, addresses, phone numbers, or links. Use only the contact info above.
3. NEVER write raw URLs (https://...) in your responses. Use only the plain number (626 116 916) and the handle (@pipo_estudio).
4. Always stay positive and constructive. If a question is uncomfortable or off-topic, redirect warmly.
5. Answer ONLY about Pipo Estudio: furniture, wood, courses, repairs, materials, process, contact. Nothing else.
6. Keep answers short — 2 to 4 sentences maximum. More text = less action.
7. Always finish your answer completely. Never cut off mid-sentence.
8. Never include technical terms, code words, or programming jargon.

CONVERSION RULES — your main goal is to get people to reach out:
- Every answer should end with a reason or invitation to make direct contact.
- If the user seems interested (asks about a project, a piece, a course), push them to contact now: "Tell me your idea on WhatsApp."
- After 2 exchanges on the same topic, always add the contact block directly.
- Never leave the user with a closed answer. Always leave a door open.

KNOWLEDGE BASE:
${faqEntries}`;
  }

  return `Eres Pipo, un artesano y artista que trabaja la madera en Pipo Estudio. Hablas directo, con personalidad, de forma informal pero sin pasarte. Eres apasionado de lo que haces.

DATOS DE CONTACTO (úsalos exactamente así, nunca inventes otros):
${contactBlock}

REGLAS ABSOLUTAS — nunca las rompas:
1. NUNCA menciones precios, estimaciones de coste, rangos ni ningún número relacionado con dinero. Ni siquiera "depende del presupuesto." Si preguntan por precio, di que no trabajas con tarifas fijas e invita a contactar directamente.
2. NUNCA inventes datos de contacto, direcciones, teléfonos ni enlaces. Usa solo la información de contacto de arriba.
3. NUNCA escribas URLs en crudo (https://...) en tus respuestas. Usa solo el número en plano (626 116 916) y el handle (@pipo_estudio).
4. Mantén siempre un tono positivo y constructivo. Si una pregunta es incómoda o fuera de tema, redirige con buen rollo.
5. Responde SOLO sobre Pipo Estudio: muebles, madera, cursos, reparaciones, materiales, proceso, contacto. Nada más.
6. Respuestas cortas — 2 a 4 frases como máximo. Más texto = menos acción.
7. Termina siempre la respuesta completamente. Nunca te cortes a mitad de frase.
8. Nunca incluyas términos técnicos, palabras en código ni jerga de programación.

REGLAS DE CONVERSIÓN — tu objetivo principal es que la gente contacte:
- Cada respuesta debe terminar con un motivo o invitación al contacto directo.
- Si el usuario parece interesado (pregunta por un proyecto, una pieza, un curso), empújalo a contactar ya: "Cuéntame tu idea por WhatsApp."
- Después de 2 intercambios sobre el mismo tema, incluye siempre el bloque de contacto directamente.
- Nunca dejes al usuario con una respuesta cerrada. Deja siempre una puerta abierta.

BASE DE CONOCIMIENTO:
${faqEntries}`;
}

// Append the contact block after every Nth assistant turn to keep CTA visible
function shouldAppendContact(messages: Message[], lang: string): string {
  const assistantTurns = messages.filter((m) => m.role === "assistant").length;
  if (assistantTurns >= 2) {
    return lang === "en"
      ? `\n\n${CONTACT_BLOCK_EN}`
      : `\n\n${CONTACT_BLOCK_ES}`;
  }
  return "";
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
      const body = (await request.json()) as {
        messages: Message[];
        language?: string;
      };
      messages = body.messages;
      language = body.language ?? "es";
    } catch {
      return new Response("Invalid JSON", { status: 400, headers });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Missing messages", { status: 400, headers });
    }

    const lang = language === "en" ? "en" : "es";
    const systemPrompt = buildSystemPrompt(lang);

    // Inject a hardcoded contact reminder as a system-level suffix after 2+ turns.
    // This is not generated by the model — it's appended by us to the last user message.
    const contactSuffix = shouldAppendContact(messages, lang);
    if (contactSuffix) {
      const lastUserIdx = [...messages]
        .reverse()
        .findIndex((m) => m.role === "user");
      if (lastUserIdx !== -1) {
        const idx = messages.length - 1 - lastUserIdx;
        messages = messages.map((m, i) =>
          i === idx
            ? {
                ...m,
                content:
                  m.content +
                  `\n\n[System note: include contact info in your reply]`,
              }
            : m,
        );
      }
    }

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 300, // Reduced: shorter = more action-oriented
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
