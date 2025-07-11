"use client";

import React, { useEffect, useRef, useState } from "react";

// Declare global for TS compatibility
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const images = ["/Image.jpg", "/Image2.jpg"];

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const recognitionRef = useRef<any>(null);
  const [running, setRunning] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("en-IN");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startSpeechRecognition = () => {
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window)
    ) {
      alert("Speech Recognition not supported. Use Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = transcript;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const current = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += current + " ";
        } else {
          interim += current;
        }
      }

      setTranscript(final + interim);
    };

    recognition.onerror = (event: any) => {
      console.error("Recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current && recognitionRef.current.stop();
    recognitionRef.current = null;
  };

  const startAudioVisualization = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);

        source.connect(analyser);
        analyser.fftSize = 64;

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "lime";
          const barWidth = canvas.width / bufferLength;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];
            ctx.fillRect(
              i * barWidth,
              canvas.height - barHeight,
              barWidth - 1,
              barHeight
            );
          }
        };

        draw();
      })
      .catch((err) => console.error("Microphone access denied:", err));
  };

  const toggleVoice = () => {
    if (!running) {
      startSpeechRecognition();
      startAudioVisualization();
    } else {
      stopSpeechRecognition();
      audioCtxRef.current && audioCtxRef.current.close();
    }
    setRunning(!running);
  };

  const printText = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow?.document.write("<pre>" + transcript + "</pre>");
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* Responsive Fullscreen Image Slider */}
      {/* Full-Width Slider */}
      <div className="relative w-screen h-[90vh] overflow-hidden">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ${
              idx === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      {/* Animated Zooming Logo */}
      <div className="w-full bg-white py-8 flex justify-center">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-28 h-28 object-contain animate-pulse"
          style={{
            animation: "zoomInOut 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Voice Typing Section */}
      <section className="py-16 px-5 bg-gray-50 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-xl shadow-md border border-gray-200 text-center transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            🎤 Start Typing by Voice
          </h2>
          <div className="mb-6">
            <label htmlFor="languageSelect" className="mr-2 text-gray-600">
              Choose Language:
            </label>
            <select
              id="languageSelect"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi</option>
              <option value="mr-IN">Marathi</option>
            </select>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={toggleVoice}
              className="px-6 py-3 bg-gradient-to-r from-green-300 to-blue-400 text-white font-semibold rounded-full shadow hover:scale-105 transition-all"
            >
              {running ? "⛔ Stop Talking" : "🎙️ Start Talking"}
            </button>
            <button
              onClick={printText}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-green-300 text-white font-semibold rounded-full shadow hover:scale-105 transition-all"
            >
              🖨️ Print
            </button>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your speech will appear here..."
            className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y mb-6 shadow-inner"
          ></textarea>
          <canvas
            ref={canvasRef}
            width="300"
            height="100"
            className="mx-auto rounded-md bg-black"
          ></canvas>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center my-6">
        <button
          onClick={() => alert("More information coming soon...")}
          className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-full shadow hover:scale-105 transition-all"
        >
          More Info
        </button>
      </div>

      {/* Custom CSS for Zoom Animation */}
      <style jsx global>{`
        @keyframes zoomInOut {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </main>
  );
}
