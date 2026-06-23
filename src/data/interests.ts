export interface InterestGroup {
  label: string;
  items: string[];
}

export const interestGroups: InterestGroup[] = [
  {
    label: "Literature",
    items: [
      "Albert Camus",
      "Haruki Murakami",
      "Leo Tolstoy",
      "The Stranger",
      "Norwegian Wood",
      "Chibi Neko Kitchen",
    ],
  },
  {
    label: "Anime",
    items: [
      "Frieren",
      "Re:Zero",
      "Chainsaw Man",
      "Kingdom",
      "Haikyuu",
      "My Hero Academia",
    ],
  },
  {
    label: "Gaming",
    items: [
      "Souls & soulslikes",
      "Hunt: Showdown",
      "Albion Online",
      "Baldur's Gate 3",
      "Half-Life",
      "Resident Evil",
      "Hollow Knight",
    ],
  },
  {
    label: "Training",
    items: ["Bodybuilding", "Endurance training"],
  },
];
