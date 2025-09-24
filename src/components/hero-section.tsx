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
          className={`flex flex-col items-start mt-16 md:mt-32 transition-all duration-1000 relative z-10 ${
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Text with smart color mixing */}
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 
                         text-gray-900 
                         mix-blend-difference
                         transition-all duration-500"
          >
            Welcome to my little corner
          </h2>

          <p
            className="text-base md:text-lg max-w-md md:max-w-xl leading-7 mb-8 
                        text-gray-900 
                        mix-blend-difference
                        transition-all duration-500"
          >
            My name is Haytham Chhilif and I am a self-taught Web Developer
            riding the ever-lasting journey towards mastering the craft. My
            passions are learning new things and supporting your business with
            simple, efficient, and creative tech solutions{" "}
            <span className="inline-block w-[3px] h-5 bg-gray-900 animate-blink mix-blend-difference"></span>
          </p>

          {/* Button with backdrop for better visibility */}
          <div className="relative">
            <Button
              size="lg"
              className="text-base bg-primary text-white hover:bg-primary/90 
                         backdrop-blur-sm border border-white/20
                         shadow-lg hover:shadow-xl transition-all duration-300
                         relative z-20"
              onClick={scrollToContact}
            >
              Contact me here
            </Button>
          </div>
        </div>
      </div>

      {/* Responsive animated blobs - positioned behind text */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute mix-blend-multiply opacity-60 filter blur-xl 
                       top-1/4 bg-gray-800 rounded-full 
                       w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80
                       right-[5%] sm:right-[8%] md:right-[20%] 
                       animate-blob"
        ></div>

        <div
          className="absolute mix-blend-multiply opacity-60 filter blur-xl 
                       top-1/3 bg-slate-700 rounded-full 
                       w-40 h-40 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-80 lg:h-80
                       right-[2%] sm:right-[3%] md:right-[5%] 
                       animate-blob animation-delay-2000"
        ></div>

        <div
          className="absolute mix-blend-multiply opacity-60 filter blur-xl 
                       top-1/5 bg-gray-900 rounded-full 
                       w-44 h-44 sm:w-52 sm:h-52 md:w-72 md:h-72 lg:w-80 lg:h-80
                       right-[8%] sm:right-[12%] md:right-[15%] 
                       animate-blob animation-delay-4000"
        ></div>
      </div>

      {/* Custom animations using Tailwind's arbitrary values */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Enhanced mobile responsiveness */
        @media (max-width: 640px) {
          .animate-blob {
            animation-duration: 10s !important;
            opacity: 0.4 !important;
          }
        }
      `}</style>
    </section>
  );
}
