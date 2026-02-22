document.addEventListener("DOMContentLoaded", function () {

// ===== WEB AUDIO - SOUND ENGINE =====
var audioCtx = null;
var sfxEnabled = true;
var isPaused = false;
var musicEnabled = true;
var isZenMode = false;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSfx(type) {
  if (!sfxEnabled) return;
  try {
    var ctx = getAudioCtx();
    resumeAudio();
    if (isZenMode) {
      switch (type) {
        case 'tap':     playZenTap(ctx); break;
        case 'correct': playZenCorrect(ctx); break;
        case 'wrong':   playZenWrong(ctx); break;
        case 'results': playZenResults(ctx); break;
        default: break;
      }
    } else {
      switch (type) {
        case 'tap':     playTap(ctx); break;
        case 'correct': playCorrect(ctx); break;
        case 'wrong':   playWrong(ctx); break;
        case 'combo':   playCombo(ctx); break;
        case 'tick':    playTick(ctx); break;
        case 'timeup':  playTimeUp(ctx); break;
        case 'results': playResults(ctx); break;
      }
    }
  } catch (e) { /* audio errors */ }
}

// ===== NORMAL SFX =====
function playTap(ctx) {
  var o = ctx.createOscillator(); var g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(1200, ctx.currentTime);
  g.gain.setValueAtTime(0.12, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.06);
}
function playCorrect(ctx) {
  var t = ctx.currentTime;
  [587, 784].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t + i * 0.1);
    g.gain.setValueAtTime(0.25, t + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.1); o.stop(t + i * 0.1 + 0.2);
  });
}
function playWrong(ctx) {
  var t = ctx.currentTime; var o = ctx.createOscillator(); var g = ctx.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(250, t);
  o.frequency.linearRampToValueAtTime(100, t + 0.3);
  g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.35);
}
function playCombo(ctx) {
  var t = ctx.currentTime;
  [523, 659, 784, 1047].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t + i * 0.07);
    g.gain.setValueAtTime(0.2, t + i * 0.07);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.15);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.15);
  });
}
function playTick(ctx) {
  var o = ctx.createOscillator(); var g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.05);
}
function playTimeUp(ctx) {
  var t = ctx.currentTime;
  [400, 300, 200].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(freq, t + i * 0.12);
    g.gain.setValueAtTime(0.1, t + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.15);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.15);
  });
}
function playResults(ctx) {
  var t = ctx.currentTime;
  [392, 494, 587, 784, 988].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t + i * 0.12);
    g.gain.setValueAtTime(0.18, t + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.3);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.3);
  });
}

// ===== ZEN SFX =====
function playZenTap(ctx) {
  var o = ctx.createOscillator(); var g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(528, ctx.currentTime);
  g.gain.setValueAtTime(0.06, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.4);
}
function playZenCorrect(ctx) {
  var t = ctx.currentTime;
  [396, 528, 660].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t + i * 0.18);
    g.gain.setValueAtTime(0.1, t + i * 0.18);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.55);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.18); o.stop(t + i * 0.18 + 0.55);
  });
}
function playZenWrong(ctx) {
  var t = ctx.currentTime;
  [330, 262].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t + i * 0.18);
    o.frequency.linearRampToValueAtTime(freq * 0.85, t + i * 0.18 + 0.35);
    g.gain.setValueAtTime(0.13, t + i * 0.18);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.45);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.18); o.stop(t + i * 0.18 + 0.45);
  });
}
function playZenResults(ctx) {
  var t = ctx.currentTime;
  [264, 330, 396, 528, 660, 792].forEach(function(freq, i) {
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t + i * 0.2);
    g.gain.setValueAtTime(0.08, t + i * 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 0.7);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.2); o.stop(t + i * 0.2 + 0.7);
  });
}

// ===== BACKGROUND MUSIC =====
var bgMusic = null;
var zenMusic = null;

function startMusic() {
  if (!musicEnabled) return;
  if (isZenMode) {
    stopNormalMusic();
    if (!zenMusic) zenMusic = document.getElementById('zenMusic');
    if (!zenMusic || !zenMusic.paused) return;
    zenMusic.volume = 0.45;
    zenMusic.play().catch(function(){});
  } else {
    stopZenMusic();
    if (!bgMusic) bgMusic = document.getElementById('bgMusic');
    if (!bgMusic || !bgMusic.paused) return;
    bgMusic.volume = 0.7;
    bgMusic.play().catch(function(){});
  }
}

function stopNormalMusic() {
  if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
}

function stopZenMusic() {
  if (zenMusic) { zenMusic.pause(); zenMusic.currentTime = 0; }
}

function stopMusic() {
  stopNormalMusic();
  stopZenMusic();
}

// ===== LOAD SAVED SETTINGS =====
function loadSettings() {
  try {
    var s = localStorage.getItem('pq_settings');
    if (s) {
      var parsed = JSON.parse(s);
      sfxEnabled = parsed.sfx !== undefined ? parsed.sfx : true;
      musicEnabled = parsed.music !== undefined ? parsed.music : true;
      var tSound = document.getElementById('toggleSound');
      var tMusic = document.getElementById('toggleMusic');
      if (!sfxEnabled) tSound.classList.remove('on');
      if (!musicEnabled) tMusic.classList.remove('on');
    }
  } catch(e) {}
}

function saveSettings() {
  try {
    localStorage.setItem('pq_settings', JSON.stringify({ sfx: sfxEnabled, music: musicEnabled }));
  } catch(e) {}
}

// ===== GAME STATE =====
var selectedCat = 'all';
var selectedDiff = 'easy';
var questions = [];
var currentQ = 0;
var score = 0;
var combo = 0;
var bestStreak = 0;
var correctCount = 0;
var wrongCount = 0;
var quizTimer = null;
var timeLeft = 15;
var answered = false;
var nextClicked = false;
var resultsSaved = false;
var totalScore = 0;
var totalGames = 0;
var overallBestStreak = 0;
var hintUsed = false;
var autoAdvanceTimer = null;
var gameInProgress = false;
var TOTAL_Q = 10;
var TIMER_SEC = { easy: 20, medium: 15, hard: 10 };
var HINT_COST = 50;

// ===== ZEN MODE STATE =====
var zenAnsweredIds = [];
var zenPool = [];
var zenPoolIndex = 0;
var zenTotalAnswered = 0;
var zenCorrect = 0;
var zenWrong = 0;
var zenBestStreak = 0;
var zenCombo = 0;
var zenStartTime = 0;
var zenElapsedTimer = null;

// ===== SPECIAL MODE PROBABILITIES =====
var FAST_MODE_CHANCE    = 0.40;
var RISK_MODE_CHANCE    = 0.03;
var SUDDEN_DEATH_CHANCE = 0.03;

// ===== CATEGORY ORDER (unlock sequence) =====
var CAT_ORDER = ['entertainment', 'food', 'culture', 'history', 'geo', 'sports', 'science', 'literature'];

