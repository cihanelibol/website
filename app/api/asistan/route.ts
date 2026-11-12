import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { assistantContext, parseChatMessages } from "@/lib/assistant";
import { guardRate, InputError, limitedJson, sameOrigin } from "@/lib/security";

export const maxDuration = 30;
const headers = { "Cache-Control": "no-store" };
const unavailable = "Asistan şu anda yanıt veremiyor. Tekrar deneyebilir veya WhatsApp üzerinden ekibimize ulaşabilirsiniz.";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "İstek doğrulanamadı." }, { status: 403, headers });
  try {
    await guardRate("assistant", 10, 60);
    await guardRate("assistant-total", 300, 3600, "all");
  } catch (error) {
    return Response.json({ error: error instanceof InputError ? "Çok fazla mesaj gönderildi. Biraz bekleyip tekrar deneyin." : unavailable }, { status: error instanceof InputError ? 429 : 503, headers });
  }
  let messages;
  try {
    messages = parseChatMessages(await limitedJson(request, 40000));
  } catch {
    return Response.json({ error: "Mesajınızı kontrol edin. En fazla 1000 karakter yazabilir veya yeni bir sohbet başlatabilirsiniz." }, { status: 400, headers });
  }
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: unavailable }, { status: 503, headers });
  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const { system, sources } = assistantContext(messages);
    const result = await generateText({
      model: google(process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"),
      system,
      messages,
      maxOutputTokens: 2000,
      maxRetries: 0,
      abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(25000)]),
    });
    if (!result.text.trim() || result.text.length > 6000) throw new Error("Invalid assistant response");
    return Response.json({ text: result.text, sources }, { headers });
  } catch {
    // Provider errors can contain request details; never log prompts or credentials.
    console.error("assistant.generation_failed");
    return Response.json({ error: unavailable }, { status: 503, headers });
  }
}
