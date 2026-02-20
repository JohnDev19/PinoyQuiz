// ===== WEB AUDIO - SOUND ENGINE =====
var audioCtx = null;
var sfxEnabled = true;
var isPaused = false;
var musicEnabled = true;

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
    switch (type) {
      case 'tap': playTap(ctx); break;
      case 'correct': playCorrect(ctx); break;
      case 'wrong': playWrong(ctx); break;
      case 'combo': playCombo(ctx); break;
      case 'tick': playTick(ctx); break;
      case 'timeup': playTimeUp(ctx); break;
      case 'results': playResults(ctx); break;
    }
  } catch (e) { /* ignore audio errors */ }
}

function playTap(ctx) {
  var o = ctx.createOscillator();
  var g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(1200, ctx.currentTime);
  g.gain.setValueAtTime(0.12, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime);
  o.stop(ctx.currentTime + 0.06);
}

function playCorrect(ctx) {
  var t = ctx.currentTime;
  [587, 784].forEach(function(freq, i) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t + i * 0.1);
    g.gain.setValueAtTime(0.25, t + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.1);
    o.stop(t + i * 0.1 + 0.2);
  });
}

function playWrong(ctx) {
  var t = ctx.currentTime;
  var o = ctx.createOscillator();
  var g = ctx.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(250, t);
  o.frequency.linearRampToValueAtTime(100, t + 0.3);
  g.gain.setValueAtTime(0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  o.connect(g); g.connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.35);
}

function playCombo(ctx) {
  var t = ctx.currentTime;
  [523, 659, 784, 1047].forEach(function(freq, i) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t + i * 0.07);
    g.gain.setValueAtTime(0.2, t + i * 0.07);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.15);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.07);
    o.stop(t + i * 0.07 + 0.15);
  });
}

function playTick(ctx) {
  var o = ctx.createOscillator();
  var g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(880, ctx.currentTime);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime);
  o.stop(ctx.currentTime + 0.05);
}

function playTimeUp(ctx) {
  var t = ctx.currentTime;
  [400, 300, 200].forEach(function(freq, i) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(freq, t + i * 0.12);
    g.gain.setValueAtTime(0.1, t + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.15);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.12);
    o.stop(t + i * 0.12 + 0.15);
  });
}

function playResults(ctx) {
  var t = ctx.currentTime;
  [392, 494, 587, 784, 988].forEach(function(freq, i) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t + i * 0.12);
    g.gain.setValueAtTime(0.18, t + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.3);
    o.connect(g); g.connect(ctx.destination);
    o.start(t + i * 0.12);
    o.stop(t + i * 0.12 + 0.3);
  });
}

// ===== BACKGROUND MUSIC (MP3 VERSION) =====
var bgMusic = null;

function startMusic() {
  if (!musicEnabled) return;

  if (!bgMusic) {
    bgMusic = document.getElementById('bgMusic');
  }

  bgMusic.volume = 0.7;
  bgMusic.play().catch(function(){});
}

function stopMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
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
var totalScore = 0;
var totalGames = 0;
var overallBestStreak = 0;
var TOTAL_Q = 10;
var TIMER_SEC = { easy: 20, medium: 15, hard: 10 };

// ===== LOAD SAVED STATS =====
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
    localStorage.setItem('pq_stats', JSON.stringify({ totalScore: totalScore, totalGames: totalGames, overallBestStreak: overallBestStreak }));
  } catch(e) {}
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

// ===== LOADING =====
loadStats();
loadSettings();

setTimeout(function() {
  showPanel('pMenu');
  updateMenuStats();
  startMusic();
}, 2200);

// ===== SETTINGS =====
function openSettings() {
  playSfx('tap');
  document.getElementById('settingsModal').classList.add('open');
}

document.getElementById('settingsModal').addEventListener('click', function(e) {
  if (e.target === document.getElementById('settingsModal')) {
    document.getElementById('settingsModal').classList.remove('open');
  }
});

document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('catSettingsBtn').addEventListener('click', openSettings);

// Sound toggle
document.getElementById('toggleSound').addEventListener('click', function() {
  this.classList.toggle('on');
  sfxEnabled = this.classList.contains('on');
  saveSettings();
  if (sfxEnabled) playSfx('tap');
});

// Music toggle
document.getElementById('toggleMusic').addEventListener('click', function() {
  this.classList.toggle('on');
  musicEnabled = this.classList.contains('on');
  saveSettings();
  if (musicEnabled) {
    startMusic();
  } else {
    stopMusic();
  }
});

// Notifications toggle (cosmetic only)
document.getElementById('toggleNotifs').addEventListener('click', function() {
  this.classList.toggle('on');
  playSfx('tap');
});

// ===== MENU =====
document.getElementById('playBtn').addEventListener('click', function() {
  playSfx('tap');
  resumeAudio();
  startMusic();
  showPanel('pCategories');
});

