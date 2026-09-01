// Main application logic for Brainrot Academy

// --- Web Audio API Synth for Retro 8-bit Sounds ---
class SoundSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, delay = 0) {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }

  click() {
    this.playTone(600, 'sine', 0.08);
  }

  correct() {
    // Happy retro arpeggio
    this.playTone(523.25, 'triangle', 0.1, 0);      // C5
    this.playTone(659.25, 'triangle', 0.1, 0.08);   // E5
    this.playTone(783.99, 'triangle', 0.1, 0.16);   // G5
    this.playTone(1046.50, 'triangle', 0.2, 0.24);  // C6
  }

  incorrect() {
    // Disappointing low slide buzz
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.35);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  streak() {
    // Exciting slide up
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  gameOverWin() {
    // Success fanfare
    const tempo = 0.12;
    this.playTone(523, 'sine', 0.15, 0);
    this.playTone(659, 'sine', 0.15, tempo);
    this.playTone(784, 'sine', 0.15, tempo * 2);
    this.playTone(1046, 'sine', 0.4, tempo * 3);
  }

  gameOverLose() {
    // Cursed descending failure tone
    const tempo = 0.15;
    this.playTone(392, 'sawtooth', 0.2, 0);
    this.playTone(349, 'sawtooth', 0.2, tempo);
    this.playTone(311, 'sawtooth', 0.2, tempo * 2);
    this.playTone(246, 'sawtooth', 0.5, tempo * 3);
  }
}

const SFX = new SoundSynth();

// --- Application State ---
const state = {
  // Navigation
  activePage: 'lobby',
  
  // Profile settings
  user: {
    name: 'Anonymous Rizzler',
    rank: 'looksmaxxer'
  },
  
  // Game states
  highScore: parseInt(localStorage.getItem('brainrot_high_score')) || 0,
  game: {
    activeQuestions: [],
    currentQuestionIndex: 0,
    auraScore: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    answered: false,
    questionsCount: 10
  },
  
  // Meme Museum local search & filters
  museum: {
    searchQuery: '',
    categoryFilter: 'all',
    memes: [...MEME_DATABASE] // Copy of the MEME_DATABASE from memes.js
  }
};

// --- Page Routing ---
function navigateTo(pageId) {
  SFX.click();
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    state.activePage = pageId;
  }
  
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-page') === pageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Adjust bottom HUD visibility (hide inside game summary, or adapt)
  const hud = document.getElementById('footer-hud');
  if (pageId === 'trivia' && state.game.activeQuestions.length > 0 && state.game.currentQuestionIndex < state.game.questionsCount) {
    hud.style.transform = 'translate(-50%, 150px)'; // Temporarily hide default footer HUD during live quiz to avoid double HUD stats
  } else {
    hud.style.transform = 'translate(-50%, 0)';
    updateFooterHUD();
  }
}

// --- Footer HUD Update ---
function updateFooterHUD() {
  document.getElementById('hud-name-val').textContent = state.user.name.substring(0, 16);
  
  // Rank map formatting
  const rankNames = {
    looksmaxxer: 'Mewing Apprentice',
    rizzler: 'Certified Rizzler',
    crook: 'Level 1 Crook',
    sigma: 'Lvl 100 Sigma Boss'
  };
  document.getElementById('hud-rank-val').textContent = rankNames[state.user.rank] || 'Recruit';
  
  // Aura scoring display
  const auraVal = document.getElementById('hud-aura-val');
  auraVal.textContent = (state.game.auraScore >= 0 ? '+' : '') + state.game.auraScore + ' Aura';
  if (state.game.auraScore >= 0) {
    auraVal.className = 'hud-stat-val positive';
  } else {
    auraVal.className = 'hud-stat-val negative';
  }
  
  // High score display
  document.getElementById('hud-highscore-val').textContent = state.highScore;
  
  // Streak fire icon indicator
  const streakFire = document.getElementById('hud-streak-fire');
  if (state.game.streak >= 3) {
    streakFire.classList.add('active');
    document.getElementById('hud-streak-num').textContent = `x${state.game.streak}`;
  } else {
    streakFire.classList.remove('active');
    document.getElementById('hud-streak-num').textContent = '';
  }
}

