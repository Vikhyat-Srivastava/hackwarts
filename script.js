/**
 * ============================================================
 *  HACKWARTS — WHERE MAGIC MEETS CODE
 *  script.js  |  All interactive behaviour
 * ============================================================
 *
 *  Sections in this file:
 *    1.  State variables
 *    2.  Custom cursor glow (60 fps via requestAnimationFrame)
 *    3.  Navbar scroll effect (adds .scrolled class after 60px)
 *    4.  Scroll-reveal animation (IntersectionObserver)
 *    5.  Hero reveal-text animation trigger
 *    6.  Web Audio API — helper: getAudioContext()
 *    7.  Sound effect: playWhoosh() — hover on links/buttons
 *    8.  Sound effect: playSparkle() — click on nav links
 *    9.  Sound toggle (BGM + effects on/off)
 *   10.  Cursor expand on interactive element hover
 *   11.  Init — wire everything up on DOMContentLoaded
 * ============================================================
 */


/* ─── 1. STATE ─────────────────────────────────────────────
   Module-level variables shared across all functions.
   ──────────────────────────────────────────────────────────── */
let soundEnabled = false;    // tracks whether audio is on/off
let audioCtx     = null;     // Web Audio context (created lazily on first use)
const mousePos   = { x: 0, y: 0 }; // latest mouse coordinates


/* ─── 2. CUSTOM CURSOR GLOW ────────────────────────────────
   Moves a <div id="cursorGlow"> to follow the mouse using
   requestAnimationFrame so it stays at a smooth 60 fps.
   ──────────────────────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursorGlow');
  if (!cursor) return; // skip on touch-only devices

  /**
   * updateMousePos — records coordinates on every mousemove.
   * The actual DOM update happens in animate() capped at 60 fps.
   */
  function updateMousePos(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  }

  /**
   * animate — runs every animation frame and moves the cursor.
   */
  function animate() {
    cursor.style.left = mousePos.x + 'px';
    cursor.style.top  = mousePos.y + 'px';
    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', updateMousePos);
  animate(); // start the loop
}


/* ─── 3. NAVBAR SCROLL EFFECT ──────────────────────────────
   Toggles .scrolled class on #navbar after scrolling 60px.
   The class triggers a CSS transition to a darker background.
   ──────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  /**
   * handleScroll — passive listener for best mobile performance.
   */
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
}


/* ─── 4. SCROLL-REVEAL ANIMATION ──────────────────────────
   .scroll-reveal elements start hidden (opacity:0, translateY 30px).
   IntersectionObserver adds .visible when they enter viewport,
   triggering the CSS transition to full opacity.
   ──────────────────────────────────────────────────────────── */
function initScrollReveal() {
  /**
   * observerCallback — fires when watched elements enter the viewport.
   */
  function observerCallback(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }

  const observer = new IntersectionObserver(observerCallback, {
    threshold:   0.1,
    rootMargin: '0px 0px -50px 0px' // trigger slightly before bottom edge
  });

  document.querySelectorAll('.scroll-reveal').forEach(function(el) {
    observer.observe(el);
  });
}


/* ─── 5. HERO REVEAL-TEXT ──────────────────────────────────
   Hero elements use CSS @keyframes `reveal` automatically.
   We mark them .visible so future scripts can detect them.
   ──────────────────────────────────────────────────────────── */
function initHeroReveal() {
  document.querySelectorAll('.reveal-text').forEach(function(el) {
    el.classList.add('visible');
  });
}


/* ─── 6. WEB AUDIO CONTEXT ─────────────────────────────────
   Created lazily on first use to comply with browser autoplay
   policies (audio context requires a user gesture).
   ──────────────────────────────────────────────────────────── */
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}


/* ─── 7. SOUND EFFECT: playWhoosh() ───────────────────────
   Generates a whoosh using filtered white noise — no audio
   files needed. Called on link/button hover when sound is on.

   Signal chain:
     BufferSource (white noise)
       → BiquadFilter (bandpass, sweeping frequency)
         → GainNode (fade out)
           → destination
   ──────────────────────────────────────────────────────────── */