function updateMenuStats() {
  document.getElementById('menuScore').textContent = totalScore;
  var level = Math.floor(totalScore / 100) + 1;
  document.getElementById('menuLevel').textContent = 'LVL ' + level;
  document.getElementById('msBestScore').textContent = totalScore;
  document.getElementById('msTotalGames').textContent = totalGames;
  document.getElementById('msStreak').textContent = overallBestStreak;
}

// ===== CATEGORIES =====
document.getElementById('catBackBtn').addEventListener('click', function() {
  playSfx('tap');
  showPanel('pMenu');
});

document.querySelectorAll('.cat-item').forEach(function(item) {
  item.addEventListener('click', function() {
    playSfx('tap');
    document.querySelectorAll('.cat-item').forEach(function(c) { c.classList.remove('sel'); });
    item.classList.add('sel');
    selectedCat = item.dataset.cat;
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
  playSfx('tap');
  startQuiz();
});

// ===== START QUIZ =====
function startQuiz() {

  // Filter strictly by category
  var pool = selectedCat === 'all'
    ? ALL_QUESTIONS.slice()
    : ALL_QUESTIONS.filter(function(q) {
        return q.cat === selectedCat;
      });

  // Safety check: if not enough questions, repeat same category only
  if (pool.length < TOTAL_Q) {
    var copy = pool.slice();
    while (pool.length < TOTAL_Q) {
      pool = pool.concat(copy);
    }
  }

  // Shuffle
  pool.sort(function() { return Math.random() - 0.5; });

  questions = pool.slice(0, TOTAL_Q);

  currentQ = 0;
  score = 0;
  combo = 0;
  bestStreak = 0;
  correctCount = 0;
  wrongCount = 0;

  renderDots();
  showPanel('pQuiz');
  renderQ();
}

// ===== RENDER QUESTION =====
function renderQ() {
  answered = false;
  hideFeedback();
  var q = questions[currentQ];
  var sec = TIMER_SEC[selectedDiff];

  document.getElementById('qNum').textContent = 'QUESTION ' + (currentQ + 1) + ' / ' + TOTAL_Q;
  document.getElementById('qScore').textContent = score;
  var meta = CAT_META[q.cat] || { label:'General', icon:'bi-flag-fill' };
  document.getElementById('qBadge').innerHTML = '<i class="bi ' + meta.icon + '"></i> ' + meta.label;
  document.getElementById('qText').textContent = q.text;

  var idxs = [0,1,2,3];
  idxs.sort(function() { return Math.random() - 0.5; });
  var grid = document.getElementById('ansGrid');
  grid.innerHTML = '';
  var letters = ['A','B','C','D'];
  letters.forEach(function(ltr, i) {
    var origIdx = idxs[i];
    var btn = document.createElement('button');
    btn.className = 'ans-btn';
    btn.dataset.correct = origIdx === q.correct ? 'true' : 'false';
    btn.innerHTML = '<div class="ltr">' + ltr + '</div><div class="atxt">' + q.answers[origIdx] + '</div>';
    btn.addEventListener('click', function() { handleAnswer(btn, origIdx === q.correct, q); });
    grid.appendChild(btn);
  });

  updateDot(currentQ, 'dq');
  startTimer(sec);
}

function renderDots() {
  var c = document.getElementById('progressDots');
  c.innerHTML = '';
  for (var i = 0; i < TOTAL_Q; i++) {
    var d = document.createElement('div');
    d.className = 'dot';
    d.id = 'd' + i;
    c.appendChild(d);
  }
}

function updateDot(i, cls) {
  var d = document.getElementById('d' + i);
  if (d) d.className = 'dot ' + cls;
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
      if (!answered) {
        playSfx('timeup');
        handleAnswer(null, false, questions[currentQ], true);
      }
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

// ===== HANDLE ANSWER =====
function handleAnswer(btn, isCorrect, q, timedOut) {
  if (answered) return;
  answered = true;
  clearInterval(quizTimer);
  var allBtns = document.querySelectorAll('.ans-btn');
  var correctBtn = null;
  allBtns.forEach(function(b) {
    if (b.dataset.correct === 'true') correctBtn = b;
  });

  if (isCorrect) {
    btn.classList.add('correct');
    var pts = selectedDiff === 'easy' ? 10 : selectedDiff === 'medium' ? 15 : 20;
    var bonus = Math.floor(timeLeft * 0.5);
    score += pts + bonus;
    combo++;
    correctCount++;
    if (combo > bestStreak) bestStreak = combo;
    document.getElementById('qScore').textContent = score;
    updateDot(currentQ, 'dc');
    showFeedback(true, q.fact, '+' + (pts + bonus) + ' points!');
    if (combo >= 3) {
      showComboPop();
      playSfx('combo');
    } else {
      playSfx('correct');
    }
    spawnConfetti();
  } else {
    if (btn) btn.classList.add('wrong');
    if (correctBtn) correctBtn.classList.add('correct');
    combo = 0;
    wrongCount++;
    updateDot(currentQ, 'dw');
    var ct = correctBtn ? correctBtn.querySelector('.atxt').textContent : '';
    showFeedback(false, q.fact, timedOut ? "Time's up! Answer: " + ct : 'Wrong! Answer: ' + ct);
    playSfx('wrong');
  }
  allBtns.forEach(function(b) {
    if (!b.classList.contains('correct') && !b.classList.contains('wrong')) b.classList.add('dim');
    b.disabled = true;
  });
}

function showFeedback(correct, fact, detail) {
  var bar = document.getElementById('feedback');
  bar.className = 'feedback show ' + (correct ? 'fb-c' : 'fb-w');
  var icon = document.getElementById('fbIco');
  icon.innerHTML = correct ? '<i class="bi bi-check-circle-fill" style="color:#00D4A8;font-size:28px"></i>' : '<i class="bi bi-x-circle-fill" style="color:#FF3347;font-size:28px"></i>';
  var titles_c = ['Correct!','Excellent!','Amazing!','Brilliant!'];
  var titles_w = ['Wrong!','Oops!','Not Quite!','Missed It!'];
  document.getElementById('fbTitle').textContent = correct ? titles_c[Math.floor(Math.random()*4)] : titles_w[Math.floor(Math.random()*4)];
  document.getElementById('fbDetail').textContent = fact || detail;
}

function hideFeedback() {
  document.getElementById('feedback').className = 'feedback';
}

document.getElementById('nxtBtn').addEventListener('click', function() {
  playSfx('tap');
  hideFeedback();
  currentQ++;
  if (currentQ >= TOTAL_Q) showResults();
  else renderQ();
});

// ===== COMBO POP =====
function showComboPop() {
  var labels = {3:'3x Combo!', 4:'4x Combo!', 5:'5x Combo! Incredible!', 6:'Super Combo!', 7:'Legendary!'};
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
function showResults() {
  clearInterval(quizTimer);
  totalGames++;
  totalScore = Math.max(totalScore, score);
  overallBestStreak = Math.max(overallBestStreak, bestStreak);
  saveStats();

  var pct = Math.round((correctCount / TOTAL_Q) * 100);
  var trophyIcon, title, msg;

  if (pct >= 90) {
    trophyIcon = '<i class="bi bi-trophy-fill" style="color:#FFD700;font-size:60px"></i>';
    title = 'Outstanding!';
    msg = 'True Filipino pride! You aced it!';
  } else if (pct >= 70) {
    trophyIcon = '<i class="bi bi-award-fill" style="color:#C0C0C0;font-size:60px"></i>';
    title = 'Great Job!';
    msg = 'Almost perfect — a little more practice!';
  } else if (pct >= 50) {
    trophyIcon = '<i class="bi bi-hand-thumbs-up-fill" style="color:#CD7F32;font-size:60px"></i>';
    title = 'Not Bad!';
    msg = 'You can do better — keep learning!';
  } else {
    trophyIcon = '<i class="bi bi-arrow-repeat" style="color:var(--muted);font-size:60px"></i>';
    title = 'Keep Trying!';
    msg = "Don't give up! Practice makes perfect!";
  }

  document.getElementById('resTrophy').innerHTML = trophyIcon;
  document.getElementById('resTitle').textContent = title;
  document.getElementById('resMsg').textContent = msg;
  document.getElementById('ringScore').textContent = score;
  var maxPts = TOTAL_Q * (selectedDiff === 'easy' ? 10 : selectedDiff === 'medium' ? 15 : 20) + TOTAL_Q * 5;
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

  if (pct >= 70) {
    setTimeout(function() {
      for (var i = 0; i < 3; i++) {
        setTimeout(spawnConfetti, i * 400);
      }
    }, 300);
  }
}

document.getElementById('retryBtn').addEventListener('click', function() {
  playSfx('tap');
  startQuiz();
});

document.getElementById('homeBtn').addEventListener('click', function() {
  playSfx('tap');
  showPanel('pMenu');
  updateMenuStats();
});

// ===== QUIZ BACK (SHOW QUIT MODAL) =====
document.getElementById('quizBackBtn').addEventListener('click', function() {
  playSfx('tap');
  isPaused = true;
  clearInterval(quizTimer);
  document.getElementById('quitModal').classList.add('open');
});

// Resume game
document.getElementById('resumeBtn').addEventListener('click', function() {
  playSfx('tap');
  document.getElementById('quitModal').classList.remove('open');
  isPaused = false;

  // resume timer with remaining time
  startTimer(timeLeft);
});

// Quit game
document.getElementById('quitBtn').addEventListener('click', function() {
  playSfx('tap');
  document.getElementById('quitModal').classList.remove('open');
  showPanel('pMenu');
  updateMenuStats();
});
