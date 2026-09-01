// Brainrot Meme Database
// Feel free to add, modify, or delete memes here!

const MEME_DATABASE = [
  {
    id: "skibidi-toilet",
    title: "Skibidi Toilet",
    category: "Gen Alpha",
    tags: ["brainrot", "series", "gmod", "viral"],
    auraRating: "-500 Aura",
    auraLevel: -500,
    description: "A viral YouTube series created by DaFuq!?Boom! featuring toilets with human heads battling humanoids with cameras, speakers, and televisions for heads. It became the defining cultural icon of Gen Alpha.",
    origin: "First uploaded in February 2023 on YouTube Shorts, using Garry's Mod assets and a mashup song of 'Give It To Me' and 'Dom Dom Yes Yes'.",
    gradient: "linear-gradient(135deg, #ff416c, #ff4b2b)", // Neon red/pink
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPMzAUMl5FOayf4Jfl-pbapevvq67o0DngkeSYq4KndzBrlx1bLcvq_Y51wzrUdIJ8DE5NndMqx5cZ6IoHIe5R0UdzaMxgLUiKJRhl1Q&s"
  },
  {
    id: "mewing-looksmaxxing",
    title: "Mewing & Looksmaxxing",
    category: "Slang",
    tags: ["looksmaxxing", "mewing", "jawline", "self-improvement"],
    auraRating: "+300 Aura",
    auraLevel: 300,
    description: "The practice of keeping your tongue pressed against the roof of your mouth to restructure your jawline. Used in memes with a 'shh' gesture to show you are busy mewing and cannot speak.",
    origin: "Derived from orthotropic techniques popularized by British orthodontist John Mew, which mutated into a massive TikTok subculture in late 2023.",
    gradient: "linear-gradient(135deg, #1fa2ff, #12d8fa, #a6ffcb)", // Blue/cyan/green
    imageUrl: "assets/mewing.jpg"
  },
  {
    id: "rizzler",
    title: "The Rizzler",
    category: "Slang",
    tags: ["rizz", "kai-cenat", "slang", "flirting"],
    auraRating: "+500 Aura",
    auraLevel: 500,
    description: "A title bestowed upon someone who possesses an extreme level of 'Rizz' (romantic charisma). Variants include 'unspoken rizz', 'rizz god', and 'Baby Gronk being the new Rizzler'.",
    origin: "Word popularized by streamer Kai Cenat in 2021/2022, officially added to Oxford Dictionary as the Word of the Year in 2023.",
    gradient: "linear-gradient(135deg, #8a23ab, #e94057, #f27121)", // Cyberpunk sunset
    imageUrl: "assets/rizzler.jpg"
  },
  {
    id: "baby-gronk-livvy-dunne",
    title: "Baby Gronk & Livvy Dunne",
    category: "TikTok Trends",
    tags: ["baby-gronk", "rizzler", "livvy-dunne", "cringe"],
    auraRating: "-800 Aura",
    auraLevel: -800,
    description: "A meme detailing the highly exaggerated athletic and social recruitment of Madden San Miguel ('Baby Gronk') and his interaction with gymnast Livvy Dunne, described by a TTS voice as 'the new Rizzler'.",
    origin: "A series of viral TikTok voiceover videos by creator @h00pify in mid-2023, widely mocked for its convoluted narrative structure.",
    gradient: "linear-gradient(135deg, #f857a6, #ff5858)", // Magenta pink
    imageUrl: "assets/baby-gronk.jpg"
  },
  {
    id: "sigma-male",
    title: "Sigma Male",
    category: "Classic",
    tags: ["sigma", "grindset", "patrick-bateman", "chad"],
    auraRating: "+100 Aura",
    auraLevel: 100,
    description: "A lone-wolf archetype who is successful, independent, and completely indifferent to social hierarchies. Often paired with edits of Patrick Bateman, Christian Bale smirking, or the song 'Worth It'.",
    origin: "Originating in alt-right pick-up-artist forums around 2010, it became a massive sarcastic meme trend in 2021/2022 emphasizing 'the grindset'.",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)", // Green matrix
    imageUrl: "assets/sigma-male.jpg"
  },
  {
    id: "ohio",
    title: "Only in Ohio",
    category: "Classic",
    tags: ["ohio", "cursed", "supernatural", "chaotic"],
    auraRating: "-200 Aura",
    auraLevel: -200,
    description: "A meme depicting Ohio as an apocalyptic wasteland filled with Eldritch monsters, chaotic entities, and glitching physics. The catchphrase 'Only in Ohio' accompanies bizarre, cursed videos.",
    origin: "Evolved from a 2016 Tumblr post showing a bus sign reading 'Ohio will be eliminated', peaking in popularity on TikTok in late 2022.",
    gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // Cursed slate blue
    imageUrl: "assets/ohio.jpg"
  },
  {
    id: "fanum-tax",
    title: "Fanum Tax",
    category: "Slang",
    tags: ["fanum", "kai-cenat", "taxing", "amp"],
    auraRating: "-300 Aura",
    auraLevel: -300,
    description: "The act of forcibly taking a percentage of a friend's food when they are eating. Usually happens inside the AMP content house, where creator Fanum 'taxes' Kai Cenat.",
    origin: "Coined by streamer Fanum in late 2022 during streams where he would burst into Kai Cenat's room and steal pizza/burgers.",
    gradient: "linear-gradient(135deg, #fc4a1a, #f7b733)", // Food orange/yellow
    imageUrl: "assets/fanum-tax.jpg"
  },
  {
    id: "grimace-shake",
    title: "The Grimace Shake",
    category: "TikTok Trends",
    tags: ["grimace", "mcdonalds", "horror", "trends"],
    auraRating: "-50 Aura",
    auraLevel: -50,
    description: "A TikTok trend where people record themselves wishing McDonald's mascot Grimace a happy birthday while sipping his purple shake, followed by a cut to a mock horror scene where they are lying unconscious in weird locations covered in purple liquid.",
    origin: "Started by TikToker @ruizzcody in June 2023 for McDonald's promotional campaign, transforming it into a creative viral horror trend.",
    gradient: "linear-gradient(135deg, #6441a5, #2a0845)", // Deep purple Grimace
    imageUrl: "assets/grimace-shake.jpg"
  },
  {
    id: "mewing-jawline",
    title: "Mogged",
    category: "Slang",
    tags: ["looksmaxxing", "mogging", "superiority", "physique"],
    auraRating: "+400 Aura",
    auraLevel: 400,
    description: "To 'mog' someone is to be significantly more attractive, stylish, or physically imposing than them (making you the 'mogger' and them 'mogged'). Often used in fitness and looksmaxxing edit comparisons.",
    origin: "Bodybuilding forums (specifically Lookism/Sluthate) in the 2010s, standing for 'AMOG' (Alpha Male Of Group) + '-ed'. Prevalent on TikTok since 2023.",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)", // Royal blue
    imageUrl: "assets/mogged.jpg"
  },
  {
    id: "hawk-tuah",
    title: "Hawk Tuah",
    category: "TikTok Trends",
    tags: ["spit-on-that-thang", "street-interview", "viral-clip", "cringe"],
    auraRating: "-100 Aura",
    auraLevel: -100,
    description: "A viral catchphrase describing the spitting sound ('Hawk Tuah!') made before performing a certain romantic act. The video turned the interviewee into an overnight internet celebrity.",
    origin: "A street interview clip posted by YouTube channel 'Talky Talky' in Nashville, Tennessee, in June 2024 featuring Hailey Welch.",
    gradient: "linear-gradient(135deg, #ffe259, #ffa751)", // Gold/Orange
    imageUrl: "assets/hawk-tuah.jpg"
  }
];
