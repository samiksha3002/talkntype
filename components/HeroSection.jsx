"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  const [editorContent, setEditorContent] = useState("");
  const [speechLang, setSpeechLang] = useState("en-IN");
  const [translateLang, setTranslateLang] = useState("hi");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [enableTranslit, setEnableTranslit] = useState(false);
  const [translitText, setTranslitText] = useState("");
  const lastTranscriptRef = useRef("");

  const handleSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert("Speech Recognition is not supported in this browser.");

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const result = event.results[event.resultIndex];
        if (!result.isFinal) return;

        let transcript = result[0].transcript.trim();

        transcript = transcript
          .replace(/\bfull stop\b/gi, ".")
          .replace(/\bcomma\b/gi, ",")
          .replace(/\bquestion mark\b/gi, "?")
          .replace(/\bexclamation mark\b/gi, "!")
          .replace(/\bnew line\b/gi, "<br>")
          .replace(/\bnext paragraph\b/gi, "<br><br>")
          .replace(/\bcolon\b/gi, ":")
          .replace(/\bsemicolon\b/gi, ";");

        // avoid re-appending duplicate full transcripts
        if (transcript !== lastTranscriptRef.current) {
          setEditorContent((prev) => prev + transcript + " ");
          lastTranscriptRef.current = transcript;
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognitionRef.current.onend = () => {
        if (listening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn("Restart error:", e);
          }
        }
      };
    }

    recognitionRef.current.lang = speechLang;

    if (!listening) {
      lastTranscriptRef.current = "";
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editorContent, to: translateLang }),
      });
      const data = await res.json();
      if (data.translated) setTranslated(data.translated);
    } catch (err) {
      alert("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    alert("Copied!");
  };

  const handlePrint = () => {
    const printWindow = window.open();
    printWindow.document.write(`<pre>${editorContent}</pre>`);
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([editorContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "content.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleTransliterate = (e) => {
    const input = e.target.value;
    setTranslitText(input);
    const translit = enableTranslit ? input.replace(/a/g, "अ") : input;
    setEditorContent(translit);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4 justify-start sm:justify-between">
        <button
          onClick={handleCopy}
          className="px-3 py-1 border rounded text-sm font-medium border-gray-400"
        >
          Copy
        </button>
        <button
          onClick={handlePrint}
          className="px-3 py-1 border rounded text-sm font-medium border-gray-400"
        >
          Print
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1 border rounded text-sm font-medium border-gray-400"
        >
          Download
        </button>
        <button
          onClick={() => setEditorContent("")}
          className="px-3 py-1 border rounded text-sm font-medium bg-red-500 text-white"
        >
          Clear
        </button>
      </div>

      <ReactQuill
        theme="snow"
        value={editorContent}
        onChange={setEditorContent}
        className="mb-6 bg-white"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
            onClick={handleSpeech}
            className={`w-full ${
              listening ? "bg-red-500" : "bg-blue-600"
            } text-white py-1 rounded`}
          >
            {listening ? "🛑 Stop Listening" : "🎤 Start Listening"}
          </button>
        </div>

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
            className="w-full border py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? "Translating..." : "🔁 Translate"}
          </button>
          {translated && (
            <div className="mt-3 p-2 bg-gray-100 rounded text-sm text-gray-800">
              <strong className="text-gray-600 block mb-1">
                Translated Output:
              </strong>
              {translated}
            </div>
          )}
        </div>

        <div className="border rounded-md p-3 bg-white col-span-1">
          <h3 className="font-semibold mb-2">TRANSLITERATE</h3>
          <label className="block mb-1 text-gray-600">
            Transliterate From English To
          </label>
          <select
            className="w-full border p-1 rounded mb-2"
            value="hi"
            disabled
          >
            <option value="hi">Hindi</option>
          </select>
          <label className="inline-flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={enableTranslit}
              onChange={() => setEnableTranslit(!enableTranslit)}
            />
            <span className="text-sm text-gray-700">
              Enable Transliteration
            </span>
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Type in English"
            value={translitText}
            onChange={handleTransliterate}
          />
        </div>

        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-semibold mb-2">FONT CONVERSION</h3>
          {"To KrutiDev|To Preeti|To Shree|To Shivaji"
            .split("|")
            .map((btn, i) => (
              <button key={i} className="border w-full py-1 mb-2 rounded">
                {btn}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