// ===== ANSWERED QUESTIONS TRACKING =====
function getAnsweredIds(cat) {
  try {
    var key = 'pq_answered_' + cat;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch(e) { return []; }
}

function saveAnsweredIds(cat, ids) {
  try {
    localStorage.setItem('pq_answered_' + cat, JSON.stringify(ids));
  } catch(e) {}
}

function markQuestionsAnswered(qs) {
  var bycat = {};
  qs.forEach(function(q) {
    if (!bycat[q.cat]) bycat[q.cat] = [];
    bycat[q.cat].push(q.id);
  });
  Object.keys(bycat).forEach(function(cat) {
    var existing = getAnsweredIds(cat);
    var merged = existing.concat(bycat[cat].filter(function(id) { return existing.indexOf(id) === -1; }));
    var totalInCat = ALL_QUESTIONS.filter(function(q) { return q.cat === cat; }).length;
    if (merged.length >= totalInCat) {
      saveAnsweredIds(cat, []);
    } else {
      saveAnsweredIds(cat, merged);
    }
  });
}

function getTotalAnsweredInCat(cat) {
  try {
    var key = 'pq_progress_' + cat;
    return parseInt(localStorage.getItem(key) || '0', 10);
  } catch(e) { return 0; }
}

function addToTotalAnswered(cat, count) {
  try {
    var key = 'pq_progress_' + cat;
    var current = parseInt(localStorage.getItem(key) || '0', 10);
    var total = ALL_QUESTIONS.filter(function(q) { return q.cat === cat; }).length;
    var updated = Math.min(current + count, total);
    localStorage.setItem(key, updated);
    return updated;
  } catch(e) { return 0; }
}

// ===== CATEGORY UNLOCK LOGIC =====
function isCategoryUnlocked(cat) {
  if (typeof ALL_QUESTIONS === 'undefined') return cat === 'entertainment';
  if (cat === 'all') {
    var unlockedCount = CAT_ORDER.filter(function(c) { return isCategoryUnlocked(c); }).length;
    return unlockedCount >= 2;
  }
  if (cat === 'entertainment') return true;
  var idx = CAT_ORDER.indexOf(cat);
  if (idx <= 0) return true;
  var prevCat = CAT_ORDER[idx - 1];
  var totalInPrev = ALL_QUESTIONS.filter(function(q) { return q.cat === prevCat; }).length;
  var answeredInPrev = getTotalAnsweredInCat(prevCat);
  return answeredInPrev >= totalInPrev;
}

function getUnlockRequirement(cat) {
  if (cat === 'all' || cat === 'entertainment') return null;
  var idx = CAT_ORDER.indexOf(cat);
  if (idx <= 0) return null;
  var prevCat = CAT_ORDER[idx - 1];
  var totalInPrev = ALL_QUESTIONS.filter(function(q) { return q.cat === prevCat; }).length;
  var answeredInPrev = getTotalAnsweredInCat(prevCat);
  return { prevCat: prevCat, answered: answeredInPrev, total: totalInPrev };
}

function getLevelData(xp) {
  var level = 1; var required = 100;
  while (xp >= required) { xp -= required; level++; required = Math.floor(required * 1.2); }
  return { level: level, currentXP: xp, requiredXP: required };
}

// ===== RANK DATA =====
function getRankData(level) {
  if (level <= 5)  return { title: "Quiz Rookie",        icon: "bi-mortarboard-fill", color: "#22c55e" };
  if (level <= 10) return { title: "Knowledge Explorer", icon: "bi-compass-fill",     color: "#3b82f6" };
  if (level <= 20) return { title: "Brain Strategist",   icon: "bi-lightbulb-fill",   color: "#a855f7" };
  if (level <= 35) return { title: "Mastermind",         icon: "bi-fire",             color: "#f97316" };
  return                  { title: "Quiz Legend",        icon: "bi-crown-fill",       color: "#facc15" };
}

// ===== LOAD / SAVE STATS =====
function loadStats() {
  try {
    var s = localStorage.getItem('pq_stats');
    if (s) {
      var p = JSON.parse(s);
      totalScore = p.totalScore || 0;
      totalGames = p.totalGames || 0;
      overallBestStreak = p.overallBestStreak || 0;
    }
  } catch(e) {}
}

function saveStats() {
  try {
    localStorage.setItem('pq_stats', JSON.stringify({
      totalScore: totalScore,
      totalGames: totalGames,
      overallBestStreak: overallBestStreak
    }));
  } catch(e) {}
}

function saveCategoryStats() {
  try {
    markQuestionsAnswered(questions.filter(function(q) { return q._sessionAnswered; }));
    var catStats = JSON.parse(localStorage.getItem('pq_catStats') || '{}');
    questions.forEach(function(q) {
      if (q._sessionCorrect) { catStats[q.cat] = (catStats[q.cat] || 0) + 1; }
    });
    localStorage.setItem('pq_catStats', JSON.stringify(catStats));
    var bycat = {};
    questions.filter(function(q) { return q._sessionAnswered; }).forEach(function(q) {
      if (!bycat[q.cat]) bycat[q.cat] = 0;
      bycat[q.cat]++;
    });
    Object.keys(bycat).forEach(function(cat) { addToTotalAnswered(cat, bycat[cat]); });
  } catch(e) {}
}

function loadCategoryStats() {
  try { return JSON.parse(localStorage.getItem('pq_catStats') || '{}'); }
  catch(e) { return {}; }
}

// ===== STARS =====
(function() {
  var c = document.getElementById('stars');
  for (var i = 0; i < 40; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    var sz = Math.random() * 3 + 1;
    s.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + (Math.random()*100) + '%;top:' + (Math.random()*100) + '%;--dur:' + (Math.random()*3+2) + 's;animation-delay:' + (Math.random()*5) + 's;';
    c.appendChild(s);
  }
})();

// ===== PANEL NAVIGATION =====
function showPanel(id) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
}

// ===== INIT =====
loadStats();
loadCategoryStats();
loadSettings();
if (typeof ALL_QUESTIONS !== 'undefined') {
  ALL_QUESTIONS.forEach(function(q, i) {
    if (!q.id) q.id = q.cat + '_' + i;
  });
}
updateCategoryCounts();
updateFooterStats();

setTimeout(function() {
  showPanel('pMenu');
  updateMenuStats();
  updatePlayBtn();
}, 2200);

// ===== UPDATE CAT COUNTS =====
function updateCategoryCounts() {
  if (typeof ALL_QUESTIONS === "undefined") return;
  var counts = {};
  ALL_QUESTIONS.forEach(function(q) { if (!counts[q.cat]) counts[q.cat] = 0; counts[q.cat]++; });
  document.querySelectorAll('.cat-item').forEach(function(item) {
    var cat = item.dataset.cat;
    var countEl = item.querySelector('.cat-count');
    if (!countEl) return;
    if (cat === 'all') { countEl.textContent = ALL_QUESTIONS.length + ' QS'; }
    else { countEl.textContent = (counts[cat] || 0) + ' QS'; }
  });
}

// ===== FOOTER STATS =====
function updateFooterStats() {
  if (typeof ALL_QUESTIONS === "undefined") return;
  const totalQuestions = ALL_QUESTIONS.length;
  const categories = [...new Set(ALL_QUESTIONS.map(q => q.cat))];
  document.getElementById("footer-stats").textContent = `${totalQuestions} questions across ${categories.length} categories`;
  document.getElementById("footer-categories").textContent = categories.join(" · ");
}

// ===== SETTINGS =====
function openSettings() {
  playSfx('tap');
  document.getElementById('settingsModal').classList.add('open');
}

document.getElementById('settingsModal').addEventListener('click', function(e) {
  if (e.target === document.getElementById('settingsModal'))
    document.getElementById('settingsModal').classList.remove('open');
});

document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('catSettingsBtn').addEventListener('click', openSettings);

function openHelp() {
  playSfx('tap');
  document.getElementById('settingsModal').classList.remove('open');
  showPanel('pHelp');
}
document.getElementById('helpBtn').addEventListener('click', openHelp);
document.getElementById('helpBackBtn').addEventListener('click', function() {
  playSfx('tap'); showPanel('pMenu');
});

document.getElementById('toggleSound').addEventListener('click', function() {
  this.classList.toggle('on');
  sfxEnabled = this.classList.contains('on');
  saveSettings();
  if (sfxEnabled) playSfx('tap');
});

document.getElementById('toggleMusic').addEventListener('click', function() {
  this.classList.toggle('on');
  musicEnabled = this.classList.contains('on');
  saveSettings();
  if (musicEnabled) { startMusic(); } else { stopMusic(); }
});

document.getElementById('toggleNotifs').addEventListener('click', function() {
  this.classList.toggle('on'); playSfx('tap');
});

// ===== MENU =====
function updatePlayBtn() {
  var btn = document.getElementById('playBtn');
  if (!btn) return;
  if (gameInProgress && !isZenMode) {
    btn.innerHTML = '<i class="bi bi-play-circle-fill"></i> Resume Game';
  } else {
    btn.innerHTML = '<i class="bi bi-play-circle-fill"></i> Play Now';
  }
}

