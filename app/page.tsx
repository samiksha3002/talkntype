"use client";

import Header from "../components/Header";

import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("Marathi");

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Toolbar */}

      <Header />
      <div className="flex flex-wrap gap-2 justify-start mb-4">
        {[
          "Content History",
          "Chat with AI",
          "Font Converter",
          "Copy",
          "Print",
          "Fix Grammar",
          "Expand Content",
          "Generate Draft",
          "Commands",
          "Clear",
        ].map((item, i) => (
          <button
            key={i}
            className="px-4 py-2 text-sm bg-white rounded shadow hover:bg-gray-200"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Rich Text Editor */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <div className="mb-2 flex items-center gap-3 text-sm">
          <select className="border px-2 py-1 rounded text-sm">
            <option>Sans Serif</option>
          </select>
          <select className="border px-2 py-1 rounded text-sm">
            <option>Normal</option>
          </select>
          <button className="font-bold">B</button>
          <button className="italic">I</button>
          <button className="underline">U</button>
          <button className="">S</button>
          {/* Add more styling buttons here */}
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here..."
          className="w-full border rounded px-3 py-2 text-lg focus:outline-none resize-none"
        />
      </div>

      {/* Bottom Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Speech Input */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🎙️ Speech Input</h3>
          <label className="block text-sm mb-1">Dictation Language</label>
          <select
            className="w-full border rounded px-2 py-1 mb-3"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>मराठी (Marathi)</option>
            <option>हिंदी (Hindi)</option>
            <option>English</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Start Listening
          </button>
        </div>

        {/* Translation */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🌐 Translation</h3>
          <label className="block text-sm mb-1">Translate Editor Text To</label>
          <select className="w-full border rounded px-2 py-1 mb-3">
            <option>Marathi</option>
            <option>Hindi</option>
            <option>English</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-purple-700">
            Translate
          </button>
        </div>

        {/* Transliterate */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🔤 Transliterate</h3>
          <label className="block text-sm mb-1">From English To</label>
          <select className="w-full border rounded px-2 py-1 mb-3">
            <option>Russian</option>
            <option>Arabic</option>
            <option>Devanagari</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-pink-700">
            Disable
          </button>
        </div>

        {/* Font Conversion */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🅰️ Font Conversion</h3>
          <div className="flex flex-wrap gap-2">
            {["To KrutiDev", "To Preeti", "To Shree", "To Shivaji"].map(
              (btn, i) => (
                <button
                  key={i}
                  className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  {btn}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
