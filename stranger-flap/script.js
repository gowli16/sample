/**
 * STRANGER FLAP — STANDALONE RETRO GAME
 * Stranger Things inspired Flappy Bird Web Game
 */

(function () {
  'use strict';

  // Character Sprites Color Palette Mapping
  const PALETTE = {
    '.': 'transparent',
    'k': '#000000', // Black outline
    's': '#ffcc99', // Light skin
    'S': '#a06030', // Dark skin (Lucas)
    'h': '#5c4033', // Brown hair
    'H': '#111111', // Black hair
    'w': '#ffffff', // White
    'r': '#ff1e27', // Red (Stranger Things / cap / nosebleed)
    'b': '#1e40af', // Navy blue
    'x': '#00f0ff', // Cyan / Light blue
    'g': '#065f46', // Camo green
    'd': '#a18262', // Sheriff khaki
    'y': '#fbbf24', // Waffle gold / yellow
    'p': '#f472b6', // Pink dress
    'v': '#9ca3af'  // Grey/silver
  };

  const CHARACTERS = {
    eleven: {
      name: "ELEVEN",
      desc: "Escaped test subject. Loves Eggo waffles. Telekinetic powers keep her stable in flight.",
      flap: "★★★★★",
      weight: "★★☆☆☆",
      special: "TELEKINESIS FLAP",
      gravity: 0.06,
      jumpForce: 1.6,
      pixels: [
        "....kkkkkkk.....",
        "...kffffffsk....",
        "..kfssssssssk...",
        "..ksssssssssk...",
        "..kssspppsssk...",
        "..kssppppppsk...",
        "..ksppkpppksk...",
        "..kspppppppsk...",
        "...kppppppsk....",
        "....kspppsk.....",
        "....kdddddk.....",
        "...kdddddddk....",
        "..kdddddddddk...",
        "..kdddddddddk...",
        "...kk.....kk....",
        "...kk.....kk...."
      ]
    },
    dustin: {
      name: "DUSTIN",
      desc: "Curious, bright, and waffle-obsessed. His trucker cap gives him slightly higher aerodynamic glide.",
      flap: "★★★★☆",
      weight: "★★★☆☆",
      special: "COMPASS GLIDE",
      gravity: 0.08,
      jumpForce: 1.8,
      pixels: [
        "....rrrrrr......",
        "...rrwwwwrr.....",
        "..bbbbbbbbbb....",
        "..khhhhhhhhk....",
        ".khhsssssshhk...",
        ".khhsksskshhk...",
        "..khsswwsshk....",
        "...khsssshk.....",
        "...kggggggk.....",
        "..kgygggyggk....",
        ".kggggggggggk...",
        ".kxxxxxxxxxxk...",
        "..kku...ukk.....",
        "...ks...sk......",
        "...kk...kk......",
        "................"
      ]
    },
    mike: {
      name: "MIKE",
      desc: "Leader of the party. Carries his signature walkie-talkie. A balanced character with standard stats.",
      flap: "★★★☆☆",
      weight: "★★★☆☆",
      special: "WALKIE BEAT",
      gravity: 0.09,
      jumpForce: 1.9,
      pixels: [
        "....kHkHkH......",
        "...kHHHHHHk.....",
        "..kHHHHHHHHk....",
        "..kHHssssHHk....",
        "..kHHsHssHk.....",
        "...kHssssHk.....",
        "....kssssk......",
        "....krrrrk......",
        "...krrrrrrk.....",
        "..krrrrrrrrk....",
        ".krrbbbbbbrrk...",
        ".krbbbbbbbbrk...",
        "..kku...ukk.....",
        "...ks...sk......",
        "...kk...kk......",
        "................"
      ]
    },
    lucas: {
      name: "LUCAS",
      desc: "Realistic, cautious, and ready with his slingshot. Nimble and drops fast, allowing quick dodging.",
      flap: "★★☆☆☆",
      weight: "★★★★★",
      special: "SLINGSHOT DROP",
      gravity: 0.11,
      jumpForce: 2.1,
      pixels: [
        "....kgggk.......",
        "...kgggggk......",
        "..kSSssssSSk....",
        "..kSssssssSk....",
        "..kSsHssHssSk...",
        "..kSssssssSk....",
        "...kSssssSk.....",
        "....kSSSSk......",
        "....kddddk......",
        "...kddddddk.....",
        "..kddddddddk....",
        ".kddddddddddk...",
        "..kku...ukk.....",
        "...kS...Sk......",
        "...kk...kk......",
        "................"
      ]
    },
    steve: {
      name: "STEVE",
      desc: "The babysitter. Has a legendary high haircut and baseball bat. Heaviest but has extreme jump recovery.",
      flap: "★★★★★",
      weight: "★★★★★",
      special: "SPIKED BAT FLAP",
      gravity: 0.13,
      jumpForce: 2.3,
      pixels: [
        ".....khhhk......",
        "....khhhhhk.....",
        "...khhhhhhhk....",
        "...khhssshhk....",
        "...khsHssHhk....",
        "....khsssshk....",
        "....khsssshk....",
        "....kbbbbbk.....",
        "...kbbwbbwbk....",
        "..kbwbbbbbwbk...",
        ".kbbbbbbbbbbbk..",
        ".kbbbbbbbbbbbk..",
        "..kku...ukk.....",
        "...ks...sk......",
        "...kk...kk......",
        "................"
      ]
    },
    hopper: {
      name: "HOPPER",
      desc: "Hawkins' Chief of Police. Wearing his Sheriff hat. Very heavy but resilient with steady flaps.",
      flap: "★★★☆☆",
      weight: "★★★★★",
      special: "SHERIFF BARRIER",
      gravity: 0.10,
      jumpForce: 2.0,
      pixels: [
        "....dddddd......",
        "...dddddddd.....",
        "..kddddddddk....",
        "..khhhhhhhhk....",
        "..khsssssshk....",
        "..khsksskshk....",
        "...kssssssk.....",
        "....ksssk.......",
        "....kddddk......",
        "...kddddddk.....",
        "..kddddddddk....",
        ".kddydyddyydk...",
        "..kku...ukk.....",
        "...ks...sk......",
        "...kk...kk......",
        "................"
      ]
    }
  };

  // Game Engine & Variables
  let canvas, ctx;
  let ambientCanvas, ambientCtx;
  let isMuted = true;
  let isUpsideDown = false;
  let gameState = 'SELECT'; // 'SELECT', 'PLAYING', 'GAMEOVER'
  let score = 0;
  let bestScore = 0;
  let waffles = 0;
  let selectedChar = 'eleven';
  let hasStartedMoving = false;

  // Timing/Loops
  let animationId = null;
  let gameFrame = 0;

  // Sound Engine Context
  let audioCtx = null;
  let masterGain = null;
  let bgmIntervalId = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let lfoOsc = null;
  let isBGMActive = false;

  // Physics Config for Player
  let player = {
    x: 100,
    y: 200,
    vy: 0,
    width: 36,
    height: 36,
    gravity: 0.3,
    jumpForce: 5.5,
    angle: 0,
    targetAngle: 0
  };

  // Arrays of Entities
  let obstacles = [];
  let wafflesList = [];
  let portalsList = [];
  let ambientParticles = [];

  // ============================================================
  // 1. INITS & DOM EVENT LISTENERS
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    ambientCanvas = document.getElementById('ambient-canvas');
    ambientCtx = ambientCanvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial load of High Score from LocalStorage
    bestScore = parseInt(localStorage.getItem('stranger_flap_best') || '0', 10);

    setupMenuControls();
    initAmbientParticles();
    animateAmbient();
    drawCharacterPreviews();
    updateDetailPanel('eleven');

    // Controls
    document.getElementById('btn-start-game').addEventListener('click', startGame);
    document.getElementById('btn-retry').addEventListener('click', startGame);
    document.getElementById('btn-change-char').addEventListener('click', showCharacterSelect);
    document.getElementById('btn-mute').addEventListener('click', toggleMute);
    
    // Help Modal
    const infoModal = document.getElementById('info-modal');
    document.getElementById('btn-info').addEventListener('click', () => {
      infoModal.classList.remove('hidden');
      playBeep(400, 0.08, 'triangle');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      infoModal.classList.add('hidden');
      playBeep(300, 0.08, 'triangle');
    });

    // Keyboard bindings for controls
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (gameState === 'PLAYING') {
          e.preventDefault();
          playerFlap();
        }
      }
      if (e.key === 'Escape') {
        infoModal.classList.add('hidden');
      }
    });

    // Canvas click bindings for jump
    canvas.addEventListener('mousedown', (e) => {
      if (gameState === 'PLAYING') {
        playerFlap();
      }
    });

    canvas.addEventListener('touchstart', (e) => {
      if (gameState === 'PLAYING') {
        e.preventDefault();
        playerFlap();
      }
    }, { passive: false });
  });

  function resizeCanvas() {
    // Keep ambient particle canvas full screen
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }

  // ============================================================
  // 2. PIXEL ART DRAWING SYSTEM
  // ============================================================
  function drawPixelSprite(ctx, charKey, x, y, size = 2, angle = 0) {
    const char = CHARACTERS[charKey];
    if (!char) return;

    ctx.save();
    // Translate to center of character for rotation
    const spriteSize = 16 * size;
    ctx.translate(x + spriteSize / 2, y + spriteSize / 2);
    ctx.rotate(angle);

    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        const colorChar = char.pixels[r][c];
        if (colorChar !== '.' && PALETTE[colorChar]) {
          ctx.fillStyle = PALETTE[colorChar];
          ctx.fillRect(
            -spriteSize / 2 + c * size,
            -spriteSize / 2 + r * size,
            size,
            size
          );
        }
      }
    }
    ctx.restore();
  }

  function drawCharacterPreviews() {
    const cards = document.querySelectorAll('.char-card');
    cards.forEach(card => {
      const charKey = card.getAttribute('data-char');
      const previewCanvas = card.querySelector('.char-preview-canvas');
      const pCtx = previewCanvas.getContext('2d');

      // Clear
      pCtx.clearRect(0, 0, 48, 48);

      // Draw the character dynamically inside card
      // 16 pixels * size 2.5 = 40px sprite, centered in 48x48 box
      drawPixelSprite(pCtx, charKey, 4, 4, 2.5, 0);
    });
  }

  function setupMenuControls() {
    const cards = document.querySelectorAll('.char-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedChar = card.getAttribute('data-char');
        updateDetailPanel(selectedChar);
        playBeep(600, 0.05, 'sine');
      });
    });
  }

  function updateDetailPanel(charKey) {
    const char = CHARACTERS[charKey];
    document.getElementById('detail-name').innerText = char.name;
    document.getElementById('detail-desc').innerText = char.desc;
    document.getElementById('detail-stat-flap').innerText = char.flap;
    document.getElementById('detail-stat-weight').innerText = char.weight;
    document.getElementById('detail-special').innerText = char.special;
  }

  // ============================================================
  // 3. SYNTHESIZED SOUND EFFECTS ENGINE
  // ============================================================
  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.2, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    } catch (err) {
      console.warn("Web Audio API not supported", err);
    }
  }

  function playBeep(frequency, duration, type = 'sine') {
    if (!audioCtx || isMuted) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playCrunch() {
    if (!audioCtx || isMuted) return;
    // Eggo Waffle crunch sound (high pitch sweep to low)
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.18);
      
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}
  }

  function playCrash() {
    if (!audioCtx || isMuted) return;
    // White noise explosion
    try {
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      noise.start();
      noise.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  function playWarpSound() {
    if (!audioCtx || isMuted) return;
    // Laser slide frequency (dimensional swap)
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isUpsideDown ? 150 : 800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isUpsideDown ? 800 : 150, audioCtx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, audioCtx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  }

  // Synthesizer background music
  function startBGM() {
    if (!audioCtx || isBGMActive) return;
    isBGMActive = true;
    
    if (isUpsideDown) {
      playUpsideDownDrone();
    } else {
      playRightSideUpBassline();
    }
  }

  function stopBGM() {
    isBGMActive = false;
    if (bgmIntervalId) {
      clearInterval(bgmIntervalId);
      bgmIntervalId = null;
    }
    if (droneOsc1) {
      try { droneOsc1.stop(); } catch(e){}
      droneOsc1 = null;
    }
    if (droneOsc2) {
      try { droneOsc2.stop(); } catch(e){}
      droneOsc2 = null;
    }
    if (lfoOsc) {
      try { lfoOsc.stop(); } catch(e){}
      lfoOsc = null;
    }
  }

  function playRightSideUpBassline() {
    stopBGM();
    isBGMActive = true;

    const notes = [
      65.41, 98.00, 130.81, 98.00, // C2 - G2 - C3 - G2
      73.42, 110.00, 146.83, 110.00, // D2 - A2 - D3 - A2
      82.41, 123.47, 164.81, 123.47, // E2 - B2 - E3 - B2
      65.41, 98.00, 130.81, 98.00  // C2 - G2 - C3 - G2
    ];
    let noteIndex = 0;
    const tempo = 115;
    const noteDuration = 60 / tempo / 2; // 8th note duration (260ms)

    bgmIntervalId = setInterval(() => {
      if (isMuted || !isBGMActive || isUpsideDown) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[noteIndex], audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, audioCtx.currentTime);
        filter.Q.setValueAtTime(2, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + noteDuration - 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + noteDuration);

        noteIndex = (noteIndex + 1) % notes.length;
      } catch (e) {}
    }, noteDuration * 1000);
  }

  function playUpsideDownDrone() {
    stopBGM();
    isBGMActive = true;

    try {
      droneOsc1 = audioCtx.createOscillator();
      droneOsc2 = audioCtx.createOscillator();
      lfoOsc = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      const droneGain = audioCtx.createGain();

      droneOsc1.type = 'sawtooth';
      droneOsc1.frequency.setValueAtTime(51.91, audioCtx.currentTime); // Ab1
      
      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(52.5, audioCtx.currentTime); // Detune beating

      lfoOsc.frequency.setValueAtTime(0.18, audioCtx.currentTime); // 5.5 second breath
      lfoGain.gain.setValueAtTime(60, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, audioCtx.currentTime);

      droneGain.gain.setValueAtTime(isMuted ? 0 : 0.25, audioCtx.currentTime);

      lfoOsc.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      droneOsc1.connect(filter);
      droneOsc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);

      droneOsc1.start();
      droneOsc2.start();
      lfoOsc.start();
    } catch (e) {}
  }

  function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('btn-mute');
    if (isMuted) {
      btn.innerText = "🔇 MUTED";
      btn.style.color = 'var(--text-muted)';
      if (masterGain) masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      stopBGM();
    } else {
      btn.innerText = "🔊 SOUND";
      btn.style.color = 'var(--accent-cyan)';
      initAudio();
      if (masterGain) masterGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      if (gameState === 'PLAYING') {
        startBGM();
      }
      playBeep(520, 0.08, 'sine');
    }
  }

  // ============================================================
  // 4. BACKGROUND AMBIENT PARTICLES
  // ============================================================
  function initAmbientParticles() {
    ambientParticles = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      ambientParticles.push({
        x: Math.random() * ambientCanvas.width,
        y: Math.random() * ambientCanvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * 0.015 + 0.005,
        color: isUpsideDown ? 'rgba(230, 20, 10, ' : 'rgba(0, 240, 255, '
      });
    }
  }

  function updateAmbientParticles() {
    for (let i = 0; i < ambientParticles.length; i++) {
      const p = ambientParticles[i];
      if (isUpsideDown) {
        // Red spores drifting up
        p.y -= p.speedY * 0.8;
        p.x += Math.sin(p.y * 0.02) * 0.25 + p.speedX;
      } else {
        // Cyan stars falling down
        p.y += p.speedY;
        p.x += p.speedX;
      }

      p.alpha += p.pulse;
      if (p.alpha > 0.75 || p.alpha < 0.15) {
        p.pulse = -p.pulse;
      }

      // Wrap-around bounds checks
      if (p.y < 0 || p.y > ambientCanvas.height || p.x < 0 || p.x > ambientCanvas.width) {
        p.x = Math.random() * ambientCanvas.width;
        p.y = isUpsideDown ? ambientCanvas.height : 0;
        p.color = isUpsideDown ? 'rgba(230, 20, 10, ' : 'rgba(0, 240, 255, ';
      }
    }
  }

  function animateAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    updateAmbientParticles();

    for (let i = 0; i < ambientParticles.length; i++) {
      const p = ambientParticles[i];
      ambientCtx.beginPath();
      ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ambientCtx.fillStyle = p.color + Math.max(0.05, Math.min(1, p.alpha)) + ')';
      ambientCtx.fill();
    }

    requestAnimationFrame(animateAmbient);
  }

  // ============================================================
  // 5. GAME PLAY STATE AND TRIGGERS
  // ============================================================
  function startGame() {
    initAudio();
    
    // Config player physics depending on chosen character
    const data = CHARACTERS[selectedChar];
    player.gravity = data.gravity;
    player.jumpForce = data.jumpForce;
    player.y = 180;
    player.vy = 0;
    player.angle = 0;
    player.targetAngle = 0;

    // Reset stats
    score = 0;
    waffles = 0;
    gameFrame = 0;
    isUpsideDown = false;
    obstacles = [];
    wafflesList = [];
    portalsList = [];
    hasStartedMoving = false;

    updateHUD();

    // Trigger visual dimension elements reset
    document.body.classList.remove('upside-down-active');
    const dimInd = document.getElementById('dimension-indicator');
    dimInd.innerText = "RIGHT SIDE UP";
    dimInd.className = "dimension-status rsu font-pixel";

    // Setup HUD variables
    document.getElementById('char-select-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    
    gameState = 'PLAYING';
    
    // Play sound and BGM
    playBeep(450, 0.12, 'sawtooth');
    if (!isMuted) {
      startBGM();
    }

    if (animationId) cancelAnimationFrame(animationId);
    loop();
  }

  function triggerGameOver() {
    gameState = 'GAMEOVER';
    stopBGM();
    playCrash();

    // Update LocalStorage best score
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('stranger_flap_best', bestScore);
    }

    // Update screen items
    document.getElementById('final-score').innerText = padScore(score);
    document.getElementById('final-waffles').innerText = padScore(waffles);
    document.getElementById('best-score').innerText = padScore(bestScore);
    
    document.getElementById('game-over-screen').classList.remove('hidden');

    // Trigger screen shake
    document.body.classList.add('upside-down-active');
    setTimeout(() => {
      document.body.classList.remove('upside-down-active');
    }, 400);
  }

  function showCharacterSelect() {
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('char-select-screen').classList.remove('hidden');
    gameState = 'SELECT';
    stopBGM();
    playBeep(350, 0.08, 'sine');
  }

  function playerFlap() {
    if (!hasStartedMoving) {
      hasStartedMoving = true;
    }
    player.vy = -player.jumpForce;
    player.targetAngle = -0.4;
    playBeep(580, 0.06, 'triangle');
  }

  function updateHUD() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-waffles').innerText = waffles;
  }

  function padScore(num) {
    return num.toString().padStart(2, '0');
  }

  // ============================================================
  // 6. DIMENSION SWAPPING (PORTAL TRIGGER)
  // ============================================================
  function triggerDimensionSwap() {
    isUpsideDown = !isUpsideDown;
    
    // Trigger Cabinet layout shake animation
    document.body.classList.add('upside-down-active');
    setTimeout(() => {
      document.body.classList.remove('upside-down-active');
    }, 450);

    playWarpSound();

    // Modify Indicator
    const indicator = document.getElementById('dimension-indicator');
    if (isUpsideDown) {
      indicator.innerText = "THE UPSIDE DOWN";
      indicator.className = "dimension-status usd font-pixel";
    } else {
      indicator.innerText = "RIGHT SIDE UP";
      indicator.className = "dimension-status rsu font-pixel";
    }

    // Refresh ambient spores colors
    for (let i = 0; i < ambientParticles.length; i++) {
      ambientParticles[i].color = isUpsideDown ? 'rgba(230, 20, 10, ' : 'rgba(0, 240, 255, ';
    }

    // Swap sound loop
    if (!isMuted) {
      startBGM();
    }
  }

  // ============================================================
  // 7. ENTITY MANAGEMENT (SPAWNING & COLLISION)
  // ============================================================
  function spawnObstacles() {
    // Spawns columns/vines/portals dynamically
    // Spawn spacing increases with speed
    const spawnRate = 240;
    if (gameFrame % spawnRate === 0 && gameFrame > 60) {
      const obstacleWidth = 52;
      const verticalGap = 140; // Gap height to fly through
      
      // Determine height bounds
      const minHeight = 40;
      const maxHeight = canvas.height - verticalGap - minHeight;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
      const bottomY = topHeight + verticalGap;

      obstacles.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: bottomY,
        width: obstacleWidth,
        passed: false
      });

      // Spawn waffles between the obstacles 50% of the time
      if (Math.random() < 0.55) {
        wafflesList.push({
          x: canvas.width + obstacleWidth + 40,
          y: topHeight + verticalGap / 2,
          size: 16,
          pulse: 0,
          collected: false
        });
      }
    }

    // Spawn Dimensional portal every 850 frames (approx. 14s)
    if (gameFrame > 100 && gameFrame % 850 === 0) {
      portalsList.push({
        x: canvas.width,
        y: canvas.height / 2 - 60,
        width: 32,
        height: 120,
        pulseAngle: 0,
        passed: false
      });
    }
  }

  function updateEntities() {
    // Obstacle Speed slightly increases as score goes up
    const gameSpeed = 1.1 + Math.floor(score / 50) * 0.1;

    // 1. Move & clean obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= gameSpeed;

      // Score trigger
      if (!obs.passed && obs.x + obs.width < player.x) {
        obs.passed = true;
        score += 1;
        updateHUD();
        playBeep(900, 0.05, 'sine');
      }

      // Check collision
      if (
        player.x + 8 < obs.x + obs.width &&
        player.x + player.width - 8 > obs.x
      ) {
        // Player is horizontally aligned with pipe, check top or bottom hit
        if (player.y + 6 < obs.topHeight || player.y + player.height - 6 > obs.bottomY) {
          triggerGameOver();
        }
      }

      // Delete off-screen
      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
      }
    }

    // 2. Waffles
    for (let i = wafflesList.length - 1; i >= 0; i--) {
      const waf = wafflesList[i];
      waf.x -= gameSpeed;
      waf.pulse += 0.15;

      // Check pickup
      if (!waf.collected) {
        const pCenterX = player.x + player.width / 2;
        const pCenterY = player.y + player.height / 2;
        const dist = Math.hypot(pCenterX - waf.x, pCenterY - waf.y);
        
        if (dist < (player.width / 2 + waf.size / 2)) {
          waf.collected = true;
          waffles += 1;
          score += 5; // Eggos award extra score!
          updateHUD();
          playCrunch();
          wafflesList.splice(i, 1);
          continue;
        }
      }

      if (waf.x + waf.size < 0) {
        wafflesList.splice(i, 1);
      }
    }

    // 3. Portals
    for (let i = portalsList.length - 1; i >= 0; i--) {
      const port = portalsList[i];
      port.x -= gameSpeed;
      port.pulseAngle += 0.08;

      // Check trigger dimension swap when crossing player x
      if (!port.passed && port.x < player.x + player.width / 2) {
        port.passed = true;
        triggerDimensionSwap();
      }

      if (port.x + port.width < 0) {
        port.splice = true; // flag to clean
        portalsList.splice(i, 1);
      }
    }
  }

  // ============================================================
  // 8. CANVAS RENDER DRAWS
  // ============================================================
  function drawBackground() {
    // Canvas background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isUpsideDown) {
      // Upside Down: deep red/black ash colors
      grad.addColorStop(0, '#0a0101');
      grad.addColorStop(0.6, '#180404');
      grad.addColorStop(1, '#000000');
    } else {
      // Right Side Up: warm dusky retro sky
      grad.addColorStop(0, '#04010a');
      grad.addColorStop(0.5, '#0e051f');
      grad.addColorStop(1, '#270831');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background elements
    ctx.fillStyle = isUpsideDown ? '#090000' : '#020005';
    // Draw repeating ground hills/pine tree silhouettes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    // Dynamic parallax scroll ground hills
    const hillScroll = (gameFrame * 0.3) % 200;
    for (let x = -200; x < canvas.width + 200; x += 10) {
      const sx = x - hillScroll;
      // standard sine wave outline for forest hill
      const sy = canvas.height - 30 + Math.sin(x * 0.02) * 8 + Math.cos(x * 0.005) * 15;
      ctx.lineTo(sx, sy);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    // RSU Moon or USD Mind Flayer glowing eyes in the bg
    if (isUpsideDown) {
      // Draw creepy glowing eyes of the Shadow Monster
      const eyePulse = Math.sin(gameFrame * 0.04) * 2;
      ctx.fillStyle = '#ff1e27';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff1e27';
      
      // Left eye
      ctx.beginPath();
      ctx.ellipse(380, 110, 10 + eyePulse, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right eye
      ctx.beginPath();
      ctx.ellipse(440, 110, 10 + eyePulse, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0; // reset
    } else {
      // Draw bright glowing full moon
      ctx.fillStyle = '#ffeedd';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.arc(420, 80, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function drawObstacles() {
    obstacles.forEach(obs => {
      if (isUpsideDown) {
        // Biological biological red vines/tentacles
        ctx.fillStyle = '#660005';
        ctx.strokeStyle = '#e50914';
        ctx.lineWidth = 3;

        // Top Tentacle
        ctx.beginPath();
        ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
        ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight);
        // Draw fleshy pulsing pods/vines wrapping around it
        ctx.fillStyle = '#99000a';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.topHeight - 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bottom Tentacle
        ctx.fillStyle = '#660005';
        ctx.fillRect(obs.x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
        ctx.strokeRect(obs.x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
        
        ctx.fillStyle = '#99000a';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.bottomY + 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

      } else {
        // Right Side Up: Hawkins Lab gate barriers
        ctx.fillStyle = '#1e1b29';
        ctx.strokeStyle = '#3c2f54';
        ctx.lineWidth = 3;

        // Top barrier
        ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
        ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight);
        
        // Hazard warning yellow stripes
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(obs.x + 2, obs.topHeight - 16, obs.width - 4, 10);
        ctx.fillStyle = '#000000';
        for (let j = 0; j < obs.width; j += 12) {
          ctx.beginPath();
          ctx.moveTo(obs.x + j, obs.topHeight - 16);
          ctx.lineTo(obs.x + j + 6, obs.topHeight - 16);
          ctx.lineTo(obs.x + j + 2, obs.topHeight - 6);
          ctx.lineTo(obs.x + j - 4, obs.topHeight - 6);
          ctx.fill();
        }

        // Bottom barrier
        ctx.fillStyle = '#1e1b29';
        ctx.fillRect(obs.x, obs.bottomY, obs.width, canvas.height - obs.bottomY);
        ctx.strokeRect(obs.x, obs.bottomY, obs.width, canvas.height - obs.bottomY);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(obs.x + 2, obs.bottomY + 6, obs.width - 4, 10);
        ctx.fillStyle = '#000000';
        for (let j = 0; j < obs.width; j += 12) {
          ctx.beginPath();
          ctx.moveTo(obs.x + j, obs.bottomY + 6);
          ctx.lineTo(obs.x + j + 6, obs.bottomY + 6);
          ctx.lineTo(obs.x + j + 2, obs.bottomY + 16);
          ctx.lineTo(obs.x + j - 4, obs.bottomY + 16);
          ctx.fill();
        }
      }
    });
  }

  function drawWaffles() {
    wafflesList.forEach(waf => {
      // Gold Eggo Waffle design
      ctx.save();
      ctx.translate(waf.x, waf.y);
      const bobbing = Math.sin(waf.pulse) * 3;
      ctx.translate(0, bobbing);

      // Gold waffle circle
      ctx.fillStyle = '#f5b942';
      ctx.strokeStyle = '#996000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, waf.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Grid details
      ctx.strokeStyle = '#c68400';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-waf.size / 2 + 3, -3);
      ctx.lineTo(waf.size / 2 - 3, -3);
      ctx.moveTo(-waf.size / 2 + 2, 1);
      ctx.lineTo(waf.size / 2 - 2, 1);
      ctx.moveTo(-3, -waf.size / 2 + 3);
      ctx.lineTo(-3, waf.size / 2 - 3);
      ctx.moveTo(1, -waf.size / 2 + 2);
      ctx.lineTo(1, waf.size / 2 - 2);
      ctx.stroke();

      ctx.restore();
    });
  }

  function drawPortals() {
    portalsList.forEach(port => {
      ctx.save();
      ctx.translate(port.x + port.width / 2, port.y + port.height / 2);
      
      const widthScale = 1.0 + Math.sin(port.pulseAngle) * 0.15;
      
      // Draw Swirling glowing portal rift
      const portalGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, port.height / 2);
      portalGrad.addColorStop(0, '#ffffff');
      portalGrad.addColorStop(0.3, '#ff1e27');
      portalGrad.addColorStop(0.8, '#660000');
      portalGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = portalGrad;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff1e27';

      ctx.beginPath();
      ctx.ellipse(0, 0, (port.width / 2) * widthScale, port.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.shadowBlur = 0; // reset
    });
  }

  function drawGround() {
    // Cabin screen borders/soil outline
    ctx.fillStyle = '#0a0614';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    ctx.fillStyle = isUpsideDown ? '#ff1e27' : '#00f0ff';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 3);
  }

  // ============================================================
  // 9. CORE ENGINE LOOP
  // ============================================================
  function loop() {
    if (gameState !== 'PLAYING') return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hasStartedMoving) {
      gameFrame++;

      // Apply Player Physics
      player.vy += player.gravity;
      player.vy = Math.min(player.vy, 2.2); // Cap fall speed
      player.y += player.vy;

      // Angle rotation details
      if (player.vy < 0) {
        player.targetAngle = -0.3;
      } else {
        player.targetAngle = Math.min(player.targetAngle + 0.03, 0.7);
      }
      player.angle += (player.targetAngle - player.angle) * 0.12;

      // Bounds checks
      if (player.y < 0) {
        player.y = 0;
        player.vy = 0;
      }
      if (player.y + player.height > canvas.height - 10) {
        triggerGameOver();
      }

      // Logic
      spawnObstacles();
      updateEntities();
    } else {
      // Bobbing effect in place before the user starts
      player.y = 180 + Math.sin(Date.now() * 0.004) * 10;
      player.angle = Math.sin(Date.now() * 0.004) * 0.1;
    }

    // Draw everything
    drawBackground();
    if (hasStartedMoving) {
      drawPortals();
      drawObstacles();
      drawWaffles();
    }
    drawGround();

    // Draw selected Character Sprite
    // Player width 36px / 16 = size 2.25
    drawPixelSprite(ctx, selectedChar, player.x, player.y, 2.25, player.angle);

    // If game has not started moving, show text instruction overlay on canvas!
    if (!hasStartedMoving) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      
      // Pulsing effect for text
      const opacity = 0.5 + Math.sin(Date.now() * 0.007) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillText('PRESS UP / SPACE OR CLICK TO FLAP', canvas.width / 2, canvas.height / 2 + 50);
      ctx.restore();
    }

    animationId = requestAnimationFrame(loop);
  }

})();
