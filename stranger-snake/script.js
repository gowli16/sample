/**
 * STRANGER SNAKE — STANDALONE RETRO GAME
 * Stranger Things inspired Snake Game
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
    'v': '#9ca3af', // Grey/silver
    'o': '#ea580c'  // Orange (Max's hair / Will's vest)
  };

  const CHARACTERS = {
    eleven: {
      name: "ELEVEN",
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
    },
    will: {
      name: "WILL",
      pixels: [
        "....khhhhk......",
        "...khhhhhhhk....",
        "..khhsssshhk....",
        "..khsssssshk....",
        "..khsHssHshk....",
        "..khsssssshk....",
        "...kssssssk.....",
        "....kssssk......",
        "....krrrk.......",
        "...krorork......",
        "..krororork.....",
        ".krorororork....",
        "..kku...ukk.....",
        "...ks...sk......",
        "...kk...kk......",
        "................"
      ]
    },
    max: {
      name: "MAX",
      pixels: [
        "....kooook......",
        "...koooooook....",
        "..koossssoook...",
        "..kossssssok....",
        "..kosHssHsok....",
        "..kossssssok....",
        "..koossssook....",
        "...kssssssk.....",
        "...kyyyyyyk.....",
        "..kyyyyyyyyk....",
        ".kyyyyyyyyyyk...",
        ".kbbbbbbbbbbk...",
        "..kku...ukk.....",
        "...ks...sk......",
        "...kk...kk......",
        "................"
      ]
    },
    tentacleHead: {
      name: "MIND FLAYER",
      pixels: [
        ".....kkkkk......",
        "....krrrrrk.....",
        "...krrrrrrrk....",
        "..krrkkkkrrrk...",
        "..krkk..kkrrk...",
        "..krk.r.r.krk...",
        "..krk.....krk...",
        "..krrk...krrk...",
        "...krrkkkrrk....",
        "....krrrrrk.....",
        ".....kkkkk......",
        "................",
        "................",
        "................",
        "................",
        "................"
      ]
    },
    tentacleBody: {
      name: "TENTACLE",
      pixels: [
        ".....kkkkk......",
        "....krrrrrk.....",
        "...krrrrrrrk....",
        "..krrrrrrrrrk...",
        "..krrrrrrrrrk...",
        "..krrrrrrrrrk...",
        "..krrrrrrrrrk...",
        "..krrrrrrrrrk...",
        "...krrrrrrrk....",
        "....krrrrrk.....",
        ".....kkkkk......",
        "................",
        "................",
        "................",
        "................",
        "................"
      ]
    },
    demogorgon: {
      name: "DEMOGORGON",
      pixels: [
        ".....kkkkk......",
        "....krrrrrk.....",
        "...krwrrrwrk....",
        "..krwkkkkkwrk...",
        ".krwkkrrrkkwrk..",
        "krwkkrrkrrkkwrk.",
        "krwkkrkkkrkkwrk.",
        ".krwkkrrrkkwrk..",
        "..krwkkkkkwrk...",
        "...krwrrrwrk....",
        "....krrrrrk.....",
        ".....kvvvk......",
        "....kvvvvvk.....",
        "...kvkvvvkvk....",
        "..kvk.vvv.kvk...",
        "..kk..kkk..kk..."
      ]
    }
  };

  const CHARACTER_LIST = ['mike', 'eleven', 'dustin', 'lucas', 'will', 'max', 'steve', 'hopper'];

  // Game Grid Config
  const GRID_SIZE = 20; // 20 cells wide, 20 cells tall
  const CELL_PX = 20;   // 20x20 pixels per cell (total 400x400 canvas)

  // Variables
  let canvas, ctx;
  let ambientCanvas, ambientCtx;
  let isMuted = true;
  let isUpsideDown = false;
  let gameState = 'SELECT'; // 'SELECT', 'PLAYING', 'GAMEOVER'
  let score = 1; // Snake size
  let bestScore = 0;
  let waffles = 0;

  // Snake Entity
  let snake = [];
  let dx = 0;
  let dy = -1; // Moving UP initially
  let nextDx = 0;
  let nextDy = -1;

  // Food / Portal
  let food = { x: 0, y: 0 };
  let portal = { x: 0, y: 0, active: false };

  // Timing
  let gameIntervalId = null;
  let showcaseIntervalId = null;
  let gameFrame = 0;

  // Audio Context
  let audioCtx = null;
  let masterGain = null;
  let bgmIntervalId = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let lfoOsc = null;
  let isBGMActive = false;

  // Ambient Particles
  let ambientParticles = [];

  // Demogorgons active in the game
  let demogorgons = [];

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

    bestScore = parseInt(localStorage.getItem('stranger_snake_best') || '1', 10);

    // Initial Menu Showcase
    startShowcase();
    initAmbientParticles();
    animateAmbient();

    // Button Bindings
    document.getElementById('btn-start-game').addEventListener('click', startGame);
    document.getElementById('btn-retry').addEventListener('click', startGame);
    document.getElementById('btn-menu').addEventListener('click', showMainMenu);
    document.getElementById('btn-mute').addEventListener('click', toggleMute);
    
    // Help modal
    const infoModal = document.getElementById('info-modal');
    document.getElementById('btn-info').addEventListener('click', () => {
      infoModal.classList.remove('hidden');
      playBeep(400, 0.08, 'triangle');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      infoModal.classList.add('hidden');
      playBeep(300, 0.08, 'triangle');
    });

    // Keyboard bindings for Snake direction changes
    window.addEventListener('keydown', (e) => {
      if (gameState === 'PLAYING') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'w', 's', 'a', 'd'].includes(e.key)) {
          e.preventDefault();
          handleDirectionInput(e.key);
        }
      }
      if (e.key === 'Escape') {
        infoModal.classList.add('hidden');
      }
    });

    // Touch support (Swiping)
    let touchStartX = 0;
    let touchStartY = 0;
    canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (gameState !== 'PLAYING') return;
      e.preventDefault(); // Prevent scrolling while playing
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      if (gameState !== 'PLAYING') return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      const threshold = 30; // Minimum swipe distance in px
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            handleDirectionInput('ArrowRight');
          } else {
            handleDirectionInput('ArrowLeft');
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > threshold) {
          if (diffY > 0) {
            handleDirectionInput('ArrowDown');
          } else {
            handleDirectionInput('ArrowUp');
          }
        }
      }
    }, { passive: true });
  });

  function resizeCanvas() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }

  // ============================================================
  // 2. PIXEL ART DRAWING SYSTEM
  // ============================================================
  function drawPixelSprite(ctx, charKey, x, y, size = 1.25, angle = 0) {
    const char = CHARACTERS[charKey];
    if (!char) return;

    ctx.save();
    const spriteSize = 16 * size;
    // Translate to center of cell
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

  // Showcase on start menu (animates kids in a small row)
  function startShowcase() {
    const showCanvas = document.getElementById('showcase-canvas');
    const sCtx = showCanvas.getContext('2d');
    let xOffset = 0;

    if (showcaseIntervalId) clearInterval(showcaseIntervalId);
    
    showcaseIntervalId = setInterval(() => {
      sCtx.clearRect(0, 0, showCanvas.width, showCanvas.height);
      
      // Draw grid line
      sCtx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      sCtx.beginPath();
      sCtx.moveTo(0, 50);
      sCtx.lineTo(showCanvas.width, 50);
      sCtx.stroke();

      xOffset = (xOffset + 1) % 320;

      // Draw all 8 characters walking in a line
      CHARACTER_LIST.forEach((key, index) => {
        const cx = (xOffset - index * 32) % 340 - 40;
        if (cx > -20 && cx < showCanvas.width) {
          // Bobbing walk effect
          const bob = Math.sin((xOffset * 0.15) - index) * 3;
          drawPixelSprite(sCtx, key, cx, 15 + bob, 2.0, 0);
        }
      });
    }, 50);
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
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playCrunch() {
    if (!audioCtx || isMuted) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function playCrash() {
    if (!audioCtx || isMuted) return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.35);
      
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
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(isUpsideDown ? 150 : 750, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isUpsideDown ? 750 : 150, audioCtx.currentTime + 0.7);
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch (e) {}
  }

  // Synthesizer background music loops
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

    // Arpeggiated Stranger Things style bassline
    const notes = [
      65.41, 82.41, 98.00, 123.47, 130.81, 123.47, 98.00, 82.41, // C - E - G - B - C - B - G - E arpeggio
      73.42, 92.50, 110.00, 138.59, 146.83, 138.59, 110.00, 92.50 // D - F# - A - C#...
    ];
    let noteIndex = 0;
    const tempo = 125;
    const noteDuration = 60 / tempo / 2; // 8th note duration (240ms)

    bgmIntervalId = setInterval(() => {
      if (isMuted || !isBGMActive || isUpsideDown) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[noteIndex], audioCtx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, audioCtx.currentTime);
        filter.Q.setValueAtTime(2.5, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
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
      droneOsc1.frequency.setValueAtTime(48.99, audioCtx.currentTime); // G1
      
      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(49.4, audioCtx.currentTime); // Beating pitch

      lfoOsc.frequency.setValueAtTime(0.15, audioCtx.currentTime); // 6.5 second sweep
      lfoGain.gain.setValueAtTime(50, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, audioCtx.currentTime);

      droneGain.gain.setValueAtTime(isMuted ? 0 : 0.22, audioCtx.currentTime);

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
      if (masterGain) masterGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
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
    const count = 50;
    for (let i = 0; i < count; i++) {
      ambientParticles.push({
        x: Math.random() * ambientCanvas.width,
        y: Math.random() * ambientCanvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.1,
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
        p.y -= p.speedY * 0.8;
        p.x += Math.sin(p.y * 0.02) * 0.2 + p.speedX;
      } else {
        p.y += p.speedY;
        p.x += p.speedX;
      }

      p.alpha += p.pulse;
      if (p.alpha > 0.75 || p.alpha < 0.15) {
        p.pulse = -p.pulse;
      }

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
  // 5. DIRECTION INPUT HANDLERS
  // ============================================================
  function handleDirectionInput(key) {
    let newDx = dx;
    let newDy = dy;

    // Direct translation: In Upside Down, screen is physically 180-deg rotated.
    // If the screen is rotated, the canvas coordinates are flipped relative to the user's view.
    // To keep controls aligned with visual directions, we invert the coordinate changes when isUpsideDown is true:
    // e.g. Pressing UP visually moves up. In inverted canvas y direction, visual up is +1.
    if (key === 'ArrowUp' || key === 'w' || key === 'W') {
      newDx = 0;
      newDy = isUpsideDown ? 1 : -1;
    } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
      newDx = 0;
      newDy = isUpsideDown ? -1 : 1;
    } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
      newDx = isUpsideDown ? 1 : -1;
      newDy = 0;
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
      newDx = isUpsideDown ? -1 : 1;
      newDy = 0;
    }

    // Prevent immediate reverse turns (e.g. going left can't turn right)
    // Compare with the actual current moving direction to avoid reversing into tail
    if (newDx !== -dx && newDy !== -dy) {
      nextDx = newDx;
      nextDy = newDy;
      playBeep(800, 0.03, 'sine');
    }
  }

  // ============================================================
  // 6. GAME CONTROL ENGINE
  // ============================================================
  function startGame() {
    initAudio();

    if (showcaseIntervalId) {
      clearInterval(showcaseIntervalId);
      showcaseIntervalId = null;
    }

    // Reset Snake to center, length 3
    snake = [
      { x: 10, y: 10 }, // Head
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];

    dx = 0;
    dy = -1;
    nextDx = 0;
    nextDy = -1;

    score = 3;
    waffles = 0;
    gameFrame = 0;
    isUpsideDown = false;
    portal.active = false;
    demogorgons = [];

    // Reset rotation class
    document.getElementById('arcade-screen').classList.remove('rotated-screen');
    document.body.classList.remove('upside-down-active');

    const dimInd = document.getElementById('dimension-indicator');
    dimInd.innerText = "RIGHT SIDE UP";
    dimInd.className = "dimension-status rsu font-pixel";

    updateHUD();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    gameState = 'PLAYING';

    spawnWaffle();

    playBeep(450, 0.12, 'sawtooth');
    if (!isMuted) {
      startBGM();
    }

    // Start tick runner
    runGameTick();
  }

  function runGameTick() {
    if (gameIntervalId) clearTimeout(gameIntervalId);
    
    if (gameState !== 'PLAYING') return;

    tick();
    
    // Slow, accessible game tick pace: 220ms base speed, slightly increasing
    const delay = Math.max(220 - (score - 3) * 2, 130);
    gameIntervalId = setTimeout(runGameTick, delay);
  }

  function triggerGameOver() {
    gameState = 'GAMEOVER';
    stopBGM();
    playCrash();

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('stranger_snake_best', bestScore);
    }

    // Reset rotated screen class so layout is straight on game over
    document.getElementById('arcade-screen').classList.remove('rotated-screen');
    document.body.classList.remove('upside-down-active');

    document.getElementById('final-score').innerText = padScore(score);
    document.getElementById('final-waffles').innerText = padScore(waffles);
    document.getElementById('best-score').innerText = padScore(bestScore);
    
    document.getElementById('game-over-screen').classList.remove('hidden');

    // Trigger visual feedback shake
    document.body.classList.add('upside-down-active');
    setTimeout(() => {
      document.body.classList.remove('upside-down-active');
    }, 450);
  }

  function showMainMenu() {
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    gameState = 'SELECT';
    stopBGM();
    startShowcase();
    playBeep(350, 0.08, 'sine');
  }

  function updateHUD() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-waffles').innerText = waffles;
  }

  function padScore(num) {
    return num.toString().padStart(2, '0');
  }

  // ============================================================
  // 7. REALITY WARPING (DIMENSION TRANSITIONS)
  // ============================================================
  function spawnPortal() {
    // Spawns a portal on a vacant cell
    let attempts = 0;
    while (attempts < 100) {
      const px = Math.floor(Math.random() * GRID_SIZE);
      const py = Math.floor(Math.random() * GRID_SIZE);
      
      // Keep away from boundary and snake
      const onSnake = snake.some(seg => seg.x === px && seg.y === py);
      if (!onSnake && px > 1 && px < GRID_SIZE - 2 && py > 1 && py < GRID_SIZE - 2) {
        portal.x = px;
        portal.y = py;
        portal.active = true;
        break;
      }
      attempts++;
    }

    // Transition immediately to the Upside Down!
    isUpsideDown = true;
    playWarpSound();

    // Trigger screen visual rotation
    document.getElementById('arcade-screen').classList.add('rotated-screen');
    document.body.classList.add('upside-down-active');
    setTimeout(() => {
      document.body.classList.remove('upside-down-active');
    }, 450);

    const indicator = document.getElementById('dimension-indicator');
    indicator.innerText = "THE UPSIDE DOWN";
    indicator.className = "dimension-status usd font-pixel";

    // Change ambient particles color
    for (let i = 0; i < ambientParticles.length; i++) {
      ambientParticles[i].color = 'rgba(230, 20, 10, ';
    }

    if (!isMuted) {
      startBGM();
    }
  }

  function closePortal() {
    portal.active = false;
    isUpsideDown = false;
    playWarpSound();

    // Undo visual rotation
    document.getElementById('arcade-screen').classList.remove('rotated-screen');
    document.body.classList.add('upside-down-active');
    setTimeout(() => {
      document.body.classList.remove('upside-down-active');
    }, 450);

    const indicator = document.getElementById('dimension-indicator');
    indicator.innerText = "RIGHT SIDE UP";
    indicator.className = "dimension-status rsu font-pixel";

    // Restore particles
    for (let i = 0; i < ambientParticles.length; i++) {
      ambientParticles[i].color = 'rgba(0, 240, 255, ';
    }

    if (!isMuted) {
      startBGM();
    }

    // Re-spawn regular waffle
    spawnWaffle();
  }

  // ============================================================
  // 8. ENTITIES SPAWNING & COORDINATES
  // ============================================================
  function spawnWaffle() {
    let attempts = 0;
    while (attempts < 100) {
      const fx = Math.floor(Math.random() * GRID_SIZE);
      const fy = Math.floor(Math.random() * GRID_SIZE);
      
      const onSnake = snake.some(seg => seg.x === fx && seg.y === fy);
      const onPortal = portal.active && portal.x === fx && portal.y === fy;
      const onDemogorgon = demogorgons.some(d => d.x === fx && d.y === fy);

      if (!onSnake && !onPortal && !onDemogorgon) {
        food.x = fx;
        food.y = fy;
        break;
      }
      attempts++;
    }
  }

  // Spawns a Demogorgon in an empty cell
  function spawnDemogorgon() {
    let attempts = 0;
    while (attempts < 100) {
      const gx = Math.floor(Math.random() * GRID_SIZE);
      const gy = Math.floor(Math.random() * GRID_SIZE);
      
      const onSnake = snake.some(seg => seg.x === gx && seg.y === gy);
      const onFood = food.x === gx && food.y === gy;
      const onPortal = portal.active && portal.x === gx && portal.y === gy;
      const onDemogorgon = demogorgons.some(d => d.x === gx && d.y === gy);

      if (!onSnake && !onFood && !onPortal && !onDemogorgon) {
        demogorgons.push({
          x: gx,
          y: gy,
          ticksLeft: 42, // total ticks (approx 9 seconds at 220ms)
          isWarning: true
        });
        break;
      }
      attempts++;
    }
  }

  // Updates Demogorgon positions, warning timers, and checks collision
  function updateDemogorgons(head) {
    // Spawn Demogorgons periodically. Spawn rate increases in the Upside Down!
    const spawnRate = isUpsideDown ? 18 : 32;
    if (gameFrame % spawnRate === 0 && gameFrame > 15) {
      spawnDemogorgon();
    }

    for (let i = demogorgons.length - 1; i >= 0; i--) {
      const d = demogorgons[i];
      d.ticksLeft--;

      // Warning duration is 6 ticks (approx 1.3 seconds)
      if (d.isWarning && d.ticksLeft <= 36) {
        d.isWarning = false;
        playBeep(240, 0.08, 'triangle'); // Spawn roar blip
      }

      // Slowly track player: move 1 cell closer to snake head every 3 ticks once active
      if (!d.isWarning && d.ticksLeft % 3 === 0) {
        const diffX = head.x - d.x;
        const diffY = head.y - d.y;
        if (Math.abs(diffX) > Math.abs(diffY)) {
          d.x += Math.sign(diffX);
        } else if (Math.abs(diffY) > 0) {
          d.y += Math.sign(diffY);
        }
      }

      // Check collision with snake head (only if active!)
      if (!d.isWarning && d.x === head.x && d.y === head.y) {
        triggerGameOver();
        return;
      }

      // Check collision with the rest of the snake
      const hitSnake = snake.some(seg => !d.isWarning && seg.x === d.x && seg.y === d.y);
      if (hitSnake) {
        triggerGameOver();
        return;
      }

      // Remove after duration
      if (d.ticksLeft <= 0) {
        demogorgons.splice(i, 1);
      }
    }
  }

  // ============================================================
  // 9. GAME ENGINE CORE TICK
  // ============================================================
  function tick() {
    gameFrame++;

    // Update actual moving direction
    dx = nextDx;
    dy = nextDy;

    // Calculate new head position
    const head = snake[0];
    const newHead = {
      x: head.x + dx,
      y: head.y + dy
    };

    // 1. Check Wall collisions
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      triggerGameOver();
      return;
    }

    // 2. Check Self collisions (tail)
    // Don't crash into the tail segment if it's going to move (but since snake grows or slides, we check all parts except tail-end if not eating)
    const hitSelf = snake.some((seg, idx) => idx > 0 && seg.x === newHead.x && seg.y === newHead.y);
    if (hitSelf) {
      triggerGameOver();
      return;
    }

    // 3. Move snake (insert new head)
    snake.unshift(newHead);

    // Update and check Demogorgon collisions
    updateDemogorgons(newHead);
    if (gameState !== 'PLAYING') return;

    // 4. Check food collisions
    let ateFood = false;
    
    // In Right Side Up, you eat Waffles. In Upside Down, you only focus on reaching the Portal,
    // but we can let waffles float or spawn organic meat/spores.
    // Let's say if you eat food, you grow. But if portal is active, food is disabled or becomes spore
    if (newHead.x === food.x && newHead.y === food.y && !portal.active) {
      ateFood = true;
      waffles++;
      score++;
      updateHUD();
      playCrunch();

      // Trigger Portal spawn 25% of the time after eating a waffle (or when score is divisible by 4)
      if (score > 3 && score % 4 === 0 && Math.random() < 0.6) {
        spawnPortal();
      } else {
        spawnWaffle();
      }
    }

    // 5. Check Portal collision
    if (portal.active && newHead.x === portal.x && newHead.y === portal.y) {
      // Escape the Upside Down!
      ateFood = true; // don't shrink snake segment
      score++;        // Grow snake caravan for escaping!
      updateHUD();
      closePortal();
    }

    // If we didn't eat food/portal, remove the tail end segment (classic snake movement sliding)
    if (!ateFood) {
      snake.pop();
    }

    // Render current grid
    draw();
  }

  // ============================================================
  // 10. GRID RENDER DRAW DRAWS
  // ============================================================
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Grid Background
    ctx.fillStyle = isUpsideDown ? '#090101' : '#03010b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = isUpsideDown ? 'rgba(255, 30, 39, 0.05)' : 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      // Vertical
      ctx.beginPath();
      ctx.moveTo(i * CELL_PX, 0);
      ctx.lineTo(i * CELL_PX, canvas.height);
      ctx.stroke();

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_PX);
      ctx.lineTo(canvas.width, i * CELL_PX);
      ctx.stroke();
    }

    // 2. Draw Portal (if active)
    if (portal.active) {
      ctx.save();
      const px = portal.x * CELL_PX;
      const py = portal.y * CELL_PX;
      ctx.translate(px + CELL_PX / 2, py + CELL_PX / 2);
      
      // Swirling portal circle
      const scale = 1.0 + Math.sin(gameFrame * 0.3) * 0.15;
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, CELL_PX);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#ff1e27');
      grad.addColorStop(0.9, '#450000');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff1e27';
      ctx.beginPath();
      ctx.arc(0, 0, (CELL_PX / 2 + 2) * scale, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    // 3. Draw Waffle Food (if portal not active)
    if (!portal.active) {
      const fx = food.x * CELL_PX + CELL_PX / 2;
      const fy = food.y * CELL_PX + CELL_PX / 2;
      
      ctx.save();
      ctx.translate(fx, fy);
      
      // Waffle gold circle
      ctx.fillStyle = '#f5b942';
      ctx.strokeStyle = '#996000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Grid line details
      ctx.strokeStyle = '#c68400';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-6, -2); ctx.lineTo(6, -2);
      ctx.moveTo(-5, 2); ctx.lineTo(5, 2);
      ctx.moveTo(-2, -6); ctx.lineTo(-2, 6);
      ctx.moveTo(2, -5); ctx.lineTo(2, 5);
      ctx.stroke();
      ctx.restore();
    }

    // 3.5. Draw Demogorgons
    demogorgons.forEach(d => {
      const dx = d.x * CELL_PX;
      const dy = d.y * CELL_PX;

      if (d.isWarning) {
        // Draw a flashing warning box
        ctx.save();
        const flash = Math.floor(gameFrame / 3) % 2 === 0;
        ctx.fillStyle = flash ? 'rgba(255, 30, 39, 0.5)' : 'rgba(255, 30, 39, 0.1)';
        ctx.strokeStyle = '#ff1e27';
        ctx.lineWidth = 1.5;
        
        ctx.fillRect(dx + 2, dy + 2, CELL_PX - 4, CELL_PX - 4);
        ctx.strokeRect(dx + 2, dy + 2, CELL_PX - 4, CELL_PX - 4);
        
        // Exclamation mark
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', dx + CELL_PX / 2, dy + CELL_PX / 2 + 1);
        ctx.restore();
      } else {
        // Draw active Demogorgon sprite
        drawPixelSprite(ctx, 'demogorgon', dx, dy, 1.25, 0);
      }
    });

    // 4. Draw Snake Chain
    snake.forEach((seg, idx) => {
      const sx = seg.x * CELL_PX;
      const sy = seg.y * CELL_PX;

      if (isUpsideDown) {
        // Upside Down: Snake becomes a fleshy Mind Flayer tentacle
        const isHead = (idx === 0);
        drawPixelSprite(ctx, isHead ? 'tentacleHead' : 'tentacleBody', sx, sy, 1.25, 0);
      } else {
        // Right Side Up: Caravan of kids
        // Head has Mike (or leader), following segments have different characters
        const charKey = CHARACTER_LIST[idx % CHARACTER_LIST.length];
        
        // Calculate dynamic tilt angle of character sprite based on moving direction
        let angle = 0;
        if (dx === 1) angle = Math.PI / 2;       // Right
        if (dx === -1) angle = -Math.PI / 2;     // Left
        if (dy === 1) angle = Math.PI;           // Down
        if (dy === -1) angle = 0;                 // Up
        
        drawPixelSprite(ctx, charKey, sx, sy, 1.25, angle);
      }
    });

    // 5. Draw border alerts in Upside Down
    if (isUpsideDown) {
      ctx.strokeStyle = '#ff1e27';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Lightning flash occasionally (2% chance)
      if (Math.random() < 0.03) {
        ctx.fillStyle = 'rgba(255, 30, 39, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        playBeep(60, 0.1, 'sawtooth'); // Deep thunder rumble
      }
    }
  }

})();
