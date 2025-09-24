"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen pt-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col items-start mt-16 md:mt-32 transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Welcome to my little corner
          </h2>
          <p className="text-base md:text-lg max-w-md md:max-w-xl leading-7 mb-8">
            My name is Haytham Chhilif and I am a self-taught Web Developer
            riding the ever-lasting journey towards mastering the craft. My
            passions are learning new things and supporting your business with
            simple, efficient, and creative tech solutions{" "}
            <span className="inline-block w-[3px] h-5 bg-primary animate-blink"></span>
          </p>
          <Button size="lg" className="text-base" onClick={scrollToContact}>
            Contact me here
          </Button>
        </div>
      </div>

      {/* Responsive animated blobs */}
      <div
        className="absolute mix-blend-multiply opacity-70 filter blur-xl 
                      top-1/4 bg-black rounded-full 
                      w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80
                      right-[5%] sm:right-[8%] md:right-[20%] 
                      animate-blob"
      ></div>

      <div
        className="absolute mix-blend-multiply opacity-70 filter blur-xl 
                      top-1/3 bg-gray-800 rounded-full 
                      w-40 h-40 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-80 lg:h-80
                      right-[2%] sm:right-[3%] md:right-[5%] 
                      animate-blob animation-delay-2000"
      ></div>

      <div
        className="absolute mix-blend-multiply opacity-70 filter blur-xl 
                      top-1/5 bg-slate-800 rounded-full 
                      w-44 h-44 sm:w-52 sm:h-52 md:w-72 md:h-72 lg:w-80 lg:h-80
                      right-[8%] sm:right-[12%] md:right-[15%] 
                      animate-blob animation-delay-4000"
      ></div>
    </section>
  );
}
