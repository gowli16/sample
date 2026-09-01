// Brainrot Trivia Questions Bank
// Add or edit questions here!

const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: "What does the term 'Rizz' mean?",
    options: [
      "Running out of battery power",
      "Romantic charisma, charm, or the ability to attract a partner",
      "A type of toxic waste water found in Ohio",
      "A secret gesture used by mewing practitioners"
    ],
    correctIndex: 1,
    auraAward: 150,
    explanation: "Short for 'Charisma' (cha-rizz-ma), it was popularized by streamer Kai Cenat and became Oxford's Word of the Year in 2023. Having rizz means you can easily charm others."
  },
  {
    id: 2,
    question: "Which US State is depicted in memes as a chaotic, cursed wasteland of Eldritch monsters and glitching physics?",
    options: [
      "Florida",
      "Texas",
      "Ohio",
      "Wyoming"
    ],
    correctIndex: 2,
    auraAward: 100,
    explanation: "The 'Only in Ohio' meme treats the state as a bizarre, otherworldly dimension where nothing makes sense and monsters roam freely. It represents the peak of absurd Gen-Z humor."
  },
  {
    id: 3,
    question: "What is the primary physical goal of 'Mewing'?",
    options: [
      "Making high-pitched cat sounds during online classes for views",
      "Pressing your tongue against the roof of your mouth to sharpen your jawline",
      "Escaping the Fanum Tax at the school cafeteria",
      "Increasing your height by standing on your tiptoes"
    ],
    correctIndex: 1,
    auraAward: 150,
    explanation: "Mewing is a technique meant to improve facial structure. In meme culture, it's used to ignore someone by pointing at your jawline to indicate you are 'mewing' and cannot talk."
  },
  {
    id: 4,
    question: "Who is the creator of the viral Source Filmmaker/GMod series 'Skibidi Toilet'?",
    options: [
      "MrBeast",
      "Kai Cenat",
      "DaFuq!?Boom!",
      "Baby Gronk"
    ],
    correctIndex: 2,
    auraAward: 100,
    explanation: "DaFuq!?Boom! (Alexey Gerasimov) uploaded the first Skibidi Toilet short in February 2023. It blew up into a massive multi-episode saga with billions of views."
  },
  {
    id: 5,
    question: "If a friend bursts into your room and forcibly steals a slice of your pizza, what 'tax' have you just paid?",
    options: [
      "The Sigma Tax",
      "The Ohio Toll",
      "The Fanum Tax",
      "The Rizzler Levy"
    ],
    correctIndex: 3,
    auraAward: 150,
    explanation: "Coined by streamer Fanum of the AMP group, who regularly barges into Kai Cenat's stream to steal a bite of whatever food Kai is eating. It has since become standard slang for food-stealing."
  },
  {
    id: 6,
    question: "What does it mean to have 'negative Aura' in internet culture?",
    options: [
      "You are extremely cool, dark, and mysterious",
      "You have made an embarrassing mistake or lost social 'cool points'",
      "You are a master of Looksmaxxing and can mog anyone",
      "You have achieved enlightenment in Ohio"
    ],
    correctIndex: 1,
    auraAward: 100,
    explanation: "Aura is a mock measurement of your personal coolness or swag. Doing something cool gets you '+ Aura', while tripping in public, missing a high-five, or being cringe gets you '- Aura'."
  },
  {
    id: 7,
    question: "In the viral McDonald's trend, what happens shortly after someone drinks the purple 'Grimace Shake'?",
    options: [
      "They transform into Grimace himself and start dancing",
      "They are found lying unconscious or in bizarre horror-movie positions covered in purple shake",
      "They immediately lose 500 Aura points and get mogged",
      "They run at top speed to escape the Fanum Tax"
    ],
    correctIndex: 1,
    auraAward: 200,
    explanation: "Starting in June 2023, creators made mock horror mini-films where tasting the promotional purple shake led to them being 'attacked' by Grimace, lying dead in strange places."
  },
  {
    id: 8,
    question: "What does the slang term 'Mogging' refer to?",
    options: [
      "Eating large amounts of junk food during live streams",
      "Sneaking up behind someone to steal their backpack",
      "Being physically superior, more attractive, or more stylish than someone else in a comparison",
      "Streaming on twitch for 24 hours straight"
    ],
    correctIndex: 2,
    auraAward: 150,
    explanation: "Derived from 'AMOG' (Alpha Male Of Group), 'mogging' someone means you make them look bad by comparison because you are much more attractive or impressive. You are the Mogger, they are Mogged."
  },
  {
    id: 9,
    question: "Who was hyped by TikTok voiceovers as 'The New Rizzler' who supposedly 'rizzed up' gymnast Livvy Dunne?",
    options: [
      "Baby Gronk",
      "Patrick Bateman",
      "Kai Cenat",
      "Duke Dennis"
    ],
    correctIndex: 0,
    auraAward: 120,
    explanation: "A series of viral TikToks by creator @h00pify in mid-2023 detailed how young football player Madden San Miguel ('Baby Gronk') met gymnast Olivia Dunne, using repetitive slang phrases that became legendary brainrot."
  },
  {
    id: 10,
    question: "Which gesture is commonly paired with the act of mewing to tell someone you can't speak?",
    options: [
      "A peace sign and a wink",
      "Pointing an index finger to your lips ('shh') and tracing your jawline",
      "Doing a backflip while yelling 'Gyatt!'",
      "A salute followed by a robot dance"
    ],
    correctIndex: 1,
    auraAward: 150,
    explanation: "The standard mewing sign involves making the 'shh' gesture to silence the other person, then sliding a finger along your jawline to show off your sharp jaw structure."
  },
  {
    id: 11,
    question: "What viral catchphrase did Hailey Welch introduce to the internet in a Nashville street interview in 2024?",
    options: [
      "Skibidi Yes Yes",
      "Hawk Tuah (and spit on that thang!)",
      "Tax that burger!",
      "I'm mewing, go away"
    ],
    correctIndex: 1,
    auraAward: 100,
    explanation: "An interview clip in June 2024 went viral globally when Hailey Welch used the sound 'Hawk Tuah' to describe a specific action, making her an instant internet celebrity."
  },
  {
    id: 12,
    question: "For a self-proclaimed 'Sigma Male', which movie character is considered the ultimate aesthetic icon?",
    options: [
      "SpongeBob SquarePants",
      "Patrick Bateman (from American Psycho)",
      "Shrek",
      "The Camera-head from Skibidi Toilet"
    ],
    correctIndex: 1,
    auraAward: 120,
    explanation: "Sigmas frequently post edits of Christian Bale's portrayal of Patrick Bateman, mimicking his smirk and cold, independent attitude, ironically forgetting the character is a satirical villain."
  },
  {
    id: 13,
    question: "When someone says 'Let him cook!' in a comment section, what do they mean?",
    options: [
      "The person needs to go prepare dinner in the kitchen immediately",
      "Give them space to execute their plan, showcase their talent, or make their point",
      "They are paying their Fanum Tax to the Ohio government",
      "They are trying to mew but failed"
    ],
    correctIndex: 1,
    auraAward: 100,
    explanation: "Originating in sports and hip-hop communities (e.g. Lil B and Russell Wilson), 'Let him cook' means to allow someone to perform their magic or explain themselves without interruption."
  },
  {
    id: 14,
    question: "What does the exclamation 'Gyatt' (or GYAT) stand for or express?",
    options: [
      "Get Your Act Together",
      "An expression of surprise or excitement, often when seeing something or someone impressive",
      "Garry's Mod Toilet Association",
      "Greatest Young Athlete of Today"
    ],
    correctIndex: 1,
    auraAward: 150,
    explanation: "An abbreviation of 'God damn', shouted in excitement or shock, popularized by streamers like Kai Cenat and YourRAGE. It's often used to refer to someone with an attractive physique."
  },
  {
    id: 15,
    question: "What expression does the famous 'Sigma Face' (popularized on TikTok) consist of?",
    options: [
      "An extremely wide, toothy grin",
      "Crying loudly while holding your head",
      "Pursing the lips, raising the eyebrows, and doing a subtle nod",
      "Poking your tongue out and crossing your eyes"
    ],
    correctIndex: 2,
    auraAward: 150,
    explanation: "Popularized by creator Argenby on TikTok, the Sigma face is a exaggerated facial expression representing approval, cool independence, and stoicism."
  }
];