document.getElementById('playBtn').addEventListener('click', function() {
  playSfx('tap');
  resumeAudio();
  if (gameInProgress && !isZenMode) {
    showPanel('pQuiz');
    startTimer(timeLeft);
  } else {
    isZenMode = false;
    showPanel('pCategories');
    refreshCategoryLockState();
  }
});

// ===== ZEN BUTTON =====
document.getElementById('zenBtn').addEventListener('click', function() {
  playSfx('tap');
  resumeAudio();
  startZenMode();
});

function updateMenuStats() {
  var data = getLevelData(totalScore);
  var level = data.level;
  document.getElementById('menuScore').textContent = totalScore;
  document.getElementById('menuLevel').textContent = 'LVL ' + level;
  document.getElementById('msBestScore').textContent = totalScore;
  document.getElementById('msTotalGames').textContent = totalGames;
  document.getElementById('msStreak').textContent = overallBestStreak;
  var xpBar = document.getElementById('xpBar');
  if (xpBar) {
    var percent = (data.currentXP / data.requiredXP) * 100;
    xpBar.style.width = percent + '%';
  }
  var rank = getRankData(level);
  var navRank = document.getElementById('navRank');
  if (navRank) {
    navRank.innerHTML =
      `<i class="bi ${rank.icon}" style="color:${rank.color};margin-right:6px;"></i>
       <span style="color:${rank.color};font-weight:700;">${rank.title}</span>`;
  }
}

// ===== CATEGORIES =====
document.getElementById('catBackBtn').addEventListener('click', function() {
  playSfx('tap'); showPanel('pMenu');
});

function refreshCategoryLockState() {
  document.querySelectorAll('.cat-item').forEach(function(item) {
    var cat = item.dataset.cat;
    var unlocked = isCategoryUnlocked(cat);
    var existing = item.querySelector('.cat-lock-overlay');
    if (existing) existing.remove();
    if (!unlocked) {
      item.classList.add('cat-locked');
      item.classList.remove('sel');
      var overlay = document.createElement('div');
      overlay.className = 'cat-lock-overlay';
      if (cat === 'all') {
        overlay.innerHTML = '<i class="bi bi-lock-fill" style="font-size:14px;color:rgba(255,255,255,0.85)"></i><div style="font-size:8px;font-weight:800;color:rgba(255,215,0,0.9);margin-top:2px;text-align:center;line-height:1.2;">2+ CATS</div>';
      } else {
        var req = getUnlockRequirement(cat);
        var label = req ? (req.total - req.answered) + ' left' : 'Locked';
        overlay.innerHTML = '<i class="bi bi-lock-fill" style="font-size:14px;color:rgba(255,255,255,0.85)"></i><div style="font-size:8px;font-weight:800;color:rgba(255,215,0,0.9);margin-top:2px;text-align:center;line-height:1.2;">' + label + '</div>';
      }
      item.appendChild(overlay);
    } else {
      item.classList.remove('cat-locked');
    }
  });
  if (!isCategoryUnlocked(selectedCat)) {
    selectedCat = 'entertainment';
    document.querySelectorAll('.cat-item').forEach(function(c) { c.classList.remove('sel'); });
    var entItem = document.querySelector('.cat-item[data-cat="entertainment"]');
    if (entItem) entItem.classList.add('sel');
  }
}

function showLockedToast(cat) {
  var existing = document.querySelector('.locked-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'locked-toast';
  var msg;
  if (cat === 'all') {
    msg = '<i class="bi bi-lock-fill" style="color:var(--sun);font-size:15px"></i> Unlock <strong>2+ categories</strong> to play All Topics!';
  } else {
    var req = getUnlockRequirement(cat);
    if (req) {
      var remaining = req.total - req.answered;
      msg = '<i class="bi bi-lock-fill" style="color:var(--sun);font-size:15px"></i> Answer <strong>' + remaining + ' more</strong> ' + req.prevCat + ' questions to unlock!';
    } else {
      msg = '<i class="bi bi-lock-fill" style="color:var(--sun);font-size:15px"></i> Complete previous categories first!';
    }
  }
  toast.innerHTML = msg;
  document.getElementById('pCategories').appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 10);
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}

document.querySelectorAll('.cat-item').forEach(function(item) {
  item.addEventListener('click', function() {
    var cat = item.dataset.cat;
    if (!isCategoryUnlocked(cat)) { playSfx('wrong'); showLockedToast(cat); return; }
    playSfx('tap');
    document.querySelectorAll('.cat-item').forEach(function(c) { c.classList.remove('sel'); });
    item.classList.add('sel');
    selectedCat = cat;
  });
});

document.querySelectorAll('.diff-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    playSfx('tap');
    document.querySelectorAll('.diff-btn').forEach(function(b) { b.className = 'diff-btn'; });
    btn.classList.add('sel-' + btn.dataset.diff);
    selectedDiff = btn.dataset.diff;
  });
});

document.getElementById('catStartBtn').addEventListener('click', function() {
  if (!isCategoryUnlocked(selectedCat)) { playSfx('wrong'); showLockedToast(selectedCat); return; }
  playSfx('tap');
  startQuiz();
});

// ===== START QUIZ =====
function startQuiz() {
  isZenMode = false;
  startMusic();
  var allPool = selectedCat === 'all'
    ? ALL_QUESTIONS.filter(function(q) { return isCategoryUnlocked(q.cat); })
    : ALL_QUESTIONS.filter(function(q) { return q.cat === selectedCat; });

  var unanswered = allPool.filter(function(q) {
    var answered = getAnsweredIds(q.cat);
    return answered.indexOf(q.id) === -1;
  });

  var pool = unanswered.slice();
  if (pool.length < TOTAL_Q) {
    var answered = allPool.filter(function(q) { return pool.indexOf(q) === -1; });
    answered.sort(function() { return Math.random() - 0.5; });
    pool = pool.concat(answered).slice(0, TOTAL_Q);
  }

  pool.sort(function() { return Math.random() - 0.5; });
  questions = pool.slice(0, TOTAL_Q);
  questions.forEach(function(q) { q._sessionAnswered = false; q._sessionCorrect = false; });

  currentQ = 0; score = 0; combo = 0; bestStreak = 0;
  correctCount = 0; wrongCount = 0; resultsSaved = false;
  gameInProgress = true;

  renderDots();
  showPanel('pQuiz');
  renderQ();
  updatePlayBtn();
}

// ===== ZEN MODE =====
function startZenMode() {
  isZenMode = true;
  gameInProgress = false;

  zenPool = ALL_QUESTIONS.slice().sort(function() { return Math.random() - 0.5; });
  zenPoolIndex = 0;
  zenAnsweredIds = [];
  zenTotalAnswered = 0;
  zenCorrect = 0;
  zenWrong = 0;
  zenBestStreak = 0;
  zenCombo = 0;
  answered = false;
  nextClicked = false;

  stopNormalMusic();
  startMusic();

  zenStartTime = Date.now();
  startZenClock();
  initZenTheme();

  updateZenCounter();
  showPanel('pZen');
  renderZenQ();
}

function getNextZenQuestion() {
  if (zenPoolIndex >= zenPool.length) {
    zenPool = ALL_QUESTIONS.slice().sort(function() { return Math.random() - 0.5; });
    zenPoolIndex = 0;
    zenAnsweredIds = [];
  }
  while (zenPoolIndex < zenPool.length) {
    var q = zenPool[zenPoolIndex];
    if (zenAnsweredIds.indexOf(q.id) === -1) {
      return q;
    }
    zenPoolIndex++;
  }
  zenPool = ALL_QUESTIONS.slice().sort(function() { return Math.random() - 0.5; });
  zenPoolIndex = 0;
  zenAnsweredIds = [];
  return zenPool[0];
}

function updateZenCounter() {
}

