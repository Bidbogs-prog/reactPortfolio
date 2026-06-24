import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { socials } from "@/data/socials";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

type Status = { type: "success" | "error" | null; message: string };

const initialForm = { name: "", email: "", message: "" };

export default function ContactSection() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<Status>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    const endpoint = import.meta.env.VITE_DISCORD_URL as string | undefined;
    if (!endpoint) {
      setStatus({
        type: "error",
        message: "Contact form isn't configured. Email me directly instead.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // Try to surface a server-provided message; fall back gracefully.
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      setStatus({ type: "success", message: "Message sent, talk soon!" });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border/60 py-24 md:py-32">
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="container relative">
        <SectionHeading
          num="04"
          eyebrow="Contact"
          title="Let's build something"
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* Left: pitch + info */}
          <Reveal>
            <div className="space-y-8">
              <p className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                Have a product in mind, a rough idea, or a role you think I&apos;d
                fit? My inbox is always open, I&apos;ll get back to you within a
                day or two.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:haythamchhilif@gmail.com"
                  className="group flex items-center gap-4 text-foreground"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="transition-colors group-hover:text-primary">
                    haythamchhilif@gmail.com
                  </span>
                </a>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>Morocco, available for remote work</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={120}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm md:p-8"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  className="min-h-[140px] bg-background"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="group h-12 w-full font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>

              {status.type && (
                <p
                  role="status"
                  className={`flex items-center gap-2 text-sm ${
                    status.type === "success" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {status.message}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
