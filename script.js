/**
 * GLITCH — ACM Amrita Game Dev SIG
 * Stranger Things × Retro Arcade Website Orchestrator (SNES Start Screen Edition)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Global variables
    let isMuted = true;
    let isUpsideDown = false;
    let audioInitialized = false;
    let currentLevel = 1;
    let activeMenuIndex = 0;

    // Elements
    const body = document.body;
    const cursor = document.getElementById('custom-cursor');
    const cursorRing = document.getElementById('custom-cursor-ring');
    const heroSceneInner = document.getElementById('hero-scene-inner');
    
    // Bottom HUD Elements
    const hudWaffleCount = document.getElementById('hud-waffle-count');
    const hudScoreVal = document.getElementById('hud-score-val');
    const hudCurrentLevel = document.getElementById('hud-current-level');
    const hudGateStatus = document.getElementById('hud-gate-status');
    
    const heartsArjun = document.getElementById('hearts-arjun');
    const heartsMeera = document.getElementById('hearts-meera');
    const heartsKarthik = document.getElementById('hearts-karthik');
    const heartsPriya = document.getElementById('hearts-priya');

    // ============================================================
    // 1. CUSTOM RETRO CURSOR
    // ============================================================
    if (cursor && cursorRing) {
      document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.03 });
        gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.12 });
      });

      document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
      });

      const addHoverListeners = () => {
        const interactives = document.querySelectorAll('a, button, .arcade-cabinet, .character-card, .menu-item, .hud-char-box');
        interactives.forEach(el => {
          el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
          el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
        });
      };
      addHoverListeners();

      const observer = new MutationObserver(addHoverListeners);
      observer.observe(body, { childList: true, subtree: true });
    }

    // ============================================================
    // 2. BACKGROUND STARFIELD / SPORES
    // ============================================================
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
      const ctx = bgCanvas.getContext('2d');
      let particles = [];
      const particleCount = 100;
      let width = (bgCanvas.width = window.innerWidth);
      let height = (bgCanvas.height = window.innerHeight);

      class Particle {
        constructor() {
          this.reset();
        }

        reset() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.size = Math.random() * 2 + 1;
          this.speedY = Math.random() * 0.3 + 0.1;
          this.speedX = (Math.random() - 0.5) * 0.15;
          this.alpha = Math.random() * 0.6 + 0.2;
          this.pulse = Math.random() * 0.02 + 0.005;
          this.color = this.getRandomColor();
        }

        getRandomColor() {
          if (isUpsideDown) {
            const red = Math.floor(Math.random() * 130) + 125; // Red-orange embers
            return `rgba(${red}, 15, 5, `;
          } else {
            return Math.random() < 0.6 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
          }
        }

        update() {
          if (isUpsideDown) {
            // Floating spores drifting up
            this.y -= this.speedY * 0.7;
            this.x += Math.sin(this.y * 0.015) * 0.35 + this.speedX;
          } else {
            // Stars drifting down
            this.y += this.speedY;
            this.x += this.speedX;
          }

          this.alpha += this.pulse;
          if (this.alpha > 0.85 || this.alpha < 0.15) {
            this.pulse = -this.pulse;
          }

          if (this.y < 0 || this.y > height || this.x < 0 || this.x > width) {
            this.reset();
            this.y = isUpsideDown ? height : 0;
          }
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color + Math.max(0.1, Math.min(1, this.alpha)) + ')';
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      const updateParticleColors = () => {
        particles.forEach(p => p.color = p.getRandomColor());
      };

      const animateParticles = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        requestAnimationFrame(animateParticles);
      };
      animateParticles();

      window.addEventListener('resize', () => {
        width = bgCanvas.width = window.innerWidth;
        height = bgCanvas.height = window.innerHeight;
      });
    }

    // ============================================================
    // 3. WEB AUDIO SYNTH MUSIC & SFX
    // ============================================================
    let audioCtx = null;
    let masterGain = null;
    let bgiOscillator = null;
    let bgiOscillator2 = null;
    let isPlayingBGM = false;
    let bgmIntervalId = null;

    const initAudio = () => {
      if (audioInitialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(isMuted ? 0 : 0.25, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
        audioInitialized = true;
      } catch (err) {
        console.warn("Web Audio API not supported", err);
      }
    };

    const playBeep = () => {
      if (!audioInitialized || isMuted) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    };

    const playExplosion = () => {
      if (!audioInitialized || isMuted) return;
      const bufferSize = audioCtx.sampleRate * 0.3;
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
      filter.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.25);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      noise.start();
      noise.stop(audioCtx.currentTime + 0.3);
    };

    const playPortalOpen = () => {
      if (!audioInitialized || isMuted) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.7);
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    };

    const playPowerUp = () => {
      if (!audioInitialized || isMuted) return;
      const now = audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.1, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.005, now + (i + 1) * 0.07);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.07);
        osc.stop(now + (i + 1.2) * 0.07);
      });
    };

    const playGameOver = () => {
      if (!audioInitialized || isMuted) return;
      const now = audioCtx.currentTime;
      const notes = [440, 392, 349.23, 293.66];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        gain.gain.setValueAtTime(0.18, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.005, now + (i + 1) * 0.15 + 0.08);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.15);
        osc.stop(now + (i + 1) * 0.15 + 0.08);
      });
    };

    const startBGM = () => {
      if (!audioInitialized || isPlayingBGM) return;
      isPlayingBGM = true;
      scheduleBGM();
    };

    const stopBGM = () => {
      isPlayingBGM = false;
      if (bgmIntervalId) {
        clearInterval(bgmIntervalId);
        bgmIntervalId = null;
      }
      if (bgiOscillator) {
        try { bgiOscillator.stop(); } catch(e){}
        bgiOscillator = null;
      }
      if (bgiOscillator2) {
        try { bgiOscillator2.stop(); } catch(e){}
        bgiOscillator2 = null;
      }
    };

    const scheduleBGM = () => {
      if (!isPlayingBGM) return;

      if (isUpsideDown) {
        // Upside Down: Low Ominous Drone
        if (bgmIntervalId) clearInterval(bgmIntervalId);

        bgiOscillator = audioCtx.createOscillator();
        bgiOscillator2 = audioCtx.createOscillator();
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        const droneGain = audioCtx.createGain();

        bgiOscillator.type = 'sawtooth';
        bgiOscillator.frequency.setValueAtTime(45, audioCtx.currentTime); // F#1
        bgiOscillator2.type = 'sawtooth';
        bgiOscillator2.frequency.setValueAtTime(45.6, audioCtx.currentTime); // Beating detune

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, audioCtx.currentTime);

        lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime); // 5-second cycle
        lfoGain.gain.setValueAtTime(80, audioCtx.currentTime);

        droneGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        bgiOscillator.connect(filter);
        bgiOscillator2.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(masterGain);

        bgiOscillator.start();
        bgiOscillator2.start();
        lfo.start();
      } else {
        // Right Side Up: Looping 8th-note Synthwave Bassline
        if (bgiOscillator) { bgiOscillator.stop(); bgiOscillator = null; }
        if (bgiOscillator2) { bgiOscillator2.stop(); bgiOscillator2 = null; }

        const tempo = 120;
        const noteDuration = 60 / tempo / 2; // 8th note
        const notes = [
          130.81, 196.00, 261.63, 196.00,
          146.83, 220.00, 293.66, 220.00,
          164.81, 246.94, 329.63, 246.94,
          130.81, 196.00, 261.63, 196.00
        ];
        let index = 0;

        bgmIntervalId = setInterval(() => {
          if (isMuted || !isPlayingBGM) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          osc.type = 'square';
          osc.frequency.setValueAtTime(notes[index], audioCtx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, audioCtx.currentTime);
          filter.Q.setValueAtTime(3, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + noteDuration - 0.02);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start();
          osc.stop(audioCtx.currentTime + noteDuration);

          index = (index + 1) % notes.length;
        }, noteDuration * 1000);
      }
    };

    // ============================================================
    // 4. RETRO SNES MENU CONTROLLER
    // ============================================================
    const menuItems = document.querySelectorAll('.snes-menu .menu-item');
    
    const updateMenuSelection = (index) => {
      menuItems.forEach((item, idx) => {
        if (idx === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      playBeep();
    };

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      // Trigger navigation only when home section is primarily active
      if (window.scrollY < 200) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          activeMenuIndex = (activeMenuIndex - 1 + menuItems.length) % menuItems.length;
          updateMenuSelection(activeMenuIndex);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          activeMenuIndex = (activeMenuIndex + 1) % menuItems.length;
          updateMenuSelection(activeMenuIndex);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          triggerMenuAction(activeMenuIndex);
        }
      }
    });

    // Mouse hovering over menu items
    menuItems.forEach((item, idx) => {
      item.addEventListener('mouseenter', () => {
        activeMenuIndex = idx;
        menuItems.forEach((el, index) => {
          if (index === idx) el.classList.add('active');
          else el.classList.remove('active');
        });
        playBeep();
      });

      item.addEventListener('click', () => {
        triggerMenuAction(idx);
      });
    });

    const triggerMenuAction = (index) => {
      initAudio();
      
      // Auto turn on sound if click option or start
      if (isMuted) {
        isMuted = false;
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) soundBtn.innerText = "♪ Sound: On";
        if (masterGain) masterGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        startBGM();
      }

      if (index === 0) {
        // 1 PLAYER -> Scrolls down to About Section
        playPortalOpen();
        const aboutSec = document.getElementById('about');
        if (aboutSec) {
          gsap.to(window, {
            scrollTo: { y: aboutSec, offsetY: 40 },
            duration: 1.5,
            ease: 'power3.inOut'
          });
        }
      } else if (index === 1) {
        // 2 PLAYERS -> Scrolls down to Join Us / Rift Section
        playPortalOpen();
        const riftSec = document.getElementById('rift');
        if (riftSec) {
          gsap.to(window, {
            scrollTo: { y: riftSec, offsetY: 40 },
            duration: 1.8,
            ease: 'power3.inOut'
          });
        }
      } else if (index === 2) {
        // OPTIONS -> Directly triggers dimension gate swap
        swapDimension();
      }
    };

    // ============================================================
    // 5. DIMENSION SWAP SYSTEM (Right Side Up ↔ Upside Down)
    // ============================================================
    const swapDimension = () => {
      initAudio();
      isUpsideDown = !isUpsideDown;

      // 1. Trigger camera sliding track inside Hero Viewport
      if (heroSceneInner) {
        gsap.to(heroSceneInner, {
          yPercent: isUpsideDown ? -50 : 0,
          duration: 1.4,
          ease: 'power3.inOut'
        });
      }

      // 2. Fullscreen flash & screen shake
      body.classList.add('shaking');
      const flash = document.createElement('div');
      flash.className = 'dimension-flash';
      body.appendChild(flash);

      setTimeout(() => {
        body.classList.remove('shaking');
        flash.remove();
      }, 600);

      // 3. Play audio swoosh
      playPortalOpen();

      // 4. Swap body theme class
      if (isUpsideDown) {
        body.classList.add('upside-down');
        // HUD text & state modifications
        if (hudGateStatus) {
          hudGateStatus.innerText = "OPEN";
          hudGateStatus.style.color = '#ff1e27';
        }
        if (hudWaffleCount) hudWaffleCount.innerText = "11"; // Glitched values
        if (hudScoreVal) hudScoreVal.innerText = "666666";

        // Hearts drainage
        if (heartsArjun) heartsArjun.innerText = "♥♥♡♡";
        if (heartsMeera) heartsMeera.innerText = "♥♡♡♡";
        if (heartsKarthik) heartsKarthik.innerText = "♥♥♥♡";
        if (heartsPriya) heartsPriya.innerText = "♥♥♡♡";

        if (bgCanvas && typeof updateParticleColors === 'function') {
          updateParticleColors();
        }
      } else {
        body.classList.remove('upside-down');
        if (hudGateStatus) {
          hudGateStatus.innerText = "CLOSED";
          hudGateStatus.style.color = 'var(--accent-2)';
        }
        if (hudWaffleCount) hudWaffleCount.innerText = "08";
        if (hudScoreVal) hudScoreVal.innerText = "011611";

        // Full hearts restored
        if (heartsArjun) heartsArjun.innerText = "♥♥♥♥";
        if (heartsMeera) heartsMeera.innerText = "♥♥♥♥";
        if (heartsKarthik) heartsKarthik.innerText = "♥♥♥♥";
        if (heartsPriya) heartsPriya.innerText = "♥♥♥♥";

        if (bgCanvas && typeof updateParticleColors === 'function') {
          updateParticleColors();
        }
      }

      // 5. Swap Ambient audio loops
      if (isPlayingBGM) {
        stopBGM();
        isPlayingBGM = true;
        scheduleBGM();
      }
    };

    // Sound toggle control hook (if HUD has it)
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        initAudio();
        isMuted = !isMuted;
        soundToggle.innerText = isMuted ? "♪ Sound: Off" : "♪ Sound: On";
        if (masterGain) {
          masterGain.gain.setValueAtTime(isMuted ? 0 : 0.25, audioCtx.currentTime);
        }
        if (!isMuted) {
          playBeep();
          if (!isPlayingBGM) startBGM();
        }
      });
    }

    const dimensionToggle = document.getElementById('dimension-toggle-btn');
    if (dimensionToggle) {
      dimensionToggle.addEventListener('click', swapDimension);
    }

    // ============================================================
    // 6. UPSIDE DOWN LIGHTNING CANVAS
    // ============================================================
    const lightCanvas = document.getElementById('lightning-canvas');
    if (lightCanvas) {
      const lCtx = lightCanvas.getContext('2d');
      let lWidth = (lightCanvas.width = lightCanvas.parentElement.clientWidth);
      let lHeight = (lightCanvas.height = lightCanvas.parentElement.clientHeight);

      let lightningTimer = 0;

      const drawLightning = () => {
        if (!isUpsideDown) {
          lCtx.clearRect(0, 0, lWidth, lHeight);
          return;
        }

        lCtx.fillStyle = 'rgba(13, 1, 1, 0.15)'; // Slowly fade
        lCtx.fillRect(0, 0, lWidth, lHeight);

        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.02) {
          lightningTimer = 0;
          
          // Flash effect
          lCtx.fillStyle = 'rgba(255, 30, 39, 0.4)';
          lCtx.fillRect(0, 0, lWidth, lHeight);

          // Draw branches
          lCtx.strokeStyle = '#ffffff';
          lCtx.lineWidth = Math.random() * 3 + 1;
          lCtx.shadowBlur = 15;
          lCtx.shadowColor = '#ff1e27';

          let curX = Math.random() * lWidth * 0.6 + lWidth * 0.2;
          let curY = 0;
          lCtx.beginPath();
          lCtx.moveTo(curX, curY);

          while (curY < lHeight) {
            curX += (Math.random() - 0.5) * 45;
            curY += Math.random() * 25 + 10;
            lCtx.lineTo(curX, curY);
          }
          lCtx.stroke();
          playExplosion(); // Thunder rumble
        }
      };

      const animateLightning = () => {
        drawLightning();
        requestAnimationFrame(animateLightning);
      };
      animateLightning();

      window.addEventListener('resize', () => {
        lWidth = lightCanvas.width = lightCanvas.parentElement.clientWidth;
        lHeight = lightCanvas.height = lightCanvas.parentElement.clientHeight;
      });
    }

    // ============================================================
    // 7. HUD LEVEL & SECTION SCROLL TRACKER
    // ============================================================
    const sections = ['home', 'about', 'arcade', 'minigame-section', 'highscores', 'team', 'rift'];

    sections.forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            currentLevel = index + 1;
            if (hudCurrentLevel) hudCurrentLevel.innerText = currentLevel;
          },
          onEnterBack: () => {
            currentLevel = index + 1;
            if (hudCurrentLevel) hudCurrentLevel.innerText = currentLevel;
          }
        });
      }
    });

    // ============================================================
    // 8. GSAP SECTION TRANSITION STAGGERINGS
    // ============================================================
    gsap.from('.crt-monitor', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
      },
      x: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.arcade-cabinet', {
      scrollTrigger: {
        trigger: '#arcade',
        start: 'top 75%'
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Achievements leaderboard counts
    document.querySelectorAll('.score-value').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.0,
        scrollTrigger: {
          trigger: '#highscores',
          start: 'top 80%',
        },
        ease: 'power2.out',
        onUpdate: () => {
          el.innerText = Math.floor(obj.val).toLocaleString() + suffix;
        }
      });
    });

    gsap.from('.character-card', {
      scrollTrigger: {
        trigger: '#team',
        start: 'top 75%'
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.2)'
    });

    ScrollTrigger.create({
      trigger: '#team',
      start: 'top 65%',
      onEnter: () => {
        document.querySelectorAll('.stat-bar-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-value') + '%';
        });
      }
    });

    // ============================================================
    // 9. GLITCH TEXT SYSTEM
    // ============================================================
    const glitchText = (element, finalText, duration = 0.8) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/\\';
      const length = finalText.length;
      let frame = 0;
      const totalFrames = duration * 60;

      const interval = setInterval(() => {
        let currentText = '';
        for (let i = 0; i < length; i++) {
          if (finalText[i] === ' ' || finalText[i] === '\n') {
            currentText += finalText[i];
            continue;
          }
          const progress = frame / totalFrames;
          const revealThreshold = progress * length;

          if (i < revealThreshold) {
            currentText += finalText[i];
          } else {
            currentText += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        element.innerText = currentText;
        frame++;

        if (frame > totalFrames) {
          clearInterval(interval);
          element.innerText = finalText;
        }
      }, 1000 / 60);
    };

    document.querySelectorAll('.glitch-text').forEach(title => {
      const originalText = title.innerText;
      ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        onEnter: () => {
          glitchText(title, originalText);
        }
      });
    });

    // ============================================================
    // 10. ARCADE CABINET ZOOM MODAL
    // ============================================================
    const arcadeModal = document.getElementById('arcade-modal');
    const modalCloseBtn = document.getElementById('arcade-modal-close');
    const modalImg = document.getElementById('arcade-modal-img');
    const modalTitle = document.getElementById('arcade-modal-title');
    const modalDesc = document.getElementById('arcade-modal-desc');
    const modalTech = document.getElementById('arcade-modal-tech');

    document.querySelectorAll('.arcade-cabinet').forEach(cabinet => {
      cabinet.addEventListener('click', () => {
        playBeep();
        const title = cabinet.getAttribute('data-title');
        const desc = cabinet.getAttribute('data-desc');
        const img = cabinet.getAttribute('data-img');
        const techStr = cabinet.getAttribute('data-tech') || '';

        modalImg.src = img;
        modalImg.alt = title;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        
        modalTech.innerHTML = '';
        techStr.split(',').forEach(tag => {
          if (tag.trim()) {
            const span = document.createElement('span');
            span.className = 'arcade-tag';
            span.innerText = tag.trim();
            modalTech.appendChild(span);
          }
        });

        arcadeModal.classList.add('active');
      });
    });

    const closeModal = () => {
      arcadeModal.classList.remove('active');
      playBeep();
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (arcadeModal) {
      arcadeModal.addEventListener('click', (e) => {
        if (e.target === arcadeModal) closeModal();
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && arcadeModal.classList.contains('active')) closeModal();
      });
    }

    // ============================================================
    // 11. D&D CHARACTER CARD 3D TILT EFFECT & FLASHLIGHT GLOW
    // ============================================================
    const setupCardInteractions = () => {
      const cards = document.querySelectorAll('.character-card, .arcade-cabinet, .hud-char-box');
      
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

          // Only tilt character cards & cabinets, not the bottom HUD boxes
          if (card.classList.contains('hud-char-box')) return;

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const mouseX = e.clientX - centerX;
          const mouseY = e.clientY - centerY;
          
          const maxTilt = 10;
          const rotateX = -((mouseY / (rect.height / 2)) * maxTilt).toFixed(2);
          const rotateY = ((mouseX / (rect.width / 2)) * maxTilt).toFixed(2);
          
          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 800,
            duration: 0.2,
            ease: 'power1.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          if (card.classList.contains('hud-char-box')) return;
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
      });
    };
    setupCardInteractions();

    // ============================================================
    // 12. RIFT PORTAL CANVAS (CTA SECTION)
    // ============================================================
    const riftCanvas = document.getElementById('rift-canvas');
    if (riftCanvas) {
      const ctx = riftCanvas.getContext('2d');
      let rWidth = (riftCanvas.width = riftCanvas.parentElement.clientWidth);
      let rHeight = (riftCanvas.height = riftCanvas.parentElement.clientHeight);

      let vortexParticles = [];
      const vortexCount = 60;
      const centerX = rWidth / 2;
      const centerY = rHeight / 2;

      class VortexParticle {
        constructor() {
          this.reset();
        }

        reset() {
          this.angle = Math.random() * Math.PI * 2;
          this.distance = Math.random() * Math.max(rWidth, rHeight) * 0.5 + 40;
          this.speed = Math.random() * 0.015 + 0.005;
          this.color = Math.random() < 0.8 ? '#ff1e27' : '#990000';
          this.size = Math.random() * 2 + 1;
        }

        update() {
          this.angle += this.speed;
          this.distance -= Math.random() * 0.7 + 0.2;
          if (this.distance <= 8) {
            this.reset();
          }
        }

        draw() {
          const x = centerX + Math.cos(this.angle) * this.distance;
          const y = centerY + Math.sin(this.angle) * this.distance;
          
          ctx.beginPath();
          ctx.arc(x, y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff1e27';
          ctx.fill();
        }
      }

      for (let i = 0; i < vortexCount; i++) {
        vortexParticles.push(new VortexParticle());
      }

      const animateVortex = () => {
        ctx.fillStyle = 'rgba(5, 2, 12, 0.18)';
        ctx.shadowBlur = 0;
        ctx.fillRect(0, 0, rWidth, rHeight);
        
        vortexParticles.forEach(vp => {
          vp.update();
          vp.draw();
        });
        requestAnimationFrame(animateVortex);
      };
      animateVortex();

      window.addEventListener('resize', () => {
        rWidth = riftCanvas.width = riftCanvas.parentElement.clientWidth;
        rHeight = riftCanvas.height = riftCanvas.parentElement.clientHeight;
      });
    }

    // ============================================================
    // 13. "GLITCH INVADERS" ARCADE MINI-GAME
    // ============================================================
    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
      const gCtx = gameCanvas.getContext('2d');
      const gameStartBtn = document.getElementById('game-start-btn');
      const gameOverScreen = document.getElementById('game-over-screen');
      const gameScoreDisplay = document.getElementById('game-score');
      const gameLivesDisplay = document.getElementById('game-lives');
      const gameFinalScore = document.getElementById('game-final-score');
      const gameRestartBtn = document.getElementById('game-restart-btn');

      let gameActive = false;
      let score = 0;
      let lives = 3;
      let keys = {};
      let player = { x: 285, y: 360, w: 30, h: 18, speed: 5 };
      let playerBullets = [];
      let enemyBullets = [];
      let enemies = [];
      let enemyDirection = 1;
      let enemySpeed = 1;
      let lastShotTime = 0;

      window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', ' ', 'KeyA', 'KeyD'].includes(e.key)) {
          if (gameActive) e.preventDefault();
        }
        keys[e.key] = true;
      });

      window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
      });

      const initEnemies = () => {
        enemies = [];
        const rows = 3;
        const cols = 8;
        const spacingX = 45;
        const spacingY = 30;
        const startX = 60;
        const startY = 50;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            enemies.push({
              x: startX + c * spacingX,
              y: startY + r * spacingY,
              w: 22,
              h: 16,
              alive: true,
              type: r
            });
          }
        }
      };

      const startNewWave = () => {
        initEnemies();
        enemySpeed += 0.35;
        playPowerUp();
      };

      const startGame = () => {
        initAudio();
        score = 0;
        lives = 3;
        player.x = 285;
        playerBullets = [];
        enemyBullets = [];
        enemySpeed = 1.0;
        enemyDirection = 1;
        
        initEnemies();
        
        gameScoreDisplay.innerText = score;
        gameLivesDisplay.innerText = "♥♥♥";
        
        gameStartBtn.classList.add('hidden');
        gameOverScreen.classList.remove('active');
        
        gameActive = true;
        playPowerUp();
        gameLoop();
      };

      const triggerGameOver = () => {
        gameActive = false;
        playGameOver();
        gameFinalScore.innerText = score;
        gameOverScreen.classList.add('active');
      };

      const updateGame = () => {
        if (keys['ArrowLeft'] || keys['KeyA'] || keys['a']) {
          player.x = Math.max(10, player.x - player.speed);
        }
        if (keys['ArrowRight'] || keys['KeyD'] || keys['d']) {
          player.x = Math.min(gameCanvas.width - player.w - 10, player.x + player.speed);
        }

        if (keys[' '] && Date.now() - lastShotTime > 300) {
          playerBullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 10, speed: 7 });
          lastShotTime = Date.now();
          playBeep();
        }

        playerBullets.forEach((bullet, index) => {
          bullet.y -= bullet.speed;
          if (bullet.y < 0) {
            playerBullets.splice(index, 1);
          }
        });

        enemyBullets.forEach((bullet, index) => {
          bullet.y += bullet.speed;
          if (bullet.y > gameCanvas.height) {
            enemyBullets.splice(index, 1);
            return;
          }

          if (
            bullet.x < player.x + player.w &&
            bullet.x + bullet.w > player.x &&
            bullet.y < player.y + player.h &&
            bullet.y + bullet.h > player.y
          ) {
            enemyBullets.splice(index, 1);
            lives--;
            playExplosion();
            
            const wrapper = document.querySelector('.game-cabinet-frame');
            if (wrapper) {
              wrapper.style.animation = 'screenShake 0.3s ease-out';
              setTimeout(() => wrapper.style.animation = 'none', 300);
            }

            gameLivesDisplay.innerText = "♥".repeat(Math.max(0, lives));

            if (lives <= 0) {
              triggerGameOver();
            }
          }
        });

        let hitEdge = false;
        let activeEnemies = 0;

        enemies.forEach(enemy => {
          if (!enemy.alive) return;
          activeEnemies++;

          enemy.x += enemySpeed * enemyDirection;
          
          if (enemy.x + enemy.w > gameCanvas.width - 15 || enemy.x < 15) {
            hitEdge = true;
          }

          playerBullets.forEach((bullet, bIdx) => {
            if (
              bullet.x < enemy.x + enemy.w &&
              bullet.x + bullet.w > enemy.x &&
              bullet.y < enemy.y + enemy.h &&
              bullet.y + bullet.h > enemy.y
            ) {
              enemy.alive = false;
              playerBullets.splice(bIdx, 1);
              score += 10;
              gameScoreDisplay.innerText = score;
              playExplosion();
            }
          });

          if (enemy.y + enemy.h >= player.y - 10) {
            triggerGameOver();
          }
        });

        if (activeEnemies === 0) {
          startNewWave();
        }

        if (hitEdge) {
          enemyDirection = -enemyDirection;
          enemies.forEach(enemy => {
            if (enemy.alive) {
              enemy.y += 12;
            }
          });
        }

        if (Math.random() < 0.015 && activeEnemies > 0) {
          const livingEnemies = enemies.filter(e => e.alive);
          const shooter = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
          enemyBullets.push({
            x: shooter.x + shooter.w / 2 - 2,
            y: shooter.y + shooter.h,
            w: 4,
            h: 8,
            speed: 4
          });
        }
      };

      const drawGame = () => {
        gCtx.fillStyle = '#000000';
        gCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        gCtx.strokeStyle = 'rgba(255, 30, 39, 0.03)';
        gCtx.lineWidth = 1;
        for (let i = 0; i < gameCanvas.width; i += 20) {
          gCtx.beginPath();
          gCtx.moveTo(i, 0);
          gCtx.lineTo(i, gameCanvas.height);
          gCtx.stroke();
        }

        gCtx.fillStyle = isUpsideDown ? '#ff4444' : '#00ffcc';
        gCtx.beginPath();
        gCtx.moveTo(player.x + player.w / 2, player.y);
        gCtx.lineTo(player.x + player.w, player.y + player.h);
        gCtx.lineTo(player.x, player.y + player.h);
        gCtx.closePath();
        gCtx.fill();

        gCtx.fillStyle = isUpsideDown ? '#ff3333' : '#ffff00';
        playerBullets.forEach(bullet => {
          gCtx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
        });

        gCtx.fillStyle = '#ff1e27';
        enemyBullets.forEach(bullet => {
          gCtx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
        });

        enemies.forEach(enemy => {
          if (!enemy.alive) return;

          gCtx.fillStyle = isUpsideDown ? '#e50914' : '#ff4444';
          if (enemy.type === 1) gCtx.fillStyle = isUpsideDown ? '#880000' : '#8b5cf6';
          if (enemy.type === 2) gCtx.fillStyle = isUpsideDown ? '#ff1e27' : '#06b6d4';

          gCtx.fillRect(enemy.x, enemy.y + 4, enemy.w, enemy.h - 8);
          gCtx.fillRect(enemy.x + 4, enemy.y, enemy.w - 8, enemy.h);
          gCtx.fillRect(enemy.x + 2, enemy.y + 2, 4, 4);
          gCtx.fillRect(enemy.x + enemy.w - 6, enemy.y + 2, 4, 4);
        });
      };

      const gameLoop = () => {
        if (!gameActive) return;
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
      };

      gameStartBtn.addEventListener('click', startGame);
      gameRestartBtn.addEventListener('click', startGame);
    }
  });
})();