function startZenClock() {
  clearInterval(zenElapsedTimer);
  updateZenClockDisplay();
  zenElapsedTimer = setInterval(updateZenClockDisplay, 1000);
}

function stopZenClock() {
  clearInterval(zenElapsedTimer);
  zenElapsedTimer = null;
}

function updateZenClockDisplay() {
  var elapsed = Math.floor((Date.now() - zenStartTime) / 1000);
  var mins = Math.floor(elapsed / 60);
  var secs = elapsed % 60;
  var display = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
  var el = document.getElementById('zenTimer');
  if (el) el.textContent = display;
}

function getZenElapsedMinutes() {
  return Math.floor((Date.now() - zenStartTime) / 60000);
}

function renderZenQ() {
  clearTimeout(autoAdvanceTimer);
  answered = false;
  nextClicked = false;
  hideZenFeedback();

  var q = getNextZenQuestion();
  zenPool[zenPoolIndex] = q;
  var currentZenQ = q;

  var meta = CAT_META[q.cat] || { label: 'General', icon: 'bi-flag-fill' };
  document.getElementById('zenCat').innerHTML = '<i class="bi ' + meta.icon + '"></i> ' + meta.label;
  document.getElementById('zenText').textContent = q.text;

  var idxs = [0, 1, 2, 3];
  idxs.sort(function() { return Math.random() - 0.5; });
  var grid = document.getElementById('zenAnsGrid');
  grid.innerHTML = '';
  var letters = ['A', 'B', 'C', 'D'];
  letters.forEach(function(ltr, i) {
    var origIdx = idxs[i];
    var btn = document.createElement('button');
    btn.className = 'zen-ans-btn';
    btn.dataset.correct = origIdx === q.correct ? 'true' : 'false';
    btn.dataset.origIdx = origIdx;
    btn.innerHTML = '<div class="zen-ltr">' + ltr + '</div><div class="zen-atxt">' + q.answers[origIdx] + '</div>';
    btn.addEventListener('click', function() { handleZenAnswer(btn, origIdx === q.correct, currentZenQ); });
    grid.appendChild(btn);
  });
}

function handleZenAnswer(btn, isCorrect, q) {
  if (answered) return;
  answered = true;

  var allBtns = document.querySelectorAll('.zen-ans-btn');
  var correctBtn = null;
  allBtns.forEach(function(b) { if (b.dataset.correct === 'true') correctBtn = b; });

  zenAnsweredIds.push(q.id);
  zenPoolIndex++;
  zenTotalAnswered++;

  if (isCorrect) {
    btn.classList.add('zen-correct');
    zenCorrect++;
    zenCombo++;
    if (zenCombo > zenBestStreak) zenBestStreak = zenCombo;
    playSfx('correct');
    showZenFeedback(true, q.fact || 'Great answer!');
  } else {
    if (btn) btn.classList.add('zen-wrong');
    if (correctBtn) correctBtn.classList.add('zen-correct');
    zenWrong++;
    zenCombo = 0;
    playSfx('wrong');
    var ct = correctBtn ? correctBtn.querySelector('.zen-atxt').textContent : '';
    showZenFeedback(false, q.fact || ('Answer: ' + ct));
  }

  allBtns.forEach(function(b) {
    if (!b.classList.contains('zen-correct') && !b.classList.contains('zen-wrong')) b.classList.add('zen-dim');
    b.disabled = true;
  });

  updateZenCounter();
}

function showZenFeedback(correct, fact) {
  var bar = document.getElementById('zenFeedback');
  bar.className = 'zen-feedback show ' + (correct ? 'zen-fb-c' : 'zen-fb-w');
  document.getElementById('zenFbTitle').textContent = correct
    ? ['Correct', 'Wonderful', 'Beautiful', 'Well done'][Math.floor(Math.random()*4)]
    : ['Incorrect', 'Not quite', 'Almost', 'Try again'][Math.floor(Math.random()*4)];
  document.getElementById('zenFbDetail').textContent = fact;
}

function hideZenFeedback() {
  var bar = document.getElementById('zenFeedback');
  if (bar) bar.className = 'zen-feedback';
}

document.getElementById('zenNxtBtn').addEventListener('click', function() {
  if (nextClicked) return;
  playSfx('tap');
  nextClicked = true;
  hideZenFeedback();
  renderZenQ();
});

document.getElementById('zenBackBtn').addEventListener('click', function() {
  playSfx('tap');
  isPaused = true;

  var totalSecs = Math.floor((Date.now() - zenStartTime) / 1000);
  var mins = Math.floor(totalSecs / 60);
  var secs = totalSecs % 60;
  var timeStr;
  if (mins >= 1) {
    timeStr = mins + ' minute' + (mins !== 1 ? 's' : '');
    if (secs > 0) timeStr += ' ' + secs + 's';
  } else {
    timeStr = secs + ' second' + (secs !== 1 ? 's' : '');
  }

  var lines = [];
  lines.push('You explored <strong>' + zenTotalAnswered + '</strong> question' + (zenTotalAnswered !== 1 ? 's' : ''));
  lines.push('You flowed for <strong>' + timeStr + '</strong>');
  lines.push('Your longest calm streak was <strong>' + zenBestStreak + '</strong>');
  lines.push('You answered <strong>' + zenCorrect + '</strong> question' + (zenCorrect !== 1 ? 's' : '') + ' correctly');

  var el = document.getElementById('zenQuitProse');
  if (el) el.innerHTML = lines.join('<br>');

  document.getElementById('zenQuitModal').classList.add('open');
});

document.getElementById('zenResumeBtn').addEventListener('click', function() {
  playSfx('tap');
  document.getElementById('zenQuitModal').classList.remove('open');
  isPaused = false;
});

document.getElementById('zenQuitBtn').addEventListener('click', function() {
  playSfx('tap');
  document.getElementById('zenQuitModal').classList.remove('open');
  isZenMode = false;
  stopZenMusic();
  stopZenClock();
  destroyZenTheme();
  showPanel('pMenu');
  updateMenuStats();
  updatePlayBtn();
});

// ===== ASSIGN SPECIAL MODE =====
function assignSpecialMode(q) {
  var roll = Math.random();
  if (roll < FAST_MODE_CHANCE) {
    q.isFastMode = true; q.isRiskMode = false; q.isSuddenDeath = false;
  } else if (roll < FAST_MODE_CHANCE + RISK_MODE_CHANCE) {
    q.isFastMode = false; q.isRiskMode = true; q.isSuddenDeath = false;
  } else if (roll < FAST_MODE_CHANCE + RISK_MODE_CHANCE + SUDDEN_DEATH_CHANCE) {
    q.isFastMode = false; q.isRiskMode = false; q.isSuddenDeath = true;
  } else {
    q.isFastMode = false; q.isRiskMode = false; q.isSuddenDeath = false;
  }
}

