// Complete Canon & Data for Track 2 ("Your Own Baby"): Mochi, The Baby Cloud-Sprite
// Every story scene is concise, ultra-cute, and strictly under the 150-word Golden Rule limit.

export const BITZ_CHARACTER_SHEET = {
  name: "Mochi",
  title: "Little Sky-Cuddle & Rainbow Weaver",
  species: "0.4-Marshmallow Baby Cloud-Puff",
  whatTheyAre:
    "A squishy, strawberry-blush baby cloud puff wearing a cozy periwinkle knit nightcap with a jingling Golden Star-Bell and holding a spinning Rainbow Candy Wand!",
  whatTheyDo:
    "Spins sugar-candy rainbows, conducts 1773 Violin & Piano raindrop lullabies, and sails origami wish-boats to sleepy dreamers.",
  theirStory:
    "Popped out of a cotton-candy sunrise with a sleepy giggle and a pocketful of starlight! Now Mochi floats from cloud to cloud making every sky musical and bright.",
  tagline: "“One little cloud-hug, one big rainbow sky!”",
  registrationRef: "HAX-456DA90F0BD7458D",
  traits: [
    { emoji: "🍓", label: "Favorite Snack", value: "Strawberry Milk Dew & Sugar Stars" },
    { emoji: "🎻", label: "Superpower", value: "Turns raindrops into Violin & Piano Lullabies" },
    { emoji: "🎉", label: "Cute Quirk", value: "Giggles a shower of pastel confetti when tickled" },
    { emoji: "🍭", label: "Magic Gear", value: "Spinning Rainbow Candy Wand & Knit Star-Cap" },
  ],
};

// Section 05.2 & Tier 2: 4 Interactive Showcase Creations
export const SHOWCASE_PROJECTS = [
  {
    id: "raindrop-lullaby-lab",
    number: "01",
    badge: "Live Orchestra Organ · Tier 2",
    title: "The Raindrop Lullaby Lab",
    subtitle: "Interactive 1773 Violin, Piano, Flute & Music-Box Cloud Organ",
    description:
      "Tap the bouncing cloud-keys to play real Bowed Violin, Grand Piano Chords, Sliding Bansuri Flute, or Crystal Bells—or launch the 4 distinct 1773 musical styles!",
    notes: [
      { id: "c5", label: "Do · C5", freq: 523.25, color: "#f9a8d4" },
      { id: "d5", label: "Re · D5", freq: 587.33, color: "#fed7aa" },
      { id: "e5", label: "Mi · E5", freq: 659.25, color: "#fde047" },
      { id: "g5", label: "Sol · G5", freq: 783.99, color: "#86efac" },
      { id: "a5", label: "La · A5", freq: 880.0, color: "#7dd3fc" },
      { id: "c6", label: "High · C6", freq: 1046.5, color: "#d8b4fe" },
    ],
  },
  {
    id: "bottled-aurora-lanterns",
    number: "02",
    badge: "Interactive Snow-Globe Dome · Tier 2",
    title: "Bottled Aurora Nightlights",
    subtitle: "Swirling Starlight Snow-Globe & Magic Torch",
    description:
      "Wave your cursor inside Mochi's crystal nightlight dome to shine the magic torch, or swirl the globe to send pastel northern lights dancing!",
    lanterns: [
      {
        id: "sunset-honey",
        name: "Jar #01 · Honey Peach",
        recipe: "3 drops of golden sunset + warm vanilla cloud fluff",
        glowColor: "#fbbf24",
        secretNote: "★ Secret Constellation: The Cuddly Honey-Bear!",
      },
      {
        id: "berry-nebula",
        name: "Jar #02 · Berry Mochi",
        recipe: "Pink strawberry twilight + fizzy starlight sugar",
        glowColor: "#f472b6",
        secretNote: "★ Secret Constellation: The Spinning Candy Wand!",
      },
      {
        id: "mint-aurora",
        name: "Jar #03 · Minty Breeze",
        recipe: "Cool sky-blue mist + twinkling firefly giggles",
        glowColor: "#38bdf8",
        secretNote: "★ Secret Constellation: The Sailing Paper Boat!",
      },
      {
        id: "lavender-hush",
        name: "Jar #04 · Lavender Lullaby",
        recipe: "1773 violin echoes + cozy marshmallow pillows",
        glowColor: "#c084fc",
        secretNote: "★ Secret Constellation: The Sleeping Baby Moon!",
      },
    ],
  },
  {
    id: "paper-boat-dream-routes",
    number: "03",
    badge: "Animated Sky-River Race · Tier 2",
    title: "Paper-Boat Dream Delivery Routes",
    subtitle: "Origami Cloud-Cruiser & Parachute Wish Drop",
    description:
      "Launch Mochi's origami dream-boat across the rainbow sky-river! Click any cloud island or press Sail Full Route to watch it hop across the stars!",
    stops: [
      {
        id: "stop-1",
        time: "19:30",
        name: " Berry Clocktower",
        recipient: "Barnaby the Baby Owl 🦉",
        cargo: "1x Violin Lullaby & Fluffy Pillow",
        x: 15,
        y: 68,
      },
      {
        id: "stop-2",
        time: "20:15",
        name: " Dewdrop Greenhouse",
        recipient: "Pebble the Little Turtle 🐢",
        cargo: "Warm Rainbow Mist & Clover Tea",
        x: 40,
        y: 28,
      },
      {
        id: "stop-3",
        time: "21:00",
        name: " Starlight Lighthouse",
        recipient: "Flicker the Baby Bunny 🐰",
        cargo: "Glowing Candy Jar & Cozy Blanket",
        x: 68,
        y: 62,
      },
      {
        id: "stop-4",
        time: "22:00",
        name: " Moonbeam Castle",
        recipient: "All Dreaming Coders 💻",
        cargo: "1st-Place Trophy & Zero-Bug Magic!",
        x: 88,
        y: 24,
      },
    ],
  },
  {
    id: "cumulus-block-toybox",
    number: "04",
    badge: "Jelly-Bounce Physics Game · Tier 2",
    title: "Cumulus Block & Rattle Toybox",
    subtitle: "Squishy Smiling Mochi-Blocks & Musical Star-Rattle",
    description:
      "Stack squishy smiling marshmallow blocks as high as you can! Every block bounces like jelly and plays a rising melody until Mochi bursts into giggles!",
  },
];

