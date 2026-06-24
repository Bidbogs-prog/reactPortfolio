import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import { Seo, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/components/seo";
import { socials } from "@/data/socials";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Full-Stack & AI Engineer",
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  sameAs: socials.map((s) => s.href),
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function HomePage() {
  return (
    <>
      <Seo
        title="Haytham Chhilif — Full-Stack & AI Engineer"
        path="/"
        jsonLd={[personLd, websiteLd]}
      />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