// ===== RENDER QUESTION =====
function renderQ() {
  clearTimeout(autoAdvanceTimer);
  answered = false;
  nextClicked = false;
  hintUsed = false;
  hideFeedback();
  document.getElementById('nxtBtn').style.display = '';

  var bg = document.getElementById("bgMusic");
  if (bg && bg.paused && musicEnabled && !isZenMode) {
    bg.currentTime = 0;
    bg.play().catch(()=>{});
  }

  var q = questions[currentQ];
  assignSpecialMode(q);
  var baseSec = TIMER_SEC[selectedDiff];
  var sec = q.isFastMode ? Math.max(5, Math.floor(baseSec / 2)) : baseSec;

  document.getElementById('qNum').textContent = 'QUESTION ' + (currentQ + 1) + ' / ' + TOTAL_Q;
  document.getElementById('qScore').textContent = score;

  var meta = CAT_META[q.cat] || { label: 'General', icon: 'bi-flag-fill' };
  var badgeHTML = '<i class="bi ' + meta.icon + '"></i> ' + meta.label;
  if (q.isFastMode)    badgeHTML += ' <span class="fast-mode" style="background:linear-gradient(135deg,#00D4A8,#00B894);color:#000;padding:2px 7px;border-radius:20px;font-size:11px;font-weight:700;margin-left:4px;">⚡ Fast!</span>';
  else if (q.isRiskMode)    badgeHTML += ' <span class="risk-mode">🎲 Risk!</span>';
  else if (q.isSuddenDeath) badgeHTML += ' <span class="sudden-mode">💀 Sudden Death!</span>';
  document.getElementById('qBadge').innerHTML = badgeHTML;
  document.getElementById('qText').textContent = q.text;

  var existing = document.getElementById('scoreHintRow');
  if (existing) existing.remove();
  var canAffordHint = totalScore >= HINT_COST;
  var scoreHintRow = document.createElement('div');
  scoreHintRow.id = 'scoreHintRow';
  scoreHintRow.className = 'score-hint-row';
  scoreHintRow.innerHTML =
    '<div class="q-best-score-display">' +
      '<i class="bi bi-trophy-fill"></i>' +
      '<div><div id="qBestScoreDisplay">' + totalScore + '</div><div class="q-best-label">Best</div></div>' +
    '</div>' +
    '<button class="hint-btn' + (!canAffordHint ? ' hint-disabled' : '') + '" id="hintBtn"' + (!canAffordHint ? ' disabled' : '') + '>' +
      '<i class="bi bi-lightbulb-fill"></i><span>Hint</span><span class="hint-cost-badge">-' + HINT_COST + '</span>' +
    '</button>';
  var ansGrid = document.getElementById('ansGrid');
  ansGrid.parentNode.insertBefore(scoreHintRow, ansGrid);

  document.getElementById('hintBtn').addEventListener('click', function() {
    if (hintUsed || answered) return;
    if (totalScore < HINT_COST) { showHintToast('Need ' + HINT_COST + ' best score to use a hint!'); return; }
    useHint(q);
  });

  var idxs = [0, 1, 2, 3];
  idxs.sort(function() { return Math.random() - 0.5; });
  var grid = document.getElementById('ansGrid');
  grid.innerHTML = '';
  var letters = ['A', 'B', 'C', 'D'];
  letters.forEach(function(ltr, i) {
    var origIdx = idxs[i];
    var btn = document.createElement('button');
    btn.className = 'ans-btn';
    btn.dataset.correct = origIdx === q.correct ? 'true' : 'false';
    btn.dataset.origIdx = origIdx;
    btn.innerHTML = '<div class="ltr">' + ltr + '</div><div class="atxt">' + q.answers[origIdx] + '</div>';
    btn.addEventListener('click', function() { handleAnswer(btn, origIdx === q.correct, q); });
    grid.appendChild(btn);
  });

  updateDot(currentQ, 'dq');
  startTimer(sec);
}

// ===== USE HINT =====
function useHint(q) {
  hintUsed = true;
  playSfx('tap');
  totalScore = Math.max(0, totalScore - HINT_COST);
  saveStats();
  var bestEl = document.getElementById('qBestScoreDisplay');
  if (bestEl) bestEl.textContent = totalScore;
  var hintBtn = document.getElementById('hintBtn');
  if (hintBtn) {
    hintBtn.classList.add('hint-used');
    hintBtn.classList.remove('hint-disabled');
    hintBtn.disabled = true;
    hintBtn.innerHTML = '<i class="bi bi-lightbulb-fill"></i><span>Used</span>';
  }
  var allBtns = Array.from(document.querySelectorAll('.ans-btn'));
  var wrongBtns = allBtns.filter(function(b) { return b.dataset.correct !== 'true'; });
  wrongBtns.sort(function() { return Math.random() - 0.5; });
  wrongBtns.slice(0, 2).forEach(function(b) { b.classList.add('dim'); b.disabled = true; });
  showHintToast('2 wrong answers removed! (-' + HINT_COST + ' from your best score)');
}

function showHintToast(msg) {
  var existing = document.querySelector('.hint-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'hint-toast';
  toast.innerHTML = '<i class="bi bi-lightbulb-fill" style="color:var(--sun)"></i> ' + msg;
  document.getElementById('pQuiz').appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 10);
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2400);
}

// ===== TIMER =====
function startTimer(sec) {
  clearInterval(quizTimer);
  timeLeft = sec;
  updateTimerUI(sec, sec);
  quizTimer = setInterval(function() {
    timeLeft--;
    updateTimerUI(timeLeft, sec);
    if (timeLeft <= 5 && timeLeft > 0) playSfx('tick');
    if (timeLeft <= 0) {
      clearInterval(quizTimer);
      if (!answered) { playSfx('timeup'); handleAnswer(null, false, questions[currentQ], true); }
    }
  }, 1000);
}

function updateTimerUI(t, total) {
  var pct = (t / total) * 100;
  var bar = document.getElementById('timerBar');
  bar.style.width = pct + '%';
  bar.className = 'timer-bar' + (pct < 35 ? ' warn' : '');
  document.getElementById('timerText').textContent = t + 's';
}

function updateQuizScoreDisplay() {
  var qScore = document.getElementById('qScore');
  if (qScore) qScore.textContent = score;
  refreshHintBtnState();
}

function refreshHintBtnState() {
  var hintBtn = document.getElementById('hintBtn');
  if (!hintBtn || hintUsed) return;
  if (totalScore < HINT_COST) { hintBtn.classList.add('hint-disabled'); hintBtn.disabled = true; }
  else { hintBtn.classList.remove('hint-disabled'); hintBtn.disabled = false; }
}

// ===== HANDLE ANSWER =====
function handleAnswer(btn, isCorrect, q, timedOut) {
  if (answered) return;
  answered = true;
  clearInterval(quizTimer);
  var hintBtn = document.getElementById('hintBtn');
  if (hintBtn) hintBtn.disabled = true;
  var allBtns = document.querySelectorAll('.ans-btn');
  var correctBtn = null;
  allBtns.forEach(function(b) { if (b.dataset.correct === 'true') correctBtn = b; });

  if (isCorrect) {
    btn.classList.add('correct');
    var pts = selectedDiff === 'easy' ? 10 : selectedDiff === 'medium' ? 15 : 20;
    var bonus = Math.floor(timeLeft * 0.5);
    if (q.isFastMode) { bonus += 5; btn.innerHTML += ' <span class="fast-mode-bonus">⚡+5!</span>'; }
    if (q.isRiskMode) { bonus += 5; btn.innerHTML += ' <span class="fast-mode-bonus" style="color:#ff9900;">🎲+5!</span>'; }
    score += pts + bonus;
    combo++;
    correctCount++;
    q.correctlyAnswered = true;
    q._sessionAnswered = true;
    q._sessionCorrect = true;
    if (combo > bestStreak) bestStreak = combo;
    updateQuizScoreDisplay();
    updateDot(currentQ, 'dc');
    var detailMsg = '+' + (pts + bonus) + ' pts!';
    if (q.isSuddenDeath) detailMsg += ' 💀 You survived!';
    if (q.isRiskMode)    detailMsg += ' 🎲 Risk paid off!';
    if (q.isFastMode)    detailMsg += ' ⚡ Speed bonus!';
    showFeedback(true, q.fact, detailMsg);
    if (combo >= 3) { showComboPop(); playSfx('combo'); }
    else { playSfx('correct'); }
    spawnConfetti();
  } else {
    if (btn) btn.classList.add('wrong');
    if (correctBtn) correctBtn.classList.add('correct');
    playSfx('wrong');
    if (q.isRiskMode) { score = Math.max(0, score - 5); updateQuizScoreDisplay(); }
    combo = 0;
    wrongCount++;
    q._sessionAnswered = true;
    q._sessionCorrect = false;
    updateDot(currentQ, 'dw');
    var ct = correctBtn ? correctBtn.querySelector('.atxt').textContent : '';
    var wrongMsg = timedOut ? "Time's up! Answer: " + ct : 'Wrong! Answer: ' + ct;
    if (q.isRiskMode)    wrongMsg += ' 🎲 -5 pts!';
    if (q.isSuddenDeath) wrongMsg = '💀 SUDDEN DEATH! ' + (timedOut ? "Time's up!" : 'Wrong!') + ' Answer: ' + ct;
    showFeedback(false, q.fact, wrongMsg);
    if (q.isSuddenDeath) {
      allBtns.forEach(function(b) {
        if (!b.classList.contains('correct') && !b.classList.contains('wrong')) b.classList.add('dim');
        b.disabled = true;
      });
      document.getElementById('nxtBtn').style.display = 'none';
      setTimeout(function() { showResults(true); }, 2500);
      return;
    }
  }
  allBtns.forEach(function(b) {
    if (!b.classList.contains('correct') && !b.classList.contains('wrong')) b.classList.add('dim');
    b.disabled = true;
  });
}

