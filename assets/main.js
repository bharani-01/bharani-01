/* ============================================
   main.js — Bharani KR Portfolio
   Shared logic across all 4 pages
   ============================================ */

/* ═══════════════════════════════════
   DARK MODE
═══════════════════════════════════ */
const html    = document.documentElement;
const THEME   = 'bk-portfolio-theme';
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = themeBtn?.querySelector('i');
  if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem(THEME, dark ? 'dark' : 'light');
}

// Init — runs before first paint (anti-flash handled by inline script in <head>)
function initTheme() {
  const saved  = localStorage.getItem(THEME);
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (saved === null && sysDark));
}

themeBtn?.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') !== 'dark');
});

initTheme();

/* ═══════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════ */
(function markActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
})();

/* ═══════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════ */
const progress = document.getElementById('scroll-progress');
if (progress) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(scrolled / max) * 100}%` : '0%';
  }, { passive: true });
}

/* ═══════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════ */
const mobToggle = document.getElementById('mob-toggle');
const mobileNav = document.getElementById('mobile-nav');

mobToggle?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  const icon = mobToggle.querySelector('i');
  if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
});

// Close mobile nav when a link is clicked
mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    const icon = mobToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  });
});

/* ═══════════════════════════════════
   INTERSECTION OBSERVER — ANIMATIONS
   Handles: .project-reveal, .fade-up
═══════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('active');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.project-reveal, .fade-up').forEach(el => {
  revealObserver.observe(el);
});

// Immediately activate elements already in view on load
requestAnimationFrame(() => {
  document.querySelectorAll('.project-reveal, .fade-up').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 30) el.classList.add('active');
  });
});

/* ═══════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════ */
function runCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const p        = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(runCounter);
      // Activate metric card accent bars
      e.target.querySelectorAll('.metric-card').forEach(card => card.classList.add('active'));
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-row').forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════
   SKILL BAR ANIMATIONS
═══════════════════════════════════ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill[data-width]').forEach(fill => {
        fill.style.width = fill.dataset.width;
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.skills-section').forEach(el => skillObserver.observe(el));

/* ═══════════════════════════════════
   TIMELINE DOT ACTIVATION
═══════════════════════════════════ */
const tlObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('active-item');
  });
}, { threshold: 0.4 });

document.querySelectorAll('.timeline-item').forEach(el => tlObserver.observe(el));

/* ═══════════════════════════════════
   PROJECT FILTER (projects.html)
═══════════════════════════════════ */
const filterTabs   = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');

if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      projectCards.forEach(card => {
        const categories = (card.dataset.category || '');
        const match = filter === 'all' || categories.includes(filter);

        if (!match) {
          card.style.display = 'none';
        } else {
          card.style.display = '';
          // Ensure animation is active when card re-appears
          if (!card.classList.contains('active')) {
            card.classList.add('active');
            const line = card.querySelector('.blueprint-line');
            if (line) line.style.width = '100%';
          }
        }
      });
    });
  });
}

/* ═══════════════════════════════════
   CONTACT FORM FEEDBACK
═══════════════════════════════════ */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', function(e) {
  const btn = this.querySelector('.btn-submit');
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
  }
});

/* ═══════════════════════════════════
   CUSTOM CURSOR RING (desktop only)
═══════════════════════════════════ */
(function initCursor() {
  if (window.innerWidth < 768) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring lags behind with lerp for a trailing effect
  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Expand on interactive elements
  document.querySelectorAll('a, button, .tag.clickable, .filter-tab, .social-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* ═══════════════════════════════════
   SCROLL-TO-TOP BUTTON
═══════════════════════════════════ */
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ═══════════════════════════════════
   TYPEWRITER EFFECT (index.html hero)
═══════════════════════════════════ */
(function initTypewriter() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const fullText = target.dataset.text || target.textContent.trim();
  target.textContent = '';

  // Insert blinking cursor right after the target span
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  target.insertAdjacentElement('afterend', cursor);

  let i = 0;
  const speed = 50; // ms per character

  function type() {
    if (i < fullText.length) {
      target.textContent += fullText[i++];
      setTimeout(type, speed);
    } else {
      // Stop blinking after 4 seconds
      setTimeout(() => {
        cursor.style.animation = 'none';
        cursor.style.opacity   = '0';
      }, 4000);
    }
  }

  // Wait for hero fade-in to finish, then start typing
  setTimeout(type, 1100);
})();

/* ═══════════════════════════════════
   PAGE LOADER
═══════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Dismiss on load (min 600ms visible, max 2s safety)
  const start = Date.now();
  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const delay = Math.max(0, 600 - elapsed);
    setTimeout(() => loader.classList.add('hidden'), delay);
  });
  // Safety timeout
  setTimeout(() => loader.classList.add('hidden'), 2000);
})();

/* ═══════════════════════════════════
   TERMINAL EASTER EGG — Ctrl + `