// --- Lobby Setup & Profile Sync ---
function setupLobby() {
  const nameInput = document.getElementById('profile-name');
  const rankSelect = document.getElementById('profile-rank');
  const btnStart = document.getElementById('btn-start-trivia');
  
  // Load saved profile if available
  const savedProfile = localStorage.getItem('brainrot_profile');
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile);
      state.user = parsed;
      nameInput.value = parsed.name;
      rankSelect.value = parsed.rank;
    } catch(e) {}
  }
  
  // Bind inputs
  nameInput.addEventListener('input', (e) => {
    state.user.name = e.target.value.trim() || 'Anonymous Rizzler';
    saveProfile();
    updateFooterHUD();
  });
  
  rankSelect.addEventListener('change', (e) => {
    state.user.rank = e.target.value;
    saveProfile();
    updateFooterHUD();
  });
  
  btnStart.addEventListener('click', () => {
    startNewGame();
  });

  // Display initial Lobby Stats
  document.getElementById('lobby-high-score').textContent = state.highScore;
  document.getElementById('lobby-memes-unlocked').textContent = state.museum.memes.length;
  document.getElementById('lobby-rizz-status').textContent = rankNamesShort[rankSelect.value] || 'Noob';
}

const rankNamesShort = {
  looksmaxxer: 'Apprentice',
  rizzler: 'Rizz Master',
  crook: 'Lvl 1 Crook',
  sigma: 'Sigma Boss'
};

function saveProfile() {
  localStorage.setItem('brainrot_profile', JSON.stringify(state.user));
}

// --- Trivia Game Engine ---
function startNewGame() {
  SFX.click();
  
  // Shuffle TRIVIA_QUESTIONS (from trivia.js) and select 10
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
  state.game.activeQuestions = shuffled.slice(0, state.game.questionsCount);
  
  // Reset game scores
  state.game.currentQuestionIndex = 0;
  state.game.auraScore = 0;
  state.game.streak = 0;
  state.game.maxStreak = 0;
  state.game.correctCount = 0;
  state.game.answered = false;
  
  // Navigate to trivia page
  navigateTo('trivia');
  
  // Render first question
  renderQuestion();
}

function renderQuestion() {
  state.game.answered = false;
  const qIndex = state.game.currentQuestionIndex;
  const question = state.game.activeQuestions[qIndex];
  
  // Update progress UI
  document.getElementById('progress-num').textContent = `${qIndex + 1}/${state.game.questionsCount}`;
  const progressPercent = ((qIndex) / state.game.questionsCount) * 100;
  document.getElementById('progress-fill').style.width = `${progressPercent}%`;
  
  // Live quiz HUD scores
  document.getElementById('live-score').textContent = state.game.correctCount;
  
  const liveAuraVal = document.getElementById('live-aura');
  liveAuraVal.textContent = (state.game.auraScore >= 0 ? '+' : '') + state.game.auraScore;
  liveAuraVal.className = 'hud-val ' + (state.game.auraScore >= 0 ? 'aura-pos' : 'aura-neg');
  
  // Live Streak Fire
  const liveStreakBadge = document.getElementById('live-streak-badge');
  if (state.game.streak >= 3) {
    liveStreakBadge.classList.add('active');
    document.getElementById('live-streak-val').textContent = state.game.streak;
  } else {
    liveStreakBadge.classList.remove('active');
  }
  
  // Set question card content
  const qCard = document.getElementById('trivia-question-card');
  qCard.classList.remove('shake');
  
  qCard.querySelector('.question-text').textContent = question.question;
  
  // Render options buttons
  const optionsGrid = qCard.querySelector('.options-grid');
  optionsGrid.innerHTML = '';
  
  question.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleOptionSelection(idx, btn));
    optionsGrid.appendChild(btn);
  });
  
  // Hide explanation and action buttons
  document.getElementById('trivia-explanation-box').style.display = 'none';
  document.getElementById('btn-next-question').style.display = 'none';
}

