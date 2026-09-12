import type React from "react";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SectionFrame } from "@/components/section-frame";
import { InkFluid } from "@/components/ink/ink-fluid";
import { InkLines } from "@/components/ink/ink-lines";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
import { useMotionTier } from "@/lib/motion/tier";
import { socials } from "@/data/socials";
import { useRegister } from "@/lib/register";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = { type: "success" | "error" | null; message: string };

const initialForm = { name: "", email: "", message: "" };

/**
 * A boxless field: label, control, and an underline path that inks in
 * from the left when the field is focused.
 */
function InkField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="ink-field group relative">
      <label
        htmlFor={id}
        className="mb-1 block font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-focus-within:text-primary"
      >
        {label}
      </label>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 8"
        preserveAspectRatio="none"
        className="ink-underline pointer-events-none absolute bottom-0 left-0 h-2 w-full overflow-visible"
      >
        <path
          className="ink-underline-base"
          d="M0 4 Q250 2 500 4 T1000 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="ink-underline-ink"
          d="M0 4 Q250 6 500 4 T1000 4"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const fieldClass =
  "block w-full bg-transparent px-0 py-2.5 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none md:text-lg";

export default function ContactSection() {
  const { register } = useRegister();
  const tier = useMotionTier();
  const poet = register === "poet";
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<Status>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const burstRef = useRef<HTMLSpanElement>(null);
  const leftRef = useInkReveal<HTMLDivElement>({ stagger: 0.1 });
  const formRef = useInkReveal<HTMLFormElement>({ stagger: 0.08, delay: 0.15 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Ink splat burst from the submit button on success. */
  const burst = async () => {
    const host = burstRef.current;
    if (!host || tier === "off") return;
    const n = 14;
    const dots = Array.from({ length: n }, () => {
      const d = document.createElement("i");
      d.className = "ink-splat";
      host.appendChild(d);
      return d;
    });
    if (tier === "full") {
      const { gsap } = await import("@/lib/motion/gsap");
      gsap.fromTo(
        dots,
        { x: 0, y: 0, scale: 0.4, opacity: 1 },
        {
          x: () => (Math.random() - 0.5) * 260,
          y: () => -40 - Math.random() * 160,
          scale: () => 0.6 + Math.random() * 1.6,
          opacity: 0,
          duration: poet ? 1.6 : 0.9,
          ease: poet ? "power2.out" : "expo.out",
          stagger: 0.012,
          onComplete: () => dots.forEach((d) => d.remove()),
        }
      );
    } else {
      dots.forEach((d, i) => {
        d.style.setProperty("--dx", `${(Math.random() - 0.5) * 220}px`);
        d.style.setProperty("--dy", `${-40 - Math.random() * 140}px`);
        d.style.animationDelay = `${i * 12}ms`;
        d.classList.add("is-live");
      });
      window.setTimeout(() => dots.forEach((d) => d.remove()), 1400);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
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
      void burst();
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
    <SectionFrame
      id="contact"
      num={poet ? "03" : "04"}
      eyebrow="Contact"
      title={poet ? "Write to me" : "Let's *build* something"}
      note={poet ? "letters answered within a day or two" : "replies within a day or two"}
      className="overflow-hidden"
    >
      {/* A pool of ink at the bottom of the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] [mask-image:linear-gradient(to_top,black_30%,transparent)]"
      >
        <InkFluid
          className="absolute inset-0 h-full w-full"
          intensity={0.55}
          quality="low"
          firstDrop={{ x: 0.7, y: 0.75 }}
        />
      </div>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        {/* Left: pitch + info */}
        <div ref={leftRef} className="space-y-8 lg:col-span-5">
          <InkLines className="max-w-md text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            {poet
              ? "A poem you liked, a story you want edited, or just a hello. My inbox is open, and I answer everything."
              : "Have a product in mind, a rough idea, or a role you think I'd fit? My inbox is always open, I'll get back to you within a day or two."}
          </InkLines>

          <div className="space-y-4">
            <a
              href="mailto:haythamchhilif@gmail.com"
              className="group flex items-center gap-4 text-foreground"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25 transition-colors group-hover:border-primary group-hover:text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <span className="ink-underline-link transition-colors group-hover:text-primary">
                haythamchhilif@gmail.com
              </span>
            </a>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25">
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-9 lg:col-span-6 lg:col-start-7"
        >
          <InkField id="name" label="Name">
            <input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className={fieldClass}
            />
          </InkField>
          <InkField id="email" label="Email">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={fieldClass}
            />
          </InkField>
          <InkField id="message" label="Message">
            <textarea
              id="message"
              name="message"
              placeholder={poet ? "Say what you came to say…" : "Tell me about your project…"}
              className={cn(fieldClass, "min-h-[140px] resize-y")}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </InkField>

          <div className="relative">
            <span ref={burstRef} aria-hidden="true" className="ink-burst" />
            <Button
              type="submit"
              size="lg"
              className="group h-13 w-full rounded-full py-6 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Sending...
                </>
              ) : (
                <>
                  {poet ? "Send the letter" : "Send message"}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </div>

          {status.type && (
            <p
              role="status"
              className={cn(
                "flex items-center gap-2 font-mono text-sm",
                status.type === "success" ? "text-primary" : "text-destructive"
              )}
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
      </div>
    </SectionFrame>
  );
}
