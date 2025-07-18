"use client";

import React, { useState, useRef } from "react";

const languages = [
  { name: "English (India)", code: "en-IN" },
  { name: "Hindi", code: "hi" },
  { name: "Marathi", code: "mr" },
  { name: "Bengali", code: "bn" },
  { name: "Gujarati", code: "gu" },
  { name: "Tamil", code: "ta" },
  { name: "Telugu", code: "te" },
  { name: "Kannada", code: "kn" },
  { name: "Malayalam", code: "ml" },
  { name: "Punjabi", code: "pa" },
  { name: "Urdu", code: "ur" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Chinese (Simplified)", code: "zh-CN" },
  { name: "Japanese", code: "ja" },
  { name: "Russian", code: "ru" },
  { name: "Arabic", code: "ar" },
];

const Hero = () => {
  const [text, setText] = useState("");
  const [interim, setInterim] = useState(""); // ✅ Moved inside component
  const [listening, setListening] = useState(false);
  const [translated, setTranslated] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-IN");
  const [translateLang, setTranslateLang] = useState("hi");
  const recognitionRef = useRef(null);
  const textAreaRef = useRef(null);
  const lastFinalRef = useRef(""); // Track last final transcript

  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.trim();

          if (event.results[i].isFinal) {
            if (transcript !== lastFinalRef.current) {
              setText((prev) => prev + transcript + " ");
              lastFinalRef.current = transcript;
            }
            setInterim(""); // Clear interim
          } else {
            interimTranscript += transcript;
          }
        }

        setInterim(interimTranscript); // Live update
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    }

    recognitionRef.current.lang = speechLang;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      setInterim("");
      lastFinalRef.current = ""; // Reset last transcript when stopping
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };
  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, to: translateLang }),
      });
      const data = await res.json();
      if (data.translated) {
        setTranslated(data.translated);
      }
    } catch (err) {
      console.error("Translation error", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const formatText = (tag) => {
    document.execCommand(tag, false, null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const handlePrint = () => {
    const printWindow = window.open();
    printWindow.document.write(`<pre>${text}</pre>`);
    printWindow.print();
  };

  const handleClear = () => {
    setText("");
    setTranslated("");
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "content.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-white max-w-screen-xl mx-auto">
      {/* Top Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-start sm:justify-between">
        <button
          onClick={handleCopy}
          className="px-3 py-1 border rounded-md text-sm font-medium border-gray-400"
        >
          Copy
        </button>
        <button
          onClick={handlePrint}
          className="px-3 py-1 border rounded-md text-sm font-medium border-gray-400"
        >
          Print
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1 border rounded-md text-sm font-medium border-gray-400"
        >
          Download
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1 border rounded-md text-sm font-medium bg-red-500 text-white"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="border rounded-md bg-white p-2 mb-4">
        <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-2">
          <div className="flex gap-1">
            <button
              onClick={() => formatText("bold")}
              className="border px-2 py-1 text-sm rounded font-bold"
            >
              B
            </button>
            <button
              onClick={() => formatText("italic")}
              className="border px-2 py-1 text-sm rounded font-bold italic"
            >
              I
            </button>
            <button
              onClick={() => formatText("underline")}
              className="border px-2 py-1 text-sm rounded font-bold underline"
            >
              U
            </button>
            <button
              onClick={() => formatText("strikeThrough")}
              className="border px-2 py-1 text-sm rounded font-bold line-through"
            >
              S
            </button>
          </div>
        </div>
        <div
          ref={textAreaRef}
          contentEditable
          suppressContentEditableWarning
          className="w-full min-h-[200px] outline-none text-gray-700 p-2 text-base border border-gray-300 rounded overflow-y-auto"
          onInput={(e) => setText(e.currentTarget.textContent)}
        >
          {text}
          <span className="text-gray-400">{interim}</span>
        </div>
      </div>

      {/* Bottom Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {/* Speech Input */}
        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-semibold mb-2">SPEECH INPUT</h3>
          <label className="block mb-1 text-gray-600">Dictation Language</label>
          <select
            className="w-full border p-1 rounded mb-2"
            value={speechLang}
            onChange={(e) => setSpeechLang(e.target.value)}
          >
            {languages.map((lang, i) => (
              <option key={i} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            className={`w-full ${
              listening ? "bg-red-500" : "bg-blue-600"
            } text-white py-1 rounded`}
            onClick={handleSpeech}
          >
            {listening ? "🛑 Stop Listening" : "🎤 Start Listening"}
          </button>
        </div>

        {/* Translation */}
        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-semibold mb-2">TRANSLATION</h3>
          <label className="block mb-1 text-gray-600">
            Translate Editor Text To
          </label>
          <select
            className="w-full border p-1 rounded mb-2"
            value={translateLang}
            onChange={(e) => setTranslateLang(e.target.value)}
          >
            {languages.map((lang, i) => (
              <option key={i} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            className="w-full border py-1 rounded"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? "Translating..." : "🔁 Translate"}
          </button>
          {translated && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
              <strong>Translated:</strong> {translated}
            </div>
          )}
        </div>

        {/* Transliteration */}
        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-semibold mb-2">TRANSLITERATE</h3>
          <label className="block mb-1 text-gray-600">
            Transliterate From English To
          </label>
          <select className="w-full border p-1 rounded mb-2">
            <option>Hindi</option>
          </select>
          <button className="w-full border py-1 rounded">Enable</button>
        </div>

        {/* Font Conversion */}
        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-semibold mb-2">FONT CONVERSION</h3>
          {["To KrutiDev", "To Preeti", "To Shree", "To Shivaji"].map(
            (btn, i) => (
              <button key={i} className="border w-full py-1 mb-2 rounded">
                {btn}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