function handleOptionSelection(selectedIndex, selectedBtn) {
  if (state.game.answered) return;
  state.game.answered = true;
  
  const qIndex = state.game.currentQuestionIndex;
  const question = state.game.activeQuestions[qIndex];
  const correctIdx = question.correctIndex;
  
  const allOptionBtns = document.querySelectorAll('.option-btn');
  allOptionBtns.forEach(btn => btn.disabled = true);
  
  const expBox = document.getElementById('trivia-explanation-box');
  const expTitle = expBox.querySelector('.explanation-title');
  const expText = expBox.querySelector('.explanation-text');
  
  // Next question / Finish quiz button setup
  const nextBtn = document.getElementById('btn-next-question');
  if (qIndex === state.game.questionsCount - 1) {
    nextBtn.textContent = 'Finish & See Results';
  } else {
    nextBtn.textContent = 'Next Question';
  }
  
  if (selectedIndex === correctIdx) {
    // Correct Answer!
    state.game.correctCount++;
    state.game.streak++;
    if (state.game.streak > state.game.maxStreak) {
      state.game.maxStreak = state.game.streak;
    }
    
    // Aura rewards double if you have hot streak >= 3
    const multiplier = state.game.streak >= 3 ? 2 : 1;
    const gainedAura = question.auraAward * multiplier;
    state.game.auraScore += gainedAura;
    
    // Play happy audio
    if (state.game.streak >= 3) {
      SFX.streak();
    } else {
      SFX.correct();
    }
    
    // Visual indicators
    selectedBtn.classList.add('correct');
    
    expTitle.textContent = `Correct! +${gainedAura} Aura!`;
    expTitle.className = 'explanation-title correct-lbl';
    expText.textContent = question.explanation;
    
  } else {
    // Incorrect Answer!
    state.game.streak = 0;
    const lostAura = question.auraAward; // Subtract single reward amount
    state.game.auraScore -= lostAura;
    
    // Play incorrect audio & screen shake
    SFX.incorrect();
    document.getElementById('trivia-question-card').classList.add('shake');
    
    // Highlight correct and selected incorrect buttons
    selectedBtn.classList.add('incorrect');
    allOptionBtns[correctIdx].classList.add('correct');
    
    expTitle.textContent = `Cringe! -${lostAura} Aura!`;
    expTitle.className = 'explanation-title incorrect-lbl';
    expText.textContent = question.explanation;
  }
  
  // Show explanation & next button
  expBox.style.display = 'block';
  nextBtn.style.display = 'block';
  
  // Update footer stats
  updateFooterHUD();
}

function handleNextQuestion() {
  SFX.click();
  state.game.currentQuestionIndex++;
  
  if (state.game.currentQuestionIndex < state.game.questionsCount) {
    renderQuestion();
  } else {
    endGame();
  }
}

// --- End Game Summary ---
function endGame() {
  // Hide active state HUD translation
  document.getElementById('footer-hud').style.transform = 'translate(-50%, 0)';
  
  // Show summary page
  document.getElementById('trivia-game-box').style.display = 'none';
  document.getElementById('trivia-summary-box').style.display = 'block';
  
  const finalAura = state.game.auraScore;
  
  // Calculate Rizz rank based on final aura
  let finalRank = '';
  let finalRankDesc = '';
  
  if (finalAura >= 1000) {
    finalRank = 'Lvl 100 Skibidi Sigma Overlord';
    finalRankDesc = 'Incredible! You have reached peak Aura. The entire school is mogged. Absolute boss rizz.';
    SFX.gameOverWin();
  } else if (finalAura >= 500) {
    finalRank = 'Lvl 50 Rizz Master (W Rizz)';
    finalRankDesc = 'Outstanding knowledge! Your rizz is certified, and you are cooking with high fire multipliers.';
    SFX.gameOverWin();
  } else if (finalAura >= 0) {
    finalRank = 'Lvl 10 Mewing Apprentice';
    finalRankDesc = 'Decent effort. You know some basic slang, but you need to practice your jawline looksmaxxing routine.';
    SFX.gameOverWin();
  } else {
    finalRank = 'Lvl 1 Crook (Ohio Refugee)';
    finalRankDesc = 'Oh no! Bro is lost in Ohio. Major negative aura alert. Stop watching brainrot and start mewing.';
    SFX.gameOverLose();
  }
  
  // Render results
  document.getElementById('summary-rank').textContent = finalRank;
  document.getElementById('summary-rank-desc').textContent = finalRankDesc;
  document.getElementById('summary-correct').textContent = `${state.game.correctCount}/${state.game.questionsCount}`;
  document.getElementById('summary-max-streak').textContent = state.game.maxStreak;
  
  const finalAuraText = document.getElementById('summary-final-aura');
  finalAuraText.textContent = (finalAura >= 0 ? '+' : '') + finalAura;
  finalAuraText.className = 'summary-score-val ' + (finalAura >= 0 ? 'aura-pos' : 'aura-neg');
  
  // Handle high score updates
  const newHighScoreAlert = document.getElementById('new-highscore-alert');
  if (finalAura > state.highScore) {
    state.highScore = finalAura;
    localStorage.setItem('brainrot_high_score', finalAura);
    newHighScoreAlert.style.display = 'block';
  } else {
    newHighScoreAlert.style.display = 'none';
  }
  
  // Re-sync Lobby Stats and Footer HUD
  document.getElementById('lobby-high-score').textContent = state.highScore;
  updateFooterHUD();
}

