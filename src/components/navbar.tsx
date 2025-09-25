"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : ""
      }`}
    >
      <div
        id="logo"
        className="container mx-auto flex items-center justify-between py-4"
      >
        <img
          src="/favicon.ico"
          alt="Logo"
          className="h-10 w-auto hover:cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="link" onClick={() => scrollToSection("hero")}>
            About me
          </Button>
          <Button variant="link" onClick={() => scrollToSection("projects")}>
            Projects
          </Button>
          <Button variant="link" onClick={() => scrollToSection("contact")}>
            Contact
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-3 w-3" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              <Button variant="ghost" onClick={() => scrollToSection("hero")}>
                About me
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("projects")}
              >
                Projects
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
