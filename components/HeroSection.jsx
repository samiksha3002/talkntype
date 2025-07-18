"use client";

import React, { useState, useRef } from "react";

const Hero = () => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setText((prev) => prev + transcript + " ");
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="p-4 bg-white">
      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["Content History", "Chat with AI", "Copy", "Print", "Clear"].map(
          (label, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 border rounded-md text-sm font-medium ${
                label === "Fix Grammar"
                  ? "bg-green-500 text-white"
                  : label === "Clear"
                  ? "bg-red-500 text-white"
                  : "border-gray-400"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Editor */}
      <div className="border rounded-md bg-white p-2 mb-4">
        <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-2">
          <select className="border px-2 py-1 text-sm rounded">
            <option>Sans Serif</option>
          </select>
          <select className="border px-2 py-1 text-sm rounded">
            <option>Normal</option>
          </select>
          <div className="flex gap-1">
            {["B", "I", "U", "S"].map((tool, i) => (
              <button
                key={i}
                className="border px-2 py-1 text-sm rounded font-bold"
              >
                {tool}
              </button>
            ))}
            <button className="border px-2 py-1 text-sm rounded">A</button>
            <button className="border px-2 py-1 text-sm rounded">🖌️</button>
            <button className="border px-2 py-1 text-sm rounded">x₂</button>
            <button className="border px-2 py-1 text-sm rounded">x²</button>
            <button className="border px-2 py-1 text-sm rounded">H₁</button>
            <button className="border px-2 py-1 text-sm rounded">H₂</button>
            <button className="border px-2 py-1 text-sm rounded">{"<>"}</button>
            <button className="border px-2 py-1 text-sm rounded">•••</button>
            <button className="border px-2 py-1 text-sm rounded">🔗</button>
            <button className="border px-2 py-1 text-sm rounded">𝑥</button>
          </div>
        </div>

        <textarea
          rows="10"
          className="w-full border-none outline-none text-gray-600 text-base placeholder:text-gray-400"
          placeholder="Start speaking or typing here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-4 gap-4 text-sm">
        {/* Speech Input */}
        <div className="border rounded-md p-3 bg-white">
          <h3 className="font-semibold mb-2">SPEECH INPUT</h3>
          <label className="block mb-1 text-gray-600">Dictation Language</label>
          <select
            className="w-full border p-1 rounded mb-2"
            defaultValue="English (India)"
          >
            <option>English (India)</option>
          </select>
          <button
            className={`w-full ${
              listening ? "bg-red-500" : "bg-purple-600"
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
          <select className="w-full border p-1 rounded mb-2">
            <option>English</option>
          </select>
          <button className="w-full border py-1 rounded">🔁 Translate</button>
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