function renderDots() {
  var c = document.getElementById('progressDots');
  c.innerHTML = '';
  for (var i = 0; i < TOTAL_Q; i++) {
    var d = document.createElement('div');
    d.className = 'dot'; d.id = 'd' + i;
    c.appendChild(d);
  }
}

function updateDot(i, cls) {
  var d = document.getElementById('d' + i);
  if (d) d.className = 'dot ' + cls;
}

function showFeedback(correct, fact, detail) {
  var bar = document.getElementById('feedback');
  bar.className = 'feedback show ' + (correct ? 'fb-c' : 'fb-w');
  var icon = document.getElementById('fbIco');
  icon.innerHTML = correct
    ? '<i class="bi bi-check-circle-fill" style="color:#00D4A8;font-size:28px"></i>'
    : '<i class="bi bi-x-circle-fill" style="color:#FF3347;font-size:28px"></i>';
  var titles_c = ['Correct!', 'Excellent!', 'Amazing!', 'Brilliant!'];
  var titles_w = ['Wrong!', 'Oops!', 'Not Quite!', 'Missed It!'];
  document.getElementById('fbTitle').textContent = correct ? titles_c[Math.floor(Math.random()*4)] : titles_w[Math.floor(Math.random()*4)];
  document.getElementById('fbDetail').textContent = fact || detail;
}

function hideFeedback() {
  document.getElementById('feedback').className = 'feedback';
}

document.getElementById('nxtBtn').addEventListener('click', function() {
  if (nextClicked) return;
  playSfx('tap');
  nextClicked = true;
  clearTimeout(autoAdvanceTimer);
  hideFeedback();
  currentQ++;
  if (currentQ >= TOTAL_Q) showResults(false);
  else renderQ();
});

// ===== COMBO POP =====
function showComboPop() {
  var labels = { 3: '3x Combo!', 4: '4x Combo!', 5: '5x Combo! Incredible!', 6: 'Super Combo!', 7: 'Legendary!' };
  var label = labels[combo] || (combo >= 8 ? combo + 'x Combo!' : null);
  if (!label) return;
  var el = document.createElement('div');
  el.className = 'combo-pop';
  el.textContent = label;
  document.getElementById('pQuiz').appendChild(el);
  setTimeout(function() { el.remove(); }, 950);
}

// ===== CONFETTI =====
function spawnConfetti() {
  var colors = ['#FFD700','#FF6B35','#00D4A8','#FF3347','#1A5FFF','#9B5DE5'];
  for (var i = 0; i < 18; i++) {
    var el = document.createElement('div');
    el.className = 'confetti-p';
    el.style.cssText = 'left:' + (Math.random()*100) + '%;background:' + colors[Math.floor(Math.random()*colors.length)] + ';width:' + (Math.random()*7+5) + 'px;height:' + (Math.random()*7+5) + 'px;border-radius:' + (Math.random()>.5?'50%':'2px') + ';--dur:' + (Math.random()*1.5+1) + 's;--delay:' + (Math.random()*0.3) + 's;';
    document.body.appendChild(el);
    setTimeout(function(e) { e.remove(); }, 2500, el);
  }
}

// ===== RESULTS =====
function showResults(suddenDeath) {
  clearInterval(quizTimer);
  gameInProgress = false;
  updatePlayBtn();
  if (!resultsSaved) {
    resultsSaved = true;
    totalGames++;
    totalScore += score;
    overallBestStreak = Math.max(overallBestStreak, bestStreak);
    saveStats();
    saveCategoryStats();
    var bestEl = document.getElementById('qBestScoreDisplay');
    if (bestEl) bestEl.textContent = totalScore;
  }

  stopNormalMusic();

  var pct = Math.round((correctCount / TOTAL_Q) * 100);
  var trophyIcon, title, msg;

  if (suddenDeath) {
    trophyIcon = '<i class="bi bi-shield-fill-exclamation" style="color:#FF3347;font-size:60px"></i>';
    title = 'Sudden Death!'; msg = '💀 One wrong answer ended your run!';
  } else if (pct >= 90) {
    trophyIcon = '<i class="bi bi-trophy-fill" style="color:#FFD700;font-size:60px"></i>';
    title = 'Outstanding!'; msg = 'True Filipino pride! You aced it!';
  } else if (pct >= 70) {
    trophyIcon = '<i class="bi bi-award-fill" style="color:#C0C0C0;font-size:60px"></i>';
    title = 'Great Job!'; msg = 'Almost perfect — a little more practice!';
  } else if (pct >= 50) {
    trophyIcon = '<i class="bi bi-hand-thumbs-up-fill" style="color:#CD7F32;font-size:60px"></i>';
    title = 'Not Bad!'; msg = 'You can do better — keep learning!';
  } else {
    trophyIcon = '<i class="bi bi-arrow-repeat" style="color:var(--muted);font-size:60px"></i>';
    title = 'Keep Trying!'; msg = "Don't give up! Practice makes perfect!";
  }

  document.getElementById('resTrophy').innerHTML = trophyIcon;
  document.getElementById('resTitle').textContent = title;
  document.getElementById('resMsg').textContent = msg;
  document.getElementById('ringScore').textContent = score;

  var basePts = selectedDiff === 'easy' ? 10 : selectedDiff === 'medium' ? 15 : 20;
  var maxTimeSec = TIMER_SEC[selectedDiff];
  var maxTimeBonus = Math.floor(maxTimeSec * 0.5);
  var maxPts = TOTAL_Q * (basePts + maxTimeBonus);
  document.getElementById('ringOf').textContent = '/ ' + maxPts + ' max';
  document.getElementById('rsCorrect').textContent = correctCount;
  document.getElementById('rsWrong').textContent = wrongCount;
  document.getElementById('rsStreak').textContent = bestStreak;

  showPanel('pResults');
  playSfx('results');

  var ring = document.getElementById('scoreRing');
  var prog = 0;
  var iv = setInterval(function() {
    prog = Math.min(prog + 2, pct);
    ring.style.setProperty('--pct', prog * 3.6 + 'deg');
    if (prog >= pct) clearInterval(iv);
  }, 20);

  if (!suddenDeath && pct >= 70) {
    setTimeout(function() {
      for (var i = 0; i < 3; i++) setTimeout(spawnConfetti, i * 400);
    }, 300);
  }
}

document.getElementById('retryBtn').addEventListener('click', function() {
  playSfx('tap');
  gameInProgress = false;
  startQuiz();
});

document.getElementById('homeBtn').addEventListener('click', function() {
  playSfx('tap');
  gameInProgress = false;
  showPanel('pMenu');
  updateMenuStats();
  updatePlayBtn();
});

// ===== QUIZ BACK =====
document.getElementById('quizBackBtn').addEventListener('click', function() {
  playSfx('tap'); isPaused = true; clearInterval(quizTimer);
  document.getElementById('quitModal').classList.add('open');
});

document.getElementById('resumeBtn').addEventListener('click', function() {
  playSfx('tap');
  document.getElementById('quitModal').classList.remove('open');
  isPaused = false; startTimer(timeLeft);
});

document.getElementById('quitBtn').addEventListener('click', function() {
  playSfx('tap');
  document.getElementById('quitModal').classList.remove('open');
  clearInterval(quizTimer);
  stopNormalMusic();
  showPanel('pMenu');
  updateMenuStats();
  updatePlayBtn();
});

