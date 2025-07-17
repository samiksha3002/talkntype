"use client";

import React, { useState } from "react";

const HeroSection = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("Marathi");

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 justify-start mb-4">
        {["🕘 History", "📋 Copy", "🖨 Print", "🧹 Clear"].map((item, i) => (
          <button
            key={i}
            className="px-4 py-2 text-sm bg-white rounded shadow hover:bg-gray-200 transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Text Editor */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <div className="mb-3 flex items-center flex-wrap gap-2 text-sm">
          <select className="border px-2 py-1 rounded">
            <option>Sans Serif</option>
            <option>Serif</option>
            <option>Monospace</option>
          </select>
          <select className="border px-2 py-1 rounded">
            <option>Normal</option>
            <option>Heading</option>
            <option>Subheading</option>
          </select>
          <button className="font-bold px-2 py-1 border rounded">B</button>
          <button className="italic px-2 py-1 border rounded">I</button>
          <button className="underline px-2 py-1 border rounded">U</button>
          <button className="line-through px-2 py-1 border rounded">S</button>
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here..."
          className="w-full border rounded px-3 py-2 text-lg focus:outline-none resize-none"
        />
      </div>

      {/* Bottom Grid Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Speech Input */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🎙️ Speech Input</h3>
          <label className="block text-sm mb-1">Select Language</label>
          <select
            className="w-full border rounded px-2 py-1 mb-3"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>मराठी (Marathi)</option>
            <option>हिंदी (Hindi)</option>
            <option>English</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Start Listening
          </button>
        </div>

        {/* Translation */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🌐 Translation</h3>
          <label className="block text-sm mb-1">Translate To</label>
          <select className="w-full border rounded px-2 py-1 mb-3">
            <option>Marathi</option>
            <option>Hindi</option>
            <option>English</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-purple-700 transition">
            Translate
          </button>
        </div>

        {/* Transliteration */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">🔤 Transliterate</h3>
          <label className="block text-sm mb-1">From English To</label>
          <select className="w-full border rounded px-2 py-1 mb-3">
            <option>Russian</option>
            <option>Arabic</option>
            <option>Devanagari</option>
          </select>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-pink-700 transition">
            Start Transliteration
          </button>
        </div>

        {/* Font Conversion */}
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-semibold mb-3">🅰 Font Conversion</h3>
          <div className="flex flex-wrap gap-2">
            {["To KrutiDev", "To Preeti", "To Shree", "To Shivaji"].map(
              (btn, i) => (
                <button
                  key={i}
                  className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm transition"
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
};

export default HeroSection;
