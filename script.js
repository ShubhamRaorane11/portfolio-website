/* ═══════════════════════════════════════════════════════════
   SHUBHAM PORTFOLIO — SCRIPT.JS
   Handles: particles, typing, navbar, AOS, counter, skills,
            tilt, JARVIS chatbot, contact form
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILS ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
(function initCursor() {
  const cursor = $('#cursorGlow');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mousedown', () => {
    cursor.style.width = '14px'; cursor.style.height = '14px'; cursor.style.opacity = '1';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.width = '24px'; cursor.style.height = '24px'; cursor.style.opacity = '0.7';
  });
  $$('a, button, .project-card, .arsenal-item, .channel-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '40px'; cursor.style.height = '40px'; cursor.style.opacity = '0.4'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '24px'; cursor.style.height = '24px'; cursor.style.opacity = '0.7'; });
  });
})();

/* ══════════════════════════════════════════════════════════
   2. PARTICLE CANVAS
══════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const COLORS = ['rgba(0,212,255,', 'rgba(0,100,255,', 'rgba(124,58,237,', 'rgba(0,212,170,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = Math.random() * 200 + 100;
      this.age = initial ? Math.random() * this.life : 0;
      this.twinkle = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      this.age++;
      this.twinkle += 0.03;
      if (this.age > this.life || this.y < -10) this.reset();
    }
    draw() {
      const alpha = this.opacity * (0.7 + 0.3 * Math.sin(this.twinkle));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    }
  }

  // Also draw connecting lines for close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  const NUM = Math.min(120, Math.floor((W * H) / 8000));
  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ══════════════════════════════════════════════════════════
   3. TYPING ANIMATION
══════════════════════════════════════════════════════════ */
(function initTyping() {
  const el = $('#typedText');
  if (!el) return;
  const words = [
    'Full Stack Apps',
    'REST APIs',
    'Web Experiences',
    'Flask Backends',
    'Database Systems',
    'Digital Solutions'
  ];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        setTimeout(() => { deleting = true; type(); }, 1800);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 1000);
})();

/* ══════════════════════════════════════════════════════════
   4. NAVBAR — scroll + mobile toggle
══════════════════════════════════════════════════════════ */
(function initNav() {
  const nav = $('#hudNav');
  const hamburger = $('#hamburger');
  const navLinks = $('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger && hamburger.addEventListener('click', () => {
    navLinks && navLinks.classList.toggle('mobile-open');
  });

  // Close nav on link click
  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks && navLinks.classList.remove('mobile-open');
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   5. INTERSECTION OBSERVER (AOS + Skill bars + Counters)
══════════════════════════════════════════════════════════ */
(function initObservers() {
  // AOS
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay || 0;
        setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
        aosObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  $$('[data-aos]').forEach(el => aosObserver.observe(el));

  // Skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.skill-fill', entry.target).forEach(bar => {
          const width = bar.dataset.width;
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const skillsSection = $('#skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  // Counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('[data-count]', entry.target).forEach(el => animateCount(el));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const heroSection = $('#home');
  if (heroSection) counterObserver.observe(heroSection);

  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(interval);
    }, 16);
  }
})();