═══════════════════════════════════ */
(function initTerminal() {
  // Build DOM
  const overlay = document.createElement('div');
  overlay.className = 'terminal-overlay';
  overlay.innerHTML = `
    <div class="terminal-window">
      <div class="terminal-bar">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">bharani@portfolio ~</span>
      </div>
      <div class="terminal-body" id="terminal-body">
        <div class="terminal-line accent">Welcome to Bharani KR's terminal. Type <span style="color:#22c55e;">help</span> to see available commands.</div>
        <div class="terminal-line output" style="margin-bottom:8px;">Press <span style="color:#e8edf7;">Ctrl + \`</span> or <span style="color:#e8edf7;">Esc</span> to close.</div>
      </div>
      <div style="padding:0 16px 14px 16px;">
        <div class="terminal-input-row">
          <span class="prompt">~/bharani &gt;&nbsp;</span>
          <input id="terminal-input" type="text" autocomplete="off" spellcheck="false" placeholder="type a command...">
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const body  = document.getElementById('terminal-body');
  const input = document.getElementById('terminal-input');

  // Open / close
  function toggleTerminal() {
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) {
      input.focus();
    }
  }

  document.addEventListener('keydown', e => {
    if (e.key === '`' && e.ctrlKey) {
      e.preventDefault();
      toggleTerminal();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
    }
  });

  // Close on overlay background click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  // ─── Commands ───
  const COMMANDS = {
    help: () => [
      { text: 'Available commands:', cls: 'accent' },
      { text: '  help        — Show this help message' },
      { text: '  about       — Who is Bharani KR?' },
      { text: '  skills      — List technical skills' },
      { text: '  projects    — List all projects' },
      { text: '  contact     — Contact information' },
      { text: '  theme       — Toggle dark/light mode' },
      { text: '  goto <page> — Navigate (home|about|projects|contact)' },
      { text: '  clear       — Clear terminal' },
      { text: '  exit        — Close terminal' },
    ],

    about: () => [
      { text: '╔══════════════════════════════════════════╗', cls: 'accent' },
      { text: '║  BHARANI KR — Identity Profile           ║', cls: 'accent' },
      { text: '╚══════════════════════════════════════════╝', cls: 'accent' },
      { text: '' },
      { text: '  Name:       Bharani KR' },
      { text: '  Education:  B.Tech Cyber Security & IoT' },
      { text: '  Institute:  SRET, Chennai (Tamil Nadu)' },
      { text: '  Focus:      Embedded AI · IoT · Systems Programming' },
      { text: '  GitHub:     github.com/bharani-01', cls: 'success' },
      { text: '' },
      { text: '  🥈 2nd Place — VIT TetherX 2026 (TITAN-V2 Rover)', cls: 'warn' },
    ],

    skills: () => [
      { text: '┌─ AI / ML ──────────────────────────────┐', cls: 'accent' },
      { text: '│ YOLOv8/11 · MediaPipe · OpenCV · sklearn │' },
      { text: '├─ Systems ──────────────────────────────┤', cls: 'accent' },
      { text: '│ C++17 · ESP8266 · I2C/SPI · SQLite      │' },
      { text: '├─ Web ─────────────────────────────────┤', cls: 'accent' },
      { text: '│ Python/Flask · Node.js · React · Next.js │' },
      { text: '├─ Databases ──────────────────────────┤', cls: 'accent' },
      { text: '│ PostgreSQL · MongoDB · Supabase · SQLite │' },
      { text: '├─ IoT / Security ──────────────────────┤', cls: 'accent' },
      { text: '│ MQTT · Sensors · RBAC · BCrypt · JWT     │' },
      { text: '└────────────────────────────────────────┘', cls: 'accent' },
    ],

    projects: () => [
      { text: 'Engineering Projects (ranked by complexity):', cls: 'accent' },
      { text: '' },
      { text: '  01. RoadCams        — YOLOv11 Campus AI Surveillance', cls: 'success' },
      { text: '  02. TITAN-V2        — Agricultural Rover (🥈 VIT TetherX)', cls: 'success' },
      { text: '  03. Payroll Suite   — C++17 REST API, zero frameworks', cls: 'success' },
      { text: '  04. Hand Sign Audio — ISL/ASL Gesture → Speech', cls: '' },
      { text: '  05. TruFleet        — React/Supabase Vehicle SaaS', cls: '' },
      { text: '  06. Online Compiler — Multi-lang cloud sandbox', cls: '' },
      { text: '  07. Simple-ERP      — SIH Student Management', cls: '' },
      { text: '  08. Inventory Mgmt  — Next.js + PostgreSQL', cls: '' },
      { text: '  09. AttendPro       — MERN Anti-Proxy Attendance', cls: '' },
      { text: '  10. Volunteer Connect— Node.js MVC Platform', cls: '' },
      { text: '' },
      { text: '  Type "goto projects" to view full case studies.', cls: 'warn' },
    ],

    contact: () => [
      { text: 'Contact Information:', cls: 'accent' },
      { text: '' },
      { text: '  📧  bharani.cyber@gmail.com' },
      { text: '  📱  +91 93637 25862' },
      { text: '  🔗  linkedin.com/in/bharani-k-r-45a950354' },
      { text: '  💻  github.com/bharani-01', cls: 'success' },
      { text: '' },
      { text: '  📍  Chennai, Tamil Nadu (IST UTC+5:30)' },
      { text: '  ✅  Open to internships & collaborations', cls: 'success' },
    ],

    theme: () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      applyTheme(!isDark);
      return [{ text: `Theme switched to ${isDark ? 'light' : 'dark'} mode.`, cls: 'success' }];
    },

    clear: () => {
      body.innerHTML = '';
      return [];
    },

    exit: () => {
      overlay.classList.remove('open');
      return [];
    },
  };

  function handleGoto(arg) {
    const map = { home:'index.html', about:'about.html', projects:'projects.html', contact:'contact.html' };
    const target = map[(arg || '').toLowerCase()];
    if (target) {
      window.location.href = target;
      return [{ text: `Navigating to ${arg}...`, cls: 'success' }];
    }
    return [{ text: `Unknown page: "${arg}". Options: home, about, projects, contact`, cls: 'warn' }];
  }

  function addLine(text, cls) {
    const div = document.createElement('div');
    div.className = 'terminal-line' + (cls ? ' ' + cls : '');
    div.textContent = text;
    body.appendChild(div);
  }

  function runCommand(raw) {
    // Echo the command
    const echo = document.createElement('div');
    echo.className = 'terminal-line';
    echo.innerHTML = `<span class="prompt">~/bharani &gt; </span><span class="cmd">${raw}</span>`;
    body.appendChild(echo);

    const [cmd, ...args] = raw.trim().toLowerCase().split(/\s+/);
    let output = [];

    if (cmd === 'goto') {
      output = handleGoto(args[0]);
    } else if (COMMANDS[cmd]) {
      output = COMMANDS[cmd]();
    } else if (cmd) {
      output = [{ text: `Command not found: "${cmd}". Type "help" for available commands.`, cls: 'warn' }];
    }

    output.forEach(line => addLine(line.text, line.cls));
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      input.value = '';
      if (val) runCommand(val);
    }
  });
})();

