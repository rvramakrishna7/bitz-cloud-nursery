// Complete Canon & Data for Track 2 ("Your Own Baby"): Bitz, The Baby Cloud-Sprite
// Every story scene is strictly verified to be well under the 150-word Golden Rule limit.

export const BITZ_CHARACTER_SHEET = {
  name: "Bitz",
  title: "Junior Weather Weaver & Cloud-Sprite Hatchling",
  species: "Cumulus Nimbus Sprite (Weight: 0.4 marshmallows)",
  whatTheyAre:
    "A fluffy, warm-cream baby cloud sprite with rosy rainbow-blush cheeks, wide starry amber eyes, and a tiny brass lightning-rod antenna that twinkles whenever a good idea strikes.",
  whatTheyDo:
    "Junior Weather Weaver at the Sky-Loft Nursery. Bitz catches stray static sparks, tangled breezes, and nighttime worries, weaving them into soothing raindrop lullabies, bottled auroras, and paper-boat dreams.",
  theirStory:
    "Born from a stray giggle and a golden sunbeam inside an old weathervane, Bitz tumbled into the Sky-Loft Nursery with a pocketful of unspun dew. Now Bitz drifts from rooftop to rooftop, making sure every creature sleeps under a gentle sky.",
  tagline: "“I weave stray sparks into cozy skies and bedtime rainbows.”",
  registrationRef: "HAX-456DA90F0BD7458D",
  traits: [
    { label: "Favorite Snack", value: "Warm Static Peppermints & Morning Dew" },
    { label: "Superpower", value: "Turns thunder-grumbles into Lo-Fi RainChimes" },
    { label: "Quirk", value: "Sneezes tiny pastel confetti when tickled on the antenna" },
    { label: "Bedtime Gear", value: "Polished Brass Weather-Bell & Folded Star Map" },
  ],
};

// Section 05.2 & Tier 2: 4 Interactive Showcase Creations
export const SHOWCASE_PROJECTS = [
  {
    id: "raindrop-lullaby-lab",
    number: "01",
    badge: "Web Audio Synthesizer · Tier 2",
    title: "The Raindrop Lullaby Lab",
    subtitle: "Interactive 8-Puddle Celestial Music Box",
    description:
      "Bitz tunes puddle-bells on cloud rooftops so falling raindrops play gentle pentatonic lullabies. Tap the glowing puddles or wind the golden key to compose your own bedtime melody!",
    notes: [
      { id: "C5", label: "Dew C", freq: 523.25, color: "#ff9ebb" },
      { id: "D5", label: "Mist D", freq: 587.33, color: "#ffb88c" },
      { id: "E5", label: "Sun E", freq: 659.25, color: "#f4b942" },
      { id: "G5", label: "Breeze G", freq: 783.99, color: "#7bd3ae" },
      { id: "A5", label: "Star A", freq: 880.0, color: "#82b1ff" },
      { id: "C6", label: "Cloud C+", freq: 1046.5, color: "#b388ff" },
    ],
  },
  {
    id: "bottled-aurora-lanterns",
    number: "02",
    badge: "Flashlight Torch Mask · Tier 2",
    title: "Bottled Aurora Nightlights",
    subtitle: "Glowing Weather-Jars & Secret Starlight Torch",
    description:
      "For little creatures afraid of the dark, Bitz bottles leftover sunset embers and northern lights. Switch on the Starlight Torch cursor to reveal hidden bedtime constellations inside the dark nursery!",
    lanterns: [
      {
        id: "sunset-honey",
        name: "Jar #01 · Sunset Honey",
        recipe: "3 drops of 5 PM golden hour + 1 sleepy bee hum",
        glowColor: "#f4b942",
        secretNote: "Hidden Star: The Slumbering Bear Cub ★",
      },
      {
        id: "berry-nebula",
        name: "Jar #02 · Berry Nebula",
        recipe: "Crushed raspberry twilight + warm marshmallow mist",
        glowColor: "#ff7aa2",
        secretNote: "Hidden Star: The Cozy Teacup Constellation ★",
      },
      {
        id: "mint-aurora",
        name: "Jar #03 · Polar Mint Dew",
        recipe: "Shivering polar starlight + cozy wool-mitten static",
        glowColor: "#5eead4",
        secretNote: "Hidden Star: The Paper-Boat Sailor ★",
      },
      {
        id: "lavender-hush",
        name: "Jar #04 · Lavender Hush",
        recipe: "Midnight lullaby echoes + pressed chamomile clouds",
        glowColor: "#c084fc",
        secretNote: "Hidden Star: The Clockwork Moon Cradle ★",
      },
    ],
  },
  {
    id: "paper-boat-dream-routes",
    number: "03",
    badge: "Animated SVG Flight Map · Tier 2",
    title: "Paper-Boat Dream Delivery Routes",
    subtitle: "Rooftop Wind-Currents & Cloud-Stream Navigator",
    description:
      "Every evening at 17:17, Bitz launches origami cloud-boats across the neighborhood rooftops. Scrub the flight timeline or click any stop to inspect tonight's weather-wish cargo!",
    stops: [
      {
        id: "stop-1",
        time: "19:30",
        name: "Clocktower Attic",
        recipient: "Barnaby the Baby Owl",
        cargo: "1x Feather-Soft Breeze & Silver Cricket Lullaby",
        x: 15,
        y: 68,
      },
      {
        id: "stop-2",
        time: "20:15",
        name: "Mossy Greenhouse",
        recipient: "Pebble the Garden Tortoise",
        cargo: "Warm Patter-Rain & Clover-Scented Mist",
        x: 40,
        y: 32,
      },
      {
        id: "stop-3",
        time: "21:00",
        name: "Lighthouse Lantern Room",
        recipient: "Flicker the Little Moth",
        cargo: "Amber Moonbeam Jar & Zero-Static Blanket",
        x: 68,
        y: 58,
      },
      {
        id: "stop-4",
        time: "22:00",
        name: "Starlight Observatory",
        recipient: "All Sleeping Builders",
        cargo: "Golden Rainbow Promise for Tomorrow's Code",
        x: 88,
        y: 24,
      },
    ],
  },
  {
    id: "cumulus-block-toybox",
    number: "04",
    badge: "Interactive Mini-Game · Tier 2",
    title: "Cumulus Block & Rattle Toybox",
    subtitle: "Stackable Cloud Towers & Static Spark Rattle",
    description:
      "What does a baby cloud play with between shifts? Fluffy gravity-defying weather blocks! Stack the blocks as high as you can before Bitz giggles and tumbles the tower.",
  },
];

