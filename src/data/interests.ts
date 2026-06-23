export interface InterestSubgroup {
  label: string;
  items: string[];
}

export interface InterestGroup {
  label: string;
  /** Flat list of chips, or split into labelled subgroups (e.g. Literature). */
  items?: string[];
  subgroups?: InterestSubgroup[];
}

export const interestGroups: InterestGroup[] = [
  {
    label: "Literature",
    subgroups: [
      {
        label: "Authors",
        items: ["Albert Camus", "Haruki Murakami", "Leo Tolstoy"],
      },
      {
        label: "Books",
        items: [
          "The Stranger",
          "The Myth of Sisyphus",
          "Norwegian Wood",
          "After Dark",
          "War and Peace",
          "Chibi Neko Kitchen",
        ],
      },
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
