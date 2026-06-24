export interface Contribution {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: string[];
}

/** Sites I've helped build or contributed to (client & collaboration work). */
export const contributions: Contribution[] = [
  {
    id: "monarque",
    name: "Monarque",
    description:
      "A luxury hospitality supplier in Riyadh — curated equipment, linens, and amenities for high-end hotels, restaurants, and residences.",
    url: "https://www.monarquesa.com/",
    tags: ["Hospitality", "E-commerce"],
  },
  {
    id: "capteori",
    name: "Capteori",
    description:
      "An IT & AI studio building custom digital infrastructure and enterprise software across education, healthcare, and commerce.",
    url: "https://capteori.com/",
    tags: ["IT & AI", "Enterprise"],
  },
  {
    id: "entervio",
    name: "Entervio",
    description:
      "An AI career copilot for job seekers — adaptive interview simulations, résumé generation, and smart job matching.",
    url: "https://entervio.fr/fr",
    tags: ["AI", "Careers"],
  },
];
