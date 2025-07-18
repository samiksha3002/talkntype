// ✅ Correct import
import { translate } from "@vitalets/google-translate-api";

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, to } = body;

    const res = await translate(text, { to: to || "hi" }); // default to Hindi

    return new Response(JSON.stringify({ translated: res.text }), {
      status: 200,
    });
  } catch (err) {
    console.error("Translation error:", err);
    return new Response(JSON.stringify({ error: "Translation failed" }), {
      status: 500,
    });
  }
}