/* ═══════════════════════════════════
   INTERACTIVE CIRCUIT BACKGROUND
═══════════════════════════════════ */
function initCircuitBackground() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: w/2, y: h/2, moved: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  });

  const particles = [];
  const maxParticles = 25; // Adjusted for performance
  const grid = 25;

  class Trace {
    constructor(x, y) {
      this.x = Math.round(x / grid) * grid;
      this.y = Math.round(y / grid) * grid;
      this.path = [{x: this.x, y: this.y}];
      this.life = 0;
      this.maxLife = 60 + Math.random() * 80;
      this.speed = grid;
      this.dir = Math.floor(Math.random() * 4);
    }
    update() {
      this.life++;
      if (this.life > this.maxLife) return false;

      // Move every other frame
      if (this.life % 2 === 0) {
        if (this.dir === 0) this.x += this.speed;
        else if (this.dir === 1) this.y += this.speed;
        else if (this.dir === 2) this.x -= this.speed;
        else if (this.dir === 3) this.y -= this.speed;
        
        this.path.push({x: this.x, y: this.y});
        
        // Randomly turn 90 deg
        if (Math.random() < 0.15) {
          this.dir = (this.dir + (Math.random() > 0.5 ? 1 : -1) + 4) % 4;
        }
      }
      
      // Keep only last N points to form a moving trace
      if (this.path.length > 20) this.path.shift();
      return true;
    }
    draw() {
      if (this.path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) {
        ctx.lineTo(this.path[i].x, this.path[i].y);
      }
      
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      // Muted techy blue — slightly brighter on true-black bg
      const color = theme === 'dark' ? 'rgba(77, 141, 255, ' : 'rgba(0, 85, 255, ';
      const alpha = (theme === 'dark' ? 0.5 : 0.6) * (1 - (this.life / this.maxLife));
      
      ctx.strokeStyle = color + alpha + ')';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Draw end node (the packet)
      const last = this.path[this.path.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color + alpha + ')';
      ctx.fill();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    
    // Spawn trace if mouse moved
    if (mouse.moved && Math.random() < 0.15 && particles.length < maxParticles) {
      const ox = mouse.x + (Math.random() - 0.5) * 60;
      const oy = mouse.y + (Math.random() - 0.5) * 60;
      particles.push(new Trace(ox, oy));
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// Init when DOM is loaded
initCircuitBackground();