/* ══════════════════════════════════════════════════════════
   6. 3D CARD TILT EFFECT
══════════════════════════════════════════════════════════ */
(function initTilt() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   7. SMOOTH SCROLL
══════════════════════════════════════════════════════════ */
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════════════
   8. CONTACT FORM
══════════════════════════════════════════════════════════ */
(function initForm() {
  const form = $('#contactForm');
  if (!form) return;
  const btn = form.querySelector('.btn-submit');
  const btnContent = btn.querySelector('.btn-content');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnContent.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Transmitting...`;
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    btnContent.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Message Sent!`;
    btn.style.background = 'linear-gradient(135deg, #00d4aa, #0066ff)';

    setTimeout(() => {
      form.reset();
      btnContent.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Transmission`;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
})();

/* ══════════════════════════════════════════════════════════
   9. JARVIS CHATBOT
══════════════════════════════════════════════════════════ */
(function initJarvis() {
  const toggle = $('#jarvisToggle');
  const panel = $('#jarvisPanel');
  const closeBtn = $('#jarvisClose');
  const input = $('#jarvisInput');
  const sendBtn = $('#jarvisSend');
  const messages = $('#jarvisMessages');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });
  closeBtn && closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  sendBtn && sendBtn.addEventListener('click', sendMessage);
  input && input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => addMessage(getResponse(text.toLowerCase()), 'bot'), 800);
  }

  window.sendJarvis = function(text) {
    panel.classList.add('open');
    addMessage(text, 'user');
    setTimeout(() => addMessage(getResponse(text.toLowerCase()), 'bot'), 800);
  };

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `j-msg ${role}`;
    div.innerHTML = `
      <div class="j-avatar">${role === 'bot' ? 'AI' : 'YOU'}</div>
      <div class="j-bubble">${text}</div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

    // Animate in
    div.style.opacity = '0'; div.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      div.style.transition = 'all 0.3s ease';
      div.style.opacity = '1'; div.style.transform = 'none';
    });
  }

  function getResponse(query) {
    if (query.includes('project') || query.includes('mission')) {
      return `Shubham has completed 3 missions: <strong>Expense Tracker</strong> (full-stack finance app), <strong>Career Guidance Portal</strong> (student career platform), and <strong>Web Applications</strong> (collection of tools). Scroll to the Missions section for details.`;
    }
    if (query.includes('skill') || query.includes('power') || query.includes('tech')) {
      return `Shubham's superpowers include: Frontend (HTML5 92%, CSS3 88%, JavaScript 82%), Backend (Python 85%, Flask 78%), and Database (MySQL 80%). Quite the arsenal!`;
    }
    if (query.includes('contact') || query.includes('hire') || query.includes('summon')) {
      return `To reach Shubham, scroll to the <strong>Summon Me</strong> section. You can email him, connect on LinkedIn, or check out his GitHub. He's currently available for new opportunities!`;
    }
    if (query.includes('about') || query.includes('who') || query.includes('origin')) {
      return `Shubham is a Full Stack Developer passionate about building elegant web applications from frontend to backend. He works with HTML, CSS, JS, Python Flask, and MySQL. Currently leveling up his skills and open to exciting projects.`;
    }
    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return `Hello! I'm J.A.R.V.I.S, Shubham's AI assistant. How can I assist you today? You can ask me about his projects, skills, or how to get in touch.`;
    }
    if (query.includes('arsenal') || query.includes('tools') || query.includes('stack')) {
      return `Shubham's arsenal includes: HTML5, CSS3, JavaScript, Python, Flask, MySQL, Git, and REST APIs. A well-rounded stack for building complete web applications.`;
    }
    return `Interesting query. I can tell you about Shubham's <strong>projects</strong>, <strong>skills</strong>, <strong>tech stack</strong>, or how to <strong>contact</strong> him. What would you like to know?`;
  }
})();

/* ══════════════════════════════════════════════════════════
   10. HERO NAME GLITCH EFFECT (subtle)
══════════════════════════════════════════════════════════ */
(function initGlitch() {
  const name = $('#heroName');
  if (!name) return;

  function glitch() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const original = 'SHUBHAM';
    let iterations = 0;

    const interval = setInterval(() => {
      name.textContent = original.split('').map((c, i) => {
        if (i < iterations) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iterations >= original.length) {
        clearInterval(interval);
        name.textContent = original;
      }
      iterations += 0.3;
    }, 40);
  }

  // Trigger on hover
  const title = name.closest('.hero-title');
  if (title) title.addEventListener('mouseenter', glitch);

  // Also trigger on page load
  setTimeout(glitch, 1500);
})();

/* ══════════════════════════════════════════════════════════
   11. CSS SPIN ANIMATION for loading
══════════════════════════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `
  .spin-icon {
    animation: spin 1s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

/* ══════════════════════════════════════════════════════════
   12. PARALLAX HERO ELEMENTS
══════════════════════════════════════════════════════════ */
(function initParallax() {
  const hero = $('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const canvas = $('#particleCanvas');
    if (canvas) canvas.style.transform = `translateY(${scrolled * 0.3}px)`;
    const content = $('.hero-content');
    if (content) content.style.transform = `translateY(${scrolled * 0.15}px)`;
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   13. ACTIVE NAV HIGHLIGHT on scroll
══════════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const links = $$('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.style.color = '');
        const active = links.find(l => l.getAttribute('href') === '#' + entry.target.id);
        if (active) active.style.color = 'var(--accent-cyan)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();

console.log('%c[ J.A.R.V.I.S ONLINE ]', 'color: #00d4ff; font-family: monospace; font-size: 14px; font-weight: bold;');
console.log('%cShubham Portfolio v2.0 — All systems operational.', 'color: #7a9cc0; font-family: monospace; font-size: 11px;');