// ===== OPEN LEVEL PANEL =====
document.querySelector('.nav-score-pill').addEventListener('click', function() {
  playSfx('tap'); showLevelPanel();
});

document.getElementById('levelBackBtn').addEventListener('click', function() {
  playSfx('tap'); showPanel('pMenu');
});

// ===== RENDER LEVEL PANEL =====
function showLevelPanel() {
  showPanel('pLevel');
  var topCat = getTopCategory();
  document.getElementById('levelTitle').innerHTML =
    `You're knowledgeable at <span class="level-title-gradient">${topCat}</span>`;

  var container = document.getElementById('levelBars');
  container.innerHTML = '';

  CAT_ORDER.forEach(function(cat) {
    var unlocked = isCategoryUnlocked(cat);
    var answeredInCat = getTotalAnsweredInCat(cat);
    var totalInCat = ALL_QUESTIONS.filter(function(q) { return q.cat === cat; }).length;
    var pct = totalInCat === 0 ? 0 : Math.round((answeredInCat / totalInCat) * 100);

    var lockTag;
    if (unlocked) {
      lockTag = '<span style="font-size:10px;color:var(--teal);font-weight:800;">✓ Unlocked</span>';
    } else {
      var req = getUnlockRequirement(cat);
      if (req) {
        var remaining = req.total - req.answered;
        lockTag = '<span style="font-size:10px;color:var(--wrong);font-weight:800;"><i class="bi bi-lock-fill"></i> Answer ' + remaining + ' more in ' + req.prevCat + '</span>';
      } else {
        lockTag = '<span style="font-size:10px;color:var(--wrong);font-weight:800;"><i class="bi bi-lock-fill"></i> Locked</span>';
      }
    }

    var el = document.createElement('div');
    el.className = 'level-bar-wrap';
    el.innerHTML = `
      <div class="level-bar-label">
        <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
        <div style="display:flex;align-items:center;gap:8px;">${lockTag}<span>${pct}%</span></div>
      </div>
      <div class="level-bar-bg">
        <div class="level-bar-fill" style="opacity:${unlocked ? 1 : 0.35}"></div>
      </div>
    `;
    container.appendChild(el);
    var fill = el.querySelector('.level-bar-fill');
    setTimeout(function() { fill.style.width = pct + '%'; }, 100);
  });
}

function getTopCategory() {
  if (typeof ALL_QUESTIONS === "undefined") return "Entertainment";
  var cats = CAT_ORDER.filter(function(cat) { return isCategoryUnlocked(cat); });
  if (cats.length === 0) return "Entertainment";
  var allTimeStats = loadCategoryStats();
  var top = cats.slice().sort(function(a, b) {
    return (allTimeStats[b] || 0) - (allTimeStats[a] || 0);
  })[0];
  if (!allTimeStats[top]) return top.charAt(0).toUpperCase() + top.slice(1);
  return top.charAt(0).toUpperCase() + top.slice(1);
}

function questionsAnsweredInCategory(cat) {
  return getTotalAnsweredInCat(cat);
}

// =============================================================
//  ZEN THEME ENGINE
//  Cycles: mist to sunset to snow tp dawn → mist …
//  Interval: 5 minutes (300 000 ms)
// =============================================================

var ZEN_THEMES = [
  {
    name: 'mist',
    bg: [
      'radial-gradient(ellipse at 20% 15%, rgba(173,216,230,0.18) 0%, transparent 55%)',
      'radial-gradient(ellipse at 80% 80%, rgba(205,180,219,0.14) 0%, transparent 55%)',
      'radial-gradient(ellipse at 50% 50%, rgba(168,216,168,0.07) 0%, transparent 65%)',
      'linear-gradient(180deg, #0f1a1e 0%, #111820 50%, #131418 100%)'
    ].join(','),
    snow: false
  },
  {
    name: 'sunset',
    bg: [
      'radial-gradient(ellipse at 50% 85%, rgba(255,100,20,0.60) 0%, transparent 55%)',
      'radial-gradient(ellipse at 50% 95%, rgba(255,160,30,0.35) 0%, transparent 40%)',
      'radial-gradient(ellipse at 20% 60%, rgba(200,40,60,0.22) 0%, transparent 50%)',
      'radial-gradient(ellipse at 80% 50%, rgba(180,30,80,0.18) 0%, transparent 50%)',
      'linear-gradient(180deg, #06030a 0%, #120510 25%, #1e0808 55%, #2a0e06 78%, #180804 100%)'
    ].join(','),
    snow: false
  },
  {
    name: 'snow',
    bg: [
      'radial-gradient(ellipse at 30% 10%, rgba(180,210,255,0.22) 0%, transparent 55%)',
      'radial-gradient(ellipse at 70% 80%, rgba(140,180,240,0.14) 0%, transparent 55%)',
      'linear-gradient(180deg, #060e18 0%, #091525 40%, #0b1a2e 100%)'
    ].join(','),
    snow: true
  },
  {
    name: 'dawn',
    bg: [
      'radial-gradient(ellipse at 50% 100%, rgba(255,180,120,0.28) 0%, transparent 35%)',
      'radial-gradient(ellipse at 50% 95%,  rgba(220,120,160,0.18) 0%, transparent 30%)',
      'radial-gradient(ellipse at 20% 40%,  rgba(80,60,180,0.14)  0%, transparent 50%)',
      'radial-gradient(ellipse at 80% 20%,  rgba(60,40,160,0.10)  0%, transparent 45%)',
      'linear-gradient(180deg, #05040f 0%, #090818 30%, #0e0a22 60%, #130c18 85%, #0c0810 100%)'
    ].join(','),
    snow: false
  }
];

var zenThemeIndex   = 0;
var zenThemeTimer   = null;
var zenSnowRunning  = false;
var zenSnowAF       = null;
var zenSnowFlakes   = [];
var zenSunsetRunning = false;
var zenSunsetAF      = null;

var ZEN_THEME_INTERVAL = 5 * 60 * 1000; // 5 minutes

function initZenTheme() {
  zenThemeIndex = 0;
  applyZenTheme(zenThemeIndex, false);
  zenThemeTimer = setInterval(function() {
    zenThemeIndex = (zenThemeIndex + 1) % ZEN_THEMES.length;
    applyZenTheme(zenThemeIndex, true);
  }, ZEN_THEME_INTERVAL);
}

function destroyZenTheme() {
  clearInterval(zenThemeTimer);
  zenThemeTimer = null;
  stopSnow();
  stopSunsetAnim();
  var pZen = document.getElementById('pZen');
  if (pZen) {
    ZEN_THEMES.forEach(function(t) { pZen.classList.remove('theme-' + t.name); });
  }
}

function applyZenTheme(idx, animate) {
  var theme  = ZEN_THEMES[idx];
  var pZen   = document.getElementById('pZen');
  var bgEl   = document.getElementById('zenBg');
  var bgNext = document.getElementById('zenBgNext');
  if (!pZen || !bgEl || !bgNext) return;

  if (animate) {
    bgNext.style.background = theme.bg;
    bgNext.style.opacity = '0';
    bgNext.style.transition = 'none';
    void bgNext.offsetWidth;

    bgNext.style.transition = 'opacity 5s ease-in-out';
    bgNext.style.opacity = '1';

    setTimeout(function() {
      ZEN_THEMES.forEach(function(t) { pZen.classList.remove('theme-' + t.name); });
      pZen.classList.add('theme-' + theme.name);
      if (theme.snow)   { startSnow();   } else { stopSnow();   }
      if (theme.name === 'sunset') { startSunsetAnim(); } else { stopSunsetAnim(); }
    }, 2500);

    setTimeout(function() {
      bgEl.style.background = theme.bg;
      bgNext.style.transition = 'none';
      bgNext.style.opacity = '0';
    }, 5200);

  } else {
    bgEl.style.background = theme.bg;
    bgNext.style.opacity = '0';
    ZEN_THEMES.forEach(function(t) { pZen.classList.remove('theme-' + t.name); });
    pZen.classList.add('theme-' + theme.name);
    if (theme.snow)   { startSnow();   } else { stopSnow();   }
    if (theme.name === 'sunset') { startSunsetAnim(); } else { stopSunsetAnim(); }
  }
}