// Section 05.3: Origin Story Scenes (Strictly < 65 words per scene — well under the 150-word limit!)
export const ORIGIN_STORY_SCENES = [
  {
    sceneNumber: "Scene 01",
    title: "A Spark in the Copper Weathervane",
    timeTag: "04:17 AM · The First Puff",
    moodColor: "#f4b942",
    badge: "Origin",
    illustrationType: "weathervane",
    wordCount: 54,
    content:
      "High above Cherry-Blossom Lane, a sleepy autumn cloud snagged its hem on an old copper rooster weathervane. Instead of raining, the fluff giggled! A tiny stray sunbeam tangled with a static spark, and—POP!—out tumbled Bitz, wearing a crooked brass antenna and blinking wide amber eyes at the waking world.",
  },
  {
    sceneNumber: "Scene 02",
    title: "The Grumpy Thunder-Drop Crisis",
    timeTag: "12:30 PM · First Discovery",
    moodColor: "#82b1ff",
    badge: "The Craft",
    illustrationType: "puddle-chime",
    wordCount: 56,
    content:
      "Little Bitz noticed that heavy gray storm-clouds were just overtired babies throwing noisy tantrums. Whenever Bitz tapped a grumpy raindrop with the brass antenna, the thunder-rumble softened into a sweet wooden xylophone chime! Soon, Bitz was collecting stray droplets in jam jars and tuning them into gentle rooftop lullabies.",
  },
  {
    sceneNumber: "Scene 03",
    title: "Apprentice at the Sky-Loft Nursery",
    timeTag: "17:17 PM · The Workshop",
    moodColor: "#a34063",
    badge: "Vocation",
    illustrationType: "lantern-bench",
    wordCount: 53,
    content:
      "The Elder Wind-Makers were so delighted that they awarded Bitz an official nursery apron and a miniature cloud-workbench. Every afternoon, Bitz folds waterproof paper boats, fills porcelain lanterns with leftover sunset glow, and labels each parcel for kittens, fireflies, and tired human coders who need a peaceful night.",
  },
  {
    sceneNumber: "Scene 04",
    title: "Sailing Into Tonight's Starlight",
    timeTag: "21:45 PM · Bedtime Voyage",
    moodColor: "#7bd3ae",
    badge: "The Journey Ahead",
    illustrationType: "starlight-voyage",
    wordCount: 51,
    content:
      "When the moon clocks in, Bitz hops aboard the fluffiest cumulus cruiser and glides silently across the chimneys. One tap of the antenna scatters pastel stardust over every window. As long as someone out there is dreaming up a new idea, Bitz will keep the night sky warm and bright.",
  },
];

// Tier 3: Bitz Interactive Character Dialogue Prompts & Responses
export const BITZ_CHAT_PRESETS = [
  {
    id: "who",
    question: "Who are you, little cloud?",
    answer:
      "*puffs up happily* Hiya! I'm Bitz! I'm 0.4 marshmallows heavy, and I weave stray static sparks into cozy raindrop lullabies and bottled auroras!",
  },
  {
    id: "antenna",
    question: "What does your brass antenna do?",
    answer:
      "*bzzzt-ting!* My antenna catches grumpy thunder-rumbles before they scare anyone and turns them into C-major wind chimes! Try clicking it 3 times if you dare!",
  },
  {
    id: "dream",
    question: "Can you weave me a lucky hackathon wish?",
    answer:
      "*spins a golden sunbeam* Poof! I just packed one Extra-Lucky Zero-Bug Breeze into a paper boat for you! Your code will compile on the very first try tonight! ✨",
  },
  {
    id: "sleep",
    question: "Do baby clouds ever go to sleep?",
    answer:
      "*yawns a tiny rainbow* Only after 11,081 builders tuck their laptops in! When I nap, I curl up inside a warm teacup on the moon.",
  },
];