// Section 05.3: Origin Story Scenes (Short, poetic, ~38 words each — strictly <= 150 words!)
export const ORIGIN_STORY_SCENES = [
  {
    sceneNumber: "01",
    title: "Pop! Born From a Cotton-Candy Sunrise",
    timeTag: "04:17 AM · First Giggle",
    moodColor: "#f472b6",
    badge: "The Hatching",
    illustrationType: "sunrise-pop",
    wordCount: 38,
    content:
      "One rosy morning, a fluffy pink cloud bumped into a golden sunbeam and giggled! POOF! Out popped baby Mochi, wearing an oversized knit sleeping cap with a jingling golden star-bell and hugging a swirling rainbow candy wand.",
  },
  {
    sceneNumber: "02",
    title: "Turning Grumpy Rain Into Sweet Music",
    timeTag: "12:30 PM · The Lullaby",
    moodColor: "#38bdf8",
    badge: "The Magic",
    illustrationType: "violin-rain",
    wordCount: 39,
    content:
      "Whenever big gray clouds got grumpy and noisy, Mochi waved the Rainbow Candy Wand! Instantly, every falling raindrop turned into a sweet 1773 Violin and Grand Piano note, filling the sky with an enchanting concert lullaby.",
  },
  {
    sceneNumber: "03",
    title: "The Dress-Up & Aurora Toy Workshop",
    timeTag: "17:17 PM · Playtime",
    moodColor: "#fbbf24",
    badge: "The Playroom",
    illustrationType: "aurora-dome",
    wordCount: 37,
    content:
      "Inside the floating Sky-Loft Playroom, Mochi loves trying on strawberry onesies, bunny hoodies, and royal capes while bottling northern lights into glowing snow-globes and stacking bouncy marshmallow blocks.",
  },
  {
    sceneNumber: "04",
    title: "Sailing Wish-Boats Across the Stars",
    timeTag: "21:45 PM · Starlight",
    moodColor: "#c084fc",
    badge: "Bedtime Voyage",
    illustrationType: "boat-voyage",
    wordCount: 36,
    content:
      "When night falls and shooting stars streak across the aurora sky, Mochi launches folded paper dream-boats. Ring the golden star-bell three times, and Mochi will weave a shimmering rainbow bridge just for you!",
  },
];

// Tier 3: Mochi Interactive Character Dialogue Prompts & Responses
export const BITZ_CHAT_PRESETS = [
  {
    id: "who",
    question: "Who are you, little cloud? ☁️",
    answer:
      "*bounces happily in a strawberry onesie* Hiya! I'm Mochi! I weigh 0.4 marshmallows and I love waving my Rainbow Candy Wand to make the sky sing!",
  },
  {
    id: "bell",
    question: "What does your Golden Star-Bell do? 🔔",
    answer:
      "*ting-a-ling!* The Golden Star-Bell on my knit nightcap rings with magical melodies! Tap it 3 times to shower the whole sky with rainbow confetti!",
  },
  {
    id: "clothes",
    question: "Which cute outfit is your favorite? 👗",
    answer:
      "*twirls around* Ooh, I love my Strawberry Onesie and my Cozy Bunny Hoodie! You can change my actual clothes live using the Dress-Up bar under me!",
  },
  {
    id: "lullaby",
    question: "Play me a lucky hackathon wish! 🎻",
    answer:
      "*waves Rainbow Candy Wand* Poof! I just played a 1773 Violin & Grand Piano wish for you—may your project shine in 1st place! ✨🏆",
  },
];
