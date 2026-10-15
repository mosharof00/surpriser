export interface Trail {
  id: string;
  name: string;
  location: string;
  distance: string;
  elevation: string;
  duration: string;
  difficulty: "Moderate" | "Challenging" | "Scenic & Rewarding" | "Custom";
  tag: string;
  image: string;
  description: string;
  highlights: string[];
}

export const TRAILS: Trail[] = [
  {
    id: "valbona-theth",
    name: "Valbona to Theth Pass",
    location: "Accursed Mountains (Albanian Alps)",
    distance: "17 km",
    elevation: "1,795 m (Pass Peak)",
    duration: "6 - 7 hours",
    difficulty: "Scenic & Rewarding",
    tag: "Alpine Crown Jewel",
    image: "/images/albanian_alps.jpg",
    description:
      "The undisputed king of Balkan hikes. Towering limestone needles, lush glacial valleys, and the most dramatic alpine saddle in Northern Albania.",
    highlights: ["Panoramic Valbona Valley", "Old Stone Kafene on the pass", "Theth Waterfall"],
  },
  {
    id: "lake-bovilla",
    name: "Lake Bovilla Cliff Balcony",
    location: "Dajt National Park (Tirana / Krujë)",
    distance: "6.5 km",
    elevation: "420 m gain",
    duration: "3 - 4 hours",
    difficulty: "Moderate",
    tag: "Turquoise Canyon",
    image: "/images/bovilla_lake.jpg",
    description:
      "A stunning climb to the natural rock balcony towering directly over the glowing emerald-turquoise reservoir, flanked by sheer canyon walls.",
    highlights: ["Dramatic Rock Balcony", "Turquoise Waters", "Epic Ridge Photos"],
  },
  {
    id: "maja-e-cikes",
    name: "Maja e Çikës & Llogara Ridge",
    location: "Ceraunian Mountains (Llogara Pass, Vlorë)",
    distance: "12 km",
    elevation: "2,044 m Summit",
    duration: "5 - 6 hours",
    difficulty: "Challenging",
    tag: "Sea Meets The Clouds",
    image: "/images/llogara_pass.jpg",
    description:
      "High mountain ridges plunging directly down into the azure Ionian Sea and Albanian Riviera. Crisp maritime breeze with views stretching to Corfu.",
    highlights: ["360° Ionian Sea views", "Ancient Black Pines", "High Alpine Ridge"],
  },
  {
    id: "wildcard",
    name: "Mystery Summit (You Pick!)",
    location: "Anywhere in Albania",
    distance: "Your Call",
    elevation: "Sky High",
    duration: "Full Day Adventure",
    difficulty: "Custom",
    tag: "Wildcard Expedition",
    image: "/images/albanian_alps.jpg",
    description:
      "Got a secret trail or hidden Albanian ridge you've been dreaming of exploring? Pick this and dictate where the compass points!",
    highlights: ["100% Tailored to You", "Total Freedom", "Unexplored Peaks"],
  },
];

export const VIBES = [
  {
    id: "photo-scenic",
    title: "Scenic Ridges & Golden Hour",
    description: "Relaxed pace, stops at every viewpoint, taking tons of gorgeous mountain photos.",
    icon: "Camera",
  },
  {
    id: "summit-conquest",
    title: "Peak Conquest & Endurance",
    description: "Pushing our boots, breaking a good sweat, and earning the absolute highest peak.",
    icon: "Flame",
  },
  {
    id: "chill-picnic",
    title: "Alpine Picnic & Lake Breeze",
    description: "A mellow trek followed by good music, delicious food, and unwinding in nature.",
    icon: "Coffee",
  },
];

export const SNACKS = [
  {
    id: "byrek",
    title: "Warm Albanian Byrek & Yogurt",
    desc: "Crispy layers filled with cheese or spinach — the ultimate Balkan trail fuel.",
    emoji: "🫓",
  },
  {
    id: "caj-mali",
    title: "Traditional Çaj Mali & Wild Honey",
    desc: "Hot thermos of fragrant Albanian mountain tea picked fresh from high ridges.",
    emoji: "🫖",
  },
  {
    id: "chocolate-nuts",
    title: "Dark Chocolate & Roasted Almonds",
    desc: "High energy trail mix, sea-salt dark chocolate, and dried apricots.",
    emoji: "🍫",
  },
  {
    id: "fruit-cheese",
    title: "Fresh Figs, Apples & Local Goat Cheese",
    desc: "Fresh orchard fruit, crisp bread, and sharp mountain cheese.",
    emoji: "🍇",
  },
];

export const ORGANIZER_DUTIES = [
  { id: "thermos", label: "Carry hot thermos with fresh coffee or Çaj Mali" },
  { id: "camera", label: "Bring camera / phone gimbal for cinematic summit photos" },
  { id: "music", label: "Bring Bluetooth speaker & curated mountain playlist" },
  { id: "fleece", label: "Pack an extra warm windbreaker / jacket in case of wind" },
  { id: "snacks", label: "Carry all the heavy snack boxes and water bottles" },
  { id: "firstaid", label: "Bring complete trail first-aid, sunscreen & lip balm" },
];
