import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import ContributionsSection from "@/components/contributions-section";
import FaqSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import {
  Seo,
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_DESCRIPTION,
} from "@/components/seo";
import { socials } from "@/data/socials";
import { faq } from "@/data/faq";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Full-Stack & AI Engineer",
  description: DEFAULT_DESCRIPTION,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  nationality: "Moroccan",
  address: { "@type": "PostalAddress", addressCountry: "MA" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Mohamed Ben Abdellah University",
  },
  worksFor: { "@type": "Organization", name: "The Olive Writers" },
  knowsAbout: [
    "Full-stack development",
    "Artificial intelligence",
    "Large language models",
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Web design",
  ],
  sameAs: socials.map((s) => s.href),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Seo
        title="Haytham Chhilif — Full-Stack & AI Engineer"
        path="/"
        jsonLd={[personLd, websiteLd, faqLd]}
      />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContributionsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