function playWhoosh() {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    const dur = 0.35; // seconds

    // Create mono white noise buffer
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data   = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      // Envelope: attack / sustain / decay
      let env;
      if      (t < 0.1) env = t / 0.1;
      else if (t < 0.4) env = 1.0;
      else              env = Math.pow(1 - (t - 0.4) / 0.6, 2);
      data[i] = (Math.random() * 2 - 1) * env * 0.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter sweeps upward → "whoosh" shape
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + dur * 0.6);
    filter.frequency.exponentialRampToValueAtTime(800,  ctx.currentTime + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);

  } catch (e) {
    console.error('Whoosh sound error:', e);
  }
}


/* ─── 8. SOUND EFFECT: playSparkle() ──────────────────────
   Plays an ascending 4-note arpeggio using sine oscillators.
   Called on nav-link clicks when sound is enabled.

   Notes: C6 (1046.5 Hz), E6 (1318.5 Hz), G6 (1568 Hz), C7 (2093 Hz)
   Staggered 60ms apart for an arpeggio feel.
   ──────────────────────────────────────────────────────────── */
function playSparkle() {
  if (!soundEnabled) return;

  try {
    const ctx   = getAudioContext();
    const notes = [1046.5, 1318.5, 1567.98, 2093]; // C6 E6 G6 C7

    notes.forEach(function(freq, i) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      // Slight pitch bend upward for a "fairy dust" feel
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      // Staggered start: note i fires 60ms after note i-1
      const startTime = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0,     startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });

  } catch (e) {
    console.error('Sparkle sound error:', e);
  }
}


/* ─── 9. SOUND TOGGLE ──────────────────────────────────────
   Fixed circular button toggles sound on/off.
   When turned ON: starts BGM + plays a welcome whoosh.
   When turned OFF: pauses BGM and updates the button icon.
   ──────────────────────────────────────────────────────────── */
function initSoundToggle() {
  const btn   = document.getElementById('soundToggleBtn');
  const audio = document.getElementById('bgmAudio');
  if (!btn) return;

  /**
   * toggleSound — flips soundEnabled and updates audio playback.
   */
  function toggleSound() {
    soundEnabled = !soundEnabled;

    // Update icon to reflect current state
    btn.querySelector('.sound-icon').textContent = soundEnabled ? '🔊' : '🔇';

    if (soundEnabled) {
      if (audio) {
        audio.volume = 0.3; // subtle background volume
        audio.play().catch(function(e) {
          console.log('BGM play failed (browser policy):', e);
        });
      }
      playWhoosh(); // welcome whoosh on enable
    } else {
      if (audio) audio.pause();
    }
  }

  btn.addEventListener('click', toggleSound);
}


/* ─── 10. CURSOR EXPAND ON HOVER ──────────────────────────
   When golden cursor hovers over interactive elements it
   expands to 56px — a visual cue that the element is clickable.
   .expanded class triggers CSS transition (style.css §3).
   ──────────────────────────────────────────────────────────── */
function initCursorExpand() {
  const cursor = document.getElementById('cursorGlow');
  if (!cursor) return;

  // All interactive / hoverable selectors
  const selector = 'a, button, .about-card, .stage-card, .sponsor-card, .social-card';

  function handleMouseEnter(e) {
    cursor.classList.add('expanded');
    // Play whoosh only for actual clickable elements
    if (e.currentTarget.matches('button, a')) {
      playWhoosh();
    }
  }

  function handleMouseLeave() {
    cursor.classList.remove('expanded');
  }

  document.querySelectorAll(selector).forEach(function(el) {
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
  });
}


/* ─── 11. INIT — wire everything up ───────────────────────
   Wait for DOM to be fully parsed, then call every
   initialisation function in the correct order.
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  // Start cursor tracking
  initCursor();

  // Navbar background change on scroll
  initNavbar();

  // Reveal below-fold sections as user scrolls
  initScrollReveal();

  // Mark hero elements as visible immediately
  initHeroReveal();

  // Wire sound toggle button
  initSoundToggle();

  // Expand cursor over interactive elements
  initCursorExpand();

  // Wire sparkle sound to every nav link click
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', playSparkle);
  });

});
