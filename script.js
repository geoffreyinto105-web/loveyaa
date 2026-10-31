(function () {
  var VALID_USER = 'Shanaia Lee Fabon';
  var VALID_PASS = '10/08/26';

  var PLANS = {
    Halloween: {
      key: 'halloween',
      title: 'Plan This Halloween',
      lines: [
        ['item', 'Manood ng KMJS Gabi Ng Lagim'],
        ['item', 'Manood ng Horror Movies']
      ]
    },
    Christmas: {
      key: 'christmas',
      title: 'Plan This Christmas',
      lines: [
        ['item', 'Mag Exchange Gift'],
        ['item', 'Kumpletuhin Ang Simbang Gabi'],
        ['item', 'Mag Enjoy Together'],
        ['gap'],
        ['gap'],
        ['head', 'Geo Wishlist'],
        ['sub', 'Wishlist'],
        ['item', 'Ikaw, gusto kitang makasama at makompleto ang simbang gabi'],
        ['item', 'Matching Shirt'],
        ['item', 'Makompleto ang simbang gabi'],
        ['item', 'Mapakilala na kita sa parents ko'],
        ['item', 'Makompleto ang pictures everytime mag simbang gabi tayo'],
        ['gap'],
        ['head', 'Shanaia Wishlist'],
        ['sub', 'WISHLIST'],
        ['item', 'FIRST BABY DAPAT TOGETHER PARIN TAYO THIS COMING NEW YEAR AND CHRISTMAS.'],
        ['item', "MATCHING BRACELET'S."],
        ['item', 'MATCHING POLO.'],
        ['item', 'MA COMPLETE YUNG SIMBANG GABI.'],
        ['item', 'MAG LONG MESSAGE SA BABY KO SA 25 & 1.']
      ]
    }
  };

  var form = document.getElementById('loginForm');
  var userInput = document.getElementById('username');
  var passInput = document.getElementById('password');
  var toggle = document.getElementById('toggle');
  var msg = document.getElementById('msg');
  var card = document.getElementById('card');
  var themes = document.getElementById('themes');
  var burst = document.getElementById('burst');
  var back = document.getElementById('back');
  var petalBox = document.getElementById('petals');
  var themeButtons = document.querySelectorAll('.theme');
  var plan = document.getElementById('plan');
  var planTitle = document.getElementById('planTitle');
  var paper = document.getElementById('paper');
  var paperBody = document.getElementById('paperBody');
  var planBack = document.getElementById('planBack');
  var snowfield = document.getElementById('snowfield');
  var timer = null;
  var album = document.getElementById('album');
  var albumStage = document.getElementById('albumStage');
  var albumCount = document.getElementById('albumCount');
  var progressBar = document.getElementById('progressBar');
  var playBtn = document.getElementById('playBtn');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var albumOpen = document.getElementById('albumOpen');
  var albumClose = document.getElementById('albumClose');
  var MAX_PHOTOS = 60;
  var INTERVAL = 3800;
  var EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
  var photos = null;
  var idx = 0;
  var fxCount = 0;
  var playing = true;
  var current = null;
  var albumTimer = null;
  var VOICE_FILES = ['audio/voice.mp3', 'audio/voice.m4a', 'audio/voice.wav', 'audio/voice.ogg', 'audio/voice.aac'];
  var voice = new Audio();
  var voiceIndex = 0;
  var voiceMissing = false;

  function normalize(value) {
    return value.trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function createPetals(count) {
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--s', (8 + Math.random() * 12).toFixed(1) + 'px');
      p.style.setProperty('--d', (9 + Math.random() * 9).toFixed(1) + 's');
      p.style.setProperty('--delay', (-Math.random() * 18).toFixed(1) + 's');
      p.style.setProperty('--x', (Math.random() * 120 - 60).toFixed(0) + 'px');
      petalBox.appendChild(p);
    }
  }

  function createSnow(count) {
    var shapes = ['❄', '❅', '❆'];
    for (var i = 0; i < count; i++) {
      var f = document.createElement('span');
      f.className = 'flake';
      f.textContent = shapes[i % 3];
      f.style.left = Math.random() * 100 + '%';
      f.style.fontSize = (10 + Math.random() * 16).toFixed(0) + 'px';
      f.style.setProperty('--d', (7 + Math.random() * 8).toFixed(1) + 's');
      f.style.setProperty('--delay', (-Math.random() * 15).toFixed(1) + 's');
      f.style.setProperty('--x', (Math.random() * 100 - 50).toFixed(0) + 'px');
      snowfield.appendChild(f);
    }
  }

  function explodeHearts(total) {
    var colors = ['#ff4fa3', '#ff8fc7', '#ffd0e8', '#ff6b8b', '#ff2e88'];
    var count = total || 42;
    var reach = Math.min(window.innerWidth, window.innerHeight) * 0.55;
    burst.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var h = document.createElement('span');
      var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      var dist = reach * (0.45 + Math.random() * 0.75);
      h.textContent = '♥';
      h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      h.style.setProperty('--r', (Math.random() * 120 - 60).toFixed(0) + 'deg');
      h.style.setProperty('--fs', (16 + Math.random() * 30).toFixed(0) + 'px');
      h.style.setProperty('--t', (1.1 + Math.random() * 0.7).toFixed(2) + 's');
      h.style.setProperty('--c', colors[i % colors.length]);
      burst.appendChild(h);
    }
  }

  function showError(text) {
    msg.textContent = text;
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  }

  function openThemes() {
    themes.hidden = false;
  }

  function clearThemeClasses() {
    document.body.classList.remove('has-theme', 'theme-halloween', 'theme-christmas');
  }

  function renderPaper(lines) {
    paperBody.innerHTML = '';
    lines.forEach(function (line, i) {
      var el = document.createElement('div');
      el.className = 'ln ' + line[0];
      if (line[1]) el.textContent = line[1];
      el.style.animationDelay = (1 + i * 0.3).toFixed(2) + 's';
      paperBody.appendChild(el);
    });
    paper.style.animation = 'none';
    void paper.offsetWidth;
    paper.style.animation = '';
  }

  function openPlan(name) {
    var data = PLANS[name];
    clearThemeClasses();
    document.body.classList.add('has-theme', 'theme-' + data.key);
    themes.hidden = true;
    plan.hidden = false;
    plan.scrollTop = 0;
    planTitle.textContent = data.title;
    renderPaper(data.lines);
  }

  toggle.addEventListener('click', function () {
    var show = passInput.type === 'password';
    passInput.type = show ? 'text' : 'password';
    toggle.textContent = show ? '🙈' : '👁';
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  [userInput, passInput].forEach(function (el) {
    el.addEventListener('input', function () {
      msg.textContent = '';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var user = userInput.value;
    var pass = passInput.value.trim();

    if (!user.trim() || !pass) {
      showError('Please enter your username and password.');
      return;
    }

    if (normalize(user) !== normalize(VALID_USER)) {
      showError('Username not found.');
      userInput.focus();
      return;
    }

    if (pass !== VALID_PASS) {
      showError('Incorrect password.');
      passInput.focus();
      return;
    }

    msg.textContent = '';
    document.activeElement.blur();
    explodeHearts();
    clearTimeout(timer);
    timer = setTimeout(openThemes, 1100);
  });

  themeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      openPlan(btn.dataset.theme);
    });
  });

  planBack.addEventListener('click', function () {
    plan.hidden = true;
    clearThemeClasses();
    themes.hidden = false;
  });

  back.addEventListener('click', function () {
    themes.hidden = true;
    burst.innerHTML = '';
    form.reset();
    passInput.type = 'password';
    toggle.textContent = '👁';
    userInput.focus();
  });

  voice.preload = 'auto';
  voice.loop = true;
  voice.addEventListener('error', function () {
    voiceIndex++;
    if (voiceIndex < VOICE_FILES.length) {
      voice.src = VOICE_FILES[voiceIndex];
      voice.load();
    } else {
      voiceMissing = true;
    }
  });
  voice.src = VOICE_FILES[0];

  function playVoice() {
    if (voiceMissing) return;
    var p = voice.play();
    if (p && p.catch) p.catch(function () {});
  }

  function stopVoice() {
    voice.pause();
    try { voice.currentTime = 0; } catch (err) {}
  }

  function probePhoto(n) {
    return new Promise(function (resolve) {
      (function attempt(i) {
        if (i >= EXTENSIONS.length) {
          resolve(null);
          return;
        }
        var src = 'images/' + n + '.' + EXTENSIONS[i];
        var im = new Image();
        im.onload = function () { resolve(src); };
        im.onerror = function () { attempt(i + 1); };
        im.src = src;
      })(0);
    });
  }

  function loadPhotos() {
    if (photos) return Promise.resolve(photos);
    var jobs = [];
    for (var n = 1; n <= MAX_PHOTOS; n++) jobs.push(probePhoto(n));
    return Promise.all(jobs).then(function (list) {
      photos = list.filter(Boolean);
      return photos;
    });
  }

  function restartProgress() {
    progressBar.style.animation = 'none';
    void progressBar.offsetWidth;
    progressBar.style.animation = 'fill ' + INTERVAL + 'ms linear forwards';
    progressBar.style.animationPlayState = playing ? 'running' : 'paused';
  }

  function showSlide(i) {
    idx = (i + photos.length) % photos.length;
    var old = current;
    var slide = document.createElement('div');
    var frame = document.createElement('div');
    var img = document.createElement('img');
    slide.className = 'slide fx' + (fxCount++ % 5);
    frame.className = 'frame';
    frame.style.setProperty('--rot', (Math.random() * 8 - 4).toFixed(1) + 'deg');
    img.src = photos[idx];
    img.alt = 'Photo ' + (idx + 1);
    img.style.animationDuration = INTERVAL + 1000 + 'ms';
    frame.appendChild(img);
    slide.appendChild(frame);
    albumStage.appendChild(slide);
    current = slide;
    if (old) {
      old.classList.add('out');
      setTimeout(function () { old.remove(); }, 700);
    }
    albumCount.textContent = idx + 1 + ' / ' + photos.length;
    restartProgress();
    explodeHearts(14);
    clearTimeout(albumTimer);
    if (playing) albumTimer = setTimeout(function () { showSlide(idx + 1); }, INTERVAL);
  }

  function setPlaying(state) {
    playing = state;
    playBtn.textContent = state ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', state ? 'Pause' : 'Play');
    progressBar.style.animationPlayState = state ? 'running' : 'paused';
    if (state) {
      if (voice.currentTime > 0 && !voice.ended) playVoice();
    } else {
      voice.pause();
    }
    clearTimeout(albumTimer);
    if (state && photos && photos.length) showSlide(idx + 1);
  }

  function openAlbum() {
    stopVoice();
    playVoice();
    clearThemeClasses();
    document.body.classList.add('has-theme', 'theme-christmas');
    themes.hidden = true;
    album.hidden = false;
    albumStage.innerHTML = '<p class="album-empty">Loading photos...</p>';
    albumCount.textContent = '';
    current = null;
    playing = true;
    playBtn.textContent = '❚❚';
    playBtn.setAttribute('aria-label', 'Pause');
    clearTimeout(albumTimer);
    loadPhotos().then(function (list) {
      if (album.hidden) return;
      albumStage.innerHTML = '';
      if (!list.length) {
        albumStage.innerHTML = '<p class="album-empty">Wala pang picture. Ilagay ang mga pic sa folder na <b>images</b> at pangalanan ng 1.jpg, 2.jpg, 3.jpg...</p>';
        return;
      }
      fxCount = 0;
      showSlide(0);
    });
  }

  function closeAlbum() {
    stopVoice();
    clearTimeout(albumTimer);
    album.hidden = true;
    albumStage.innerHTML = '';
    burst.innerHTML = '';
    clearThemeClasses();
    themes.hidden = false;
  }

  albumOpen.addEventListener('click', openAlbum);
  albumClose.addEventListener('click', closeAlbum);
  playBtn.addEventListener('click', function () { setPlaying(!playing); });
  prevBtn.addEventListener('click', function () {
    if (photos && photos.length) showSlide(idx - 1);
  });
  nextBtn.addEventListener('click', function () {
    if (photos && photos.length) showSlide(idx + 1);
  });

  createPetals(16);
  createSnow(45);
})();
