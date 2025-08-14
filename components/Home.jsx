"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Slider from "react-slick";

export default function Home() {
  const router = useRouter();

  const sliderImages = [
    "/Image.jpg", // Replace with your actual images
    "/Image2.jpg",
    "/Image3.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="w-full font-sans">
      {/* HEADER with logo only */}
      <header className="bg-white p-2 flex justify-center items-center shadow">
        <img src="/logo.jpg" alt="Logo" className="h-16 object-contain" />
      </header>

      {/* IMAGE SLIDER SECTION */}
      <div className="w-full">
        <Slider {...settings}>
          {sliderImages.map((src, index) => (
            <div key={index}>
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* ABOUT US SECTION */}
      <section className="bg-gray-100 text-center px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-8">
          At TalknType, we believe in the power of seamless communication. Our
          platform is designed to convert your speech into accurate, real-time
          text—effortlessly and intelligently. Whether you're a professional,
          student, creator, or anyone in need of quick transcription, TalknType
          makes voice input easy, efficient, and accessible.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/learn")}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Speech to Text
          </button>
          <button
            onClick={() => window.open("https://wa.me/919823599197", "_blank")}
            className="bg-white border border-black text-black px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
