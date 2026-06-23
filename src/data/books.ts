export interface Book {
  id: string;
  title: string;
  year: string;
  role: string;
  publisher: string;
  description: string;
}

/**
 * Published anthologies Haytham edited the English edition of, for the cultural
 * NGO The Olive Writers. All are bilingual (English / Arabic) short-story
 * collections.
 */
export const books: Book[] = [
  {
    id: "maps-of-the-past",
    title: "Maps of the Past",
    year: "2025",
    role: "Editor — English edition",
    publisher: "The Olive Writers",
    description:
      "A bilingual (English / Arabic) anthology of short stories tracing memory, place, and the maps we carry of who we were.",
  },
  {
    id: "women-writing-our-lives",
    title: "Women Writing Our Lives",
    year: "2024",
    role: "Editor — English edition",
    publisher: "The Olive Writers",
    description:
      "A bilingual collection of short stories giving voice to women's lives, told in their own words across English and Arabic.",
  },
  {
    id: "life-in-the-temporary",
    title: "Life in the Temporary",
    year: "2023",
    role: "Editor — English edition",
    publisher: "The Olive Writers",
    description:
      "A bilingual anthology of short stories on impermanence — the provisional, in-between spaces where so much of life is actually lived.",
  },
];