// ===== SUNSET LIGHT ANIMATION =====
function startSunsetAnim() {
  if (zenSunsetRunning) return;
  var canvas = document.getElementById('zenSunsetCanvas');
  if (!canvas) return;

  zenSunsetRunning = true;
  canvas.classList.add('active');

  var pZen = document.getElementById('pZen');
  canvas.width  = pZen ? pZen.clientWidth  : 430;
  canvas.height = pZen ? pZen.clientHeight : 932;

  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var blobs = [
    { cx: W*0.50, cy: H*0.82, r: W*0.55, drift: 0,    riseSpd: 0.12, swaySpd: 0.0008, sway: 0,         color: [255,110,30],  alpha: 0.38 },
    { cx: W*0.35, cy: H*0.90, r: W*0.42, drift: 0.7,  riseSpd: 0.09, swaySpd: 0.0011, sway: Math.PI,   color: [255,60,10],   alpha: 0.22 },
    { cx: W*0.65, cy: H*0.88, r: W*0.40, drift: -0.5, riseSpd: 0.10, swaySpd: 0.0009, sway: Math.PI/2, color: [230,90,20],   alpha: 0.20 },
    { cx: W*0.50, cy: H*0.96, r: W*0.65, drift: 0,    riseSpd: 0.07, swaySpd: 0.0006, sway: 0,         color: [255,160,40],  alpha: 0.18 },
  ];

  function updateBlob(b) {
    b.sway  += b.swaySpd;
    b.cy    -= b.riseSpd;
    b.cx    += Math.sin(b.sway) * 0.30 + b.drift * 0.04;

    if (b.cy < -b.r * 0.5) {
      b.cy  = H + b.r * 0.3;
      b.cx  = W * (0.25 + Math.random() * 0.5);
    }
    if (b.cx < -b.r * 0.4) b.cx = W + b.r * 0.2;
    if (b.cx > W + b.r * 0.4) b.cx = -b.r * 0.2;
  }

  function drawSunset() {
    if (!zenSunsetRunning) return;
    ctx.clearRect(0, 0, W, H);

    blobs.forEach(function(b) {
      updateBlob(b);
      var grad = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, b.r);
      grad.addColorStop(0,   'rgba('+b.color[0]+','+b.color[1]+','+b.color[2]+','+b.alpha+')');
      grad.addColorStop(0.45,'rgba('+b.color[0]+','+b.color[1]+','+b.color[2]+','+(b.alpha*0.5)+')');
      grad.addColorStop(1,   'rgba('+b.color[0]+','+b.color[1]+','+b.color[2]+',0)');
      ctx.beginPath();
      ctx.arc(b.cx, b.cy, b.r, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    zenSunsetAF = requestAnimationFrame(drawSunset);
  }

  drawSunset();
}

function stopSunsetAnim() {
  if (!zenSunsetRunning) return;
  zenSunsetRunning = false;
  var canvas = document.getElementById('zenSunsetCanvas');
  if (canvas) {
    canvas.classList.remove('active');

    setTimeout(function() {
      if (!zenSunsetRunning) { // stopped
        if (zenSunsetAF) { cancelAnimationFrame(zenSunsetAF); zenSunsetAF = null; }
        var ctx2 = canvas.getContext('2d');
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 2800);
  } else {
    if (zenSunsetAF) { cancelAnimationFrame(zenSunsetAF); zenSunsetAF = null; }
  }
}

// ===== SNOW PARTICLE SYSTEM =====
function startSnow() {
  if (zenSnowRunning) return;
  var canvas = document.getElementById('zenSnowCanvas');
  if (!canvas) return;

  zenSnowRunning = true;
  canvas.classList.add('active');

  var pZen = document.getElementById('pZen');
  canvas.width  = pZen ? pZen.clientWidth  : 430;
  canvas.height = pZen ? pZen.clientHeight : 932;

  var ctx = canvas.getContext('2d');
  var W = canvas.width;
  var H = canvas.height;

  var FLAKE_COUNT = 90;
  zenSnowFlakes = [];
  for (var i = 0; i < FLAKE_COUNT; i++) {
    zenSnowFlakes.push(createFlake(W, H, true));
  }

  function createFlake(W, H, randomY) {
    var radius = Math.random() * 2.8 + 0.8;
    return {
      x:       Math.random() * W,
      y:       randomY ? Math.random() * H : -radius * 2,
      radius:  radius,
      speed:   Math.random() * 0.8 + 0.25,
      drift:   (Math.random() - 0.5) * 0.35,
      sway:    Math.random() * Math.PI * 2,
      swaySpd: Math.random() * 0.008 + 0.003,
      opacity: Math.random() * 0.5 + 0.3
    };
  }

  function drawFrame() {
    if (!zenSnowRunning) return;
    ctx.clearRect(0, 0, W, H);

    zenSnowFlakes.forEach(function(f) {
      f.sway += f.swaySpd;
      f.x    += f.drift + Math.sin(f.sway) * 0.4;
      f.y    += f.speed;

      if (f.y > H + f.radius * 2) {
        f.x      = Math.random() * W;
        f.y      = -f.radius * 2;
        f.radius = Math.random() * 2.8 + 0.8;
        f.speed  = Math.random() * 0.8 + 0.25;
        f.opacity = Math.random() * 0.5 + 0.3;
      }
      if (f.x > W + 10) f.x = -10;
      if (f.x < -10)    f.x = W + 10;

      var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
      grad.addColorStop(0,   'rgba(220, 238, 255, ' + f.opacity + ')');
      grad.addColorStop(0.6, 'rgba(200, 225, 255, ' + (f.opacity * 0.6) + ')');
      grad.addColorStop(1,   'rgba(180, 210, 255, 0)');
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    zenSnowAF = requestAnimationFrame(drawFrame);
  }

  drawFrame();
}

function stopSnow() {
  if (!zenSnowRunning) return;
  zenSnowRunning = false;
  var canvas = document.getElementById('zenSnowCanvas');
  if (!canvas) { zenSnowFlakes = []; return; }

  canvas.classList.remove('active');

  var stopCtx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var flakesRef = zenSnowFlakes;

  function fadeFrame() {
    stopCtx.clearRect(0, 0, W, H);
    flakesRef.forEach(function(f) {
      f.sway += f.swaySpd;
      f.x    += f.drift + Math.sin(f.sway) * 0.4;
      f.y    += f.speed;
      if (f.y > H + f.radius * 2) { f.x = Math.random()*W; f.y = -f.radius*2; }
      if (f.x > W+10) f.x = -10;
      if (f.x < -10)  f.x = W+10;
      var grad = stopCtx.createRadialGradient(f.x,f.y,0, f.x,f.y,f.radius);
      grad.addColorStop(0,   'rgba(220,238,255,'+f.opacity+')');
      grad.addColorStop(0.6, 'rgba(200,225,255,'+(f.opacity*0.6)+')');
      grad.addColorStop(1,   'rgba(180,210,255,0)');
      stopCtx.beginPath();
      stopCtx.arc(f.x, f.y, f.radius, 0, Math.PI*2);
      stopCtx.fillStyle = grad;
      stopCtx.fill();
    });
    zenSnowAF = requestAnimationFrame(fadeFrame);
  }

  if (zenSnowAF) { cancelAnimationFrame(zenSnowAF); zenSnowAF = null; }
  fadeFrame();
  setTimeout(function() {
    if (zenSnowAF) { cancelAnimationFrame(zenSnowAF); zenSnowAF = null; }
    stopCtx.clearRect(0, 0, W, H);
    zenSnowFlakes = [];
  }, 2800);
}


});