function restartTrivia() {
  document.getElementById('trivia-game-box').style.display = 'block';
  document.getElementById('trivia-summary-box').style.display = 'none';
  startNewGame();
}

// --- Meme Museum Database Logic ---
function renderMuseum() {
  const grid = document.getElementById('meme-grid');
  grid.innerHTML = '';
  
  // Filter and search
  const filtered = state.museum.memes.filter(meme => {
    // Category check
    const matchesCategory = state.museum.categoryFilter === 'all' || meme.category === state.museum.categoryFilter;
    
    // Search query check
    const query = state.museum.searchQuery.toLowerCase();
    const matchesSearch = meme.title.toLowerCase().includes(query) ||
                          meme.description.toLowerCase().includes(query) ||
                          meme.tags.some(tag => tag.toLowerCase().includes(query));
                          
    return matchesCategory && matchesSearch;
  });
  
  // Render empty state if no memes match
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">No memes match your rizz criteria.</p>
        <button class="btn-secondary" onclick="resetMuseumFilters()">Reset Search</button>
      </div>
    `;
    return;
  }
  
  // Render cards
  filtered.forEach(meme => {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.addEventListener('click', () => showMemeDetails(meme.id));
    
    // Determine aura badge styling
    const auraClass = meme.auraLevel >= 0 ? 'aura-plus' : 'aura-minus';
    
    // Get simple representation emoji based on category
    let categoryEmoji = '👾';
    if (meme.category === 'Slang') categoryEmoji = '💬';
    if (meme.category === 'TikTok Trends') categoryEmoji = '📱';
    if (meme.category === 'Gen Alpha') categoryEmoji = '🚽';
    if (meme.category === 'Classic') categoryEmoji = '🗿';
    
    // Card visualization uses CSS gradient backgrounds or custom images
    const imgHtml = meme.imageUrl 
      ? `<img src="${meme.imageUrl}" alt="${meme.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` 
      : '';
    const spanDisplay = meme.imageUrl ? 'none' : 'block';
    
    card.innerHTML = `
      <div class="meme-card-visual" style="background: ${meme.gradient || 'linear-gradient(135deg, #333, #555)'}">
        ${imgHtml}
        <span style="display: ${spanDisplay};">${categoryEmoji}</span>
        <div class="meme-card-category">${meme.category}</div>
        <div class="meme-card-aura ${auraClass}">${meme.auraRating}</div>
      </div>
      <div class="meme-card-content">
        <h3 class="meme-card-title">${meme.title}</h3>
        <p class="meme-card-desc">${meme.description}</p>
        <div class="meme-card-footer">
          <div class="meme-card-tags">
            ${meme.tags.slice(0, 3).map(tag => `<span class="meme-card-tag">#${tag}</span>`).join('')}
          </div>
          <button class="read-lore-btn">Read Lore ➔</button>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

function showMemeDetails(memeId) {
  SFX.click();
  const meme = state.museum.memes.find(m => m.id === memeId);
  if (!meme) return;
  
  const modal = document.getElementById('lore-modal');
  
  // Get icon
  let categoryEmoji = '👾';
  if (meme.category === 'Slang') categoryEmoji = '💬';
  if (meme.category === 'TikTok Trends') categoryEmoji = '📱';
  if (meme.category === 'Gen Alpha') categoryEmoji = '🚽';
  if (meme.category === 'Classic') categoryEmoji = '🗿';
  
  // Render detail contents
  const heroVisual = modal.querySelector('.lore-visual-hero');
  heroVisual.style.background = meme.gradient;
  
  const heroImgHtml = meme.imageUrl 
    ? `<img src="${meme.imageUrl}" alt="${meme.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` 
    : '';
  const heroSpanDisplay = meme.imageUrl ? 'none' : 'block';
  
  heroVisual.innerHTML = `
    ${heroImgHtml}
    <span style="display: ${heroSpanDisplay};">${categoryEmoji}</span>
  `;
  
  modal.querySelector('.lore-title-wrapper h2').textContent = meme.title;
  modal.querySelector('.lore-category-badge').textContent = meme.category;
  
  const auraBadge = modal.querySelector('.lore-aura-badge');
  auraBadge.textContent = meme.auraRating;
  auraBadge.className = 'lore-aura-badge ' + (meme.auraLevel >= 0 ? 'aura-plus' : 'aura-minus');
  
  modal.querySelector('#lore-desc').textContent = meme.description;
  modal.querySelector('#lore-origin').textContent = meme.origin;
  
  modal.classList.add('active');
}

function closeLoreModal() {
  SFX.click();
  document.getElementById('lore-modal').classList.remove('active');
}

function resetMuseumFilters() {
  SFX.click();
  document.getElementById('museum-search').value = '';
  state.museum.searchQuery = '';
  state.museum.categoryFilter = 'all';
  
  // Update filter pill styling
  document.querySelectorAll('.filter-pill').forEach(pill => {
    if (pill.getAttribute('data-category') === 'all') {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
  
  renderMuseum();
}

function setupMuseum() {
  const searchInput = document.getElementById('museum-search');
  searchInput.addEventListener('input', (e) => {
    state.museum.searchQuery = e.target.value;
    renderMuseum();
  });
  
  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      SFX.click();
      const cat = e.target.getAttribute('data-category');
      state.museum.categoryFilter = cat;
      
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      
      renderMuseum();
    });
  });
  
  // Lore modal close binders
  document.getElementById('btn-close-lore').addEventListener('click', closeLoreModal);
  document.getElementById('lore-modal').addEventListener('click', (e) => {
    if (e.target.id === 'lore-modal') closeLoreModal();
  });
  
  // Custom Meme Submitter dialog
  const submitModal = document.getElementById('submit-modal');
  document.getElementById('btn-open-submit').addEventListener('click', () => {
    SFX.click();
    submitModal.classList.add('active');
  });
  
  const closeSubmit = () => {
    SFX.click();
    submitModal.classList.remove('active');
  };
  
  document.getElementById('btn-close-submit').addEventListener('click', closeSubmit);
  document.getElementById('btn-cancel-submit').addEventListener('click', closeSubmit);
  submitModal.addEventListener('click', (e) => {
    if (e.target.id === 'submit-modal') closeSubmit();
  });
  
  // Handle form submit
  const form = document.getElementById('submit-meme-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('sub-title').value.trim();
    const category = document.getElementById('sub-category').value;
    const aura = parseInt(document.getElementById('sub-aura').value) || 0;
    const tagsInput = document.getElementById('sub-tags').value.trim();
    const imageUrl = document.getElementById('sub-image').value.trim();
    const description = document.getElementById('sub-desc').value.trim();
    const origin = document.getElementById('sub-origin').value.trim();
    
    // Validation
    if (!title || !description || !origin) {
      alert("Please fill in all required fields!");
      return;
    }
    
    // Prepare tags
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim().toLowerCase()) : ['custom'];
    
    // Create randomized flashy gradient
    const gradients = [
      "linear-gradient(135deg, #11998e, #38ef7d)", // green
      "linear-gradient(135deg, #8a23ab, #e94057, #f27121)", // sunset
      "linear-gradient(135deg, #ff416c, #ff4b2b)", // fire red
      "linear-gradient(135deg, #1fa2ff, #12d8fa, #a6ffcb)", // mint cyan
      "linear-gradient(135deg, #f857a6, #ff5858)", // soft pink
      "linear-gradient(135deg, #6441a5, #2a0845)" // purple grimace
    ];
    const randGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    const newMeme = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title,
      category: category,
      tags: tags,
      auraRating: (aura >= 0 ? '+' : '') + aura + ' Aura',
      auraLevel: aura,
      description: description,
      origin: origin,
      gradient: randGradient,
      imageUrl: imageUrl
    };
    
    // Insert at the beginning of the list
    state.museum.memes.unshift(newMeme);
    
    // Play celebratory sound
    SFX.correct();
    
    // Reset form & close
    form.reset();
    submitModal.classList.remove('active');
    
    // Re-render
    renderMuseum();
    
    // Update lobby counters
    document.getElementById('lobby-memes-unlocked').textContent = state.museum.memes.length;
  });
}

// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Bind navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = e.target.getAttribute('data-page');
      navigateTo(page);
    });
  });
  
  // Game Actions
  document.getElementById('btn-next-question').addEventListener('click', handleNextQuestion);
  document.getElementById('btn-restart-trivia').addEventListener('click', restartTrivia);
  document.getElementById('btn-lobby-return').addEventListener('click', () => {
    document.getElementById('trivia-summary-box').style.display = 'none';
    document.getElementById('trivia-game-box').style.display = 'block';
    navigateTo('lobby');
  });
  
  // Initialize sub-modules
  setupLobby();
  setupMuseum();
  
  // Initial renders
  renderMuseum();
  updateFooterHUD();
  
  // Audio activation listener (browsers require user interaction before activating AudioContext)
  document.body.addEventListener('click', () => {
    SFX.init();
  }, { once: true });
});
