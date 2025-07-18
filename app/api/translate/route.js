// app/api/translate/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, to } = body;

    if (!text || !to) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Example using Google Translate API via fetch (can change as per your API)
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();

    const translatedText = data[0]?.map((item) => item[0]).join("");

    return NextResponse.json({ translated: translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
