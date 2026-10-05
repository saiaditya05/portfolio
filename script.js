/* ==========================================================================
   Boyina Sai Aditya - Interactive JavaScript Engine
   Data Analyst & Developer Edition (Naruto x One Piece Dual Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. Theme Manager (Naruto vs. One Piece)
       ---------------------------------------------------------------------- */
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const logoBadge = document.getElementById('logo-badge');
    const animeTag = document.getElementById('anime-tag');
    const terminalPrompt = document.getElementById('terminal-prompt');
    const terminalTitle = document.getElementById('terminal-title');

    let currentTheme = localStorage.getItem('sai_aditya_theme') || 'naruto';

    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sai_aditya_theme', theme);

        if (theme === 'naruto') {
            themeIcon.textContent = '🍃';
            themeText.textContent = 'Hidden Leaf';
            logoBadge.textContent = '🍃';
            if (animeTag) animeTag.textContent = '🍃 Data Analyst & Shinobi';
            if (terminalPrompt) terminalPrompt.textContent = 'saiaditya@konoha:~$';
            if (terminalTitle) terminalTitle.textContent = 'saiadityaboyina@shinobi-terminal';
        } else {
            themeIcon.textContent = '☠️';
            themeText.textContent = 'Grand Line';
            logoBadge.textContent = '☠️';
            if (animeTag) animeTag.textContent = '☠️ Data Analyst & Pirate';
            if (terminalPrompt) terminalPrompt.textContent = 'saiaditya@grandline:~$';
            if (terminalTitle) terminalTitle.textContent = 'saiadityaboyina@pirate-terminal';
        }

        // Re-initialize particles with theme colors
        if (window.particleEngine) {
            window.particleEngine.updateTheme(theme);
        }
    }

    applyTheme(currentTheme);

    themeBtn.addEventListener('click', () => {
        const nextTheme = currentTheme === 'naruto' ? 'onepiece' : 'naruto';
        applyTheme(nextTheme);

        themeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => themeBtn.style.transform = '', 200);
    });

    /* ----------------------------------------------------------------------
       2. Particle Canvas Background Engine
       ---------------------------------------------------------------------- */
    class ParticleEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.numParticles = window.innerWidth < 768 ? 35 : 70;
            this.mouse = { x: null, y: null, radius: 120 };
            this.theme = currentTheme;

            this.init();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            });
        }

        init() {
            this.resize();
            this.createParticles();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        updateTheme(theme) {
            this.theme = theme;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.numParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 2.5 + 1,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    alpha: Math.random() * 0.7 + 0.3
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const isNaruto = this.theme === 'naruto';
            const colorPrimary = isNaruto ? '255, 107, 0' : '0, 240, 255';
            const colorSecondary = isNaruto ? '255, 0, 60' : '255, 183, 3';

            for (let p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = this.mouse.x - p.x;
                    const dy = this.mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this.mouse.radius) {
                        const force = (this.mouse.radius - dist) / this.mouse.radius;
                        p.x -= (dx / dist) * force * 2;
                        p.y -= (dy / dist) * force * 2;
                    }
                }

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${colorPrimary}, ${p.alpha})`;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = `rgba(${colorSecondary}, 0.8)`;
                this.ctx.fill();
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    window.particleEngine = new ParticleEngine('particle-canvas');

    /* ----------------------------------------------------------------------
       3. Typewriter Subtitle Animation
       ---------------------------------------------------------------------- */
    const phrases = [
        "Computer Science Student @ ADYPU",
        "Aspiring Data Analyst",
        "Python & MySQL Specialist",
        "Data Analytics & Web Developer"
    ];

    const typingElement = document.getElementById('typing-subtitle');
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
        if (!typingElement) return;
        const currentPhrase = phrases[phraseIdx];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            typeSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 400;
        }

        setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();

    /* ----------------------------------------------------------------------
       4. Interactive CLI Terminal
       ---------------------------------------------------------------------- */
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const cmdButtons = document.querySelectorAll('.cmd-btn');

    const commands = {
        help: `Available Commands:
  about     - Learn about Boyina Sai Aditya
  skills    - View Data Analysis & Tech stack
  languages - View languages spoken
  projects  - View featured portfolio project
  socials   - Display profile links (GitHub, LeetCode, etc.)
  mode      - Toggle between Naruto & One Piece themes
  clear     - Clear terminal screen`,

        about: `Boyina Sai Aditya | CS Student (2024-2028) @ ADYPU
Role Target: Data Analyst / Data Analytics
Focus: Python, Excel, SQL/DBMS, Data Visualization & Web Applications.`,

        skills: `📊 Data Analysis: Python, Excel (Advanced Functions & Formatting)
🗄️ Databases:     DBMS, MySQL, SQL Queries & Joins
💻 Web & Basics:  HTML, CSS, Java (Basics)`,

        languages: `🗣️ Languages Spoken:
  1. Telugu  - Fluent
  2. English - Proficient
  3. Hindi   - Basics`,

        projects: `Featured Project:
- Interactive Anime Data Analyst Portfolio [HTML, CSS, JS, Canvas, CLI]`,

        socials: `🔗 GitHub:     https://github.com/saiaditya05
💻 LeetCode:   https://leetcode.com/u/saiaditya_05/
🏆 HackerRank: https://www.hackerrank.com/profile/saiadityaboyina
👔 LinkedIn:   https://www.linkedin.com/in/sai-aditya-boyina-/`
    };

    function executeCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        let response = '';

        if (cleanCmd === 'clear') {
            termOutput.textContent = '';
            return;
        } else if (cleanCmd === 'mode') {
            const nextTheme = currentTheme === 'naruto' ? 'onepiece' : 'naruto';
            applyTheme(nextTheme);
            response = `Theme toggled to: ${nextTheme === 'naruto' ? 'Hidden Leaf Shinobi 🍃' : 'Grand Line Pirate ☠️'}`;
        } else if (commands[cleanCmd]) {
            response = commands[cleanCmd];
        } else {
            response = `Command not found: '${cleanCmd}'. Type 'help' for a list of valid commands.`;
        }

        termOutput.textContent += `\n\n> ${cleanCmd}\n${response}`;
        termOutput.scrollTop = termOutput.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                termInput.value = '';
                executeCommand(val);
            }
        });
    }

    cmdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            executeCommand(cmd);
        });
    });

    /* ----------------------------------------------------------------------
       5. Navbar Scroll & Mobile Drawer
       ---------------------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
            });
        });
    }

    /* ----------------------------------------------------------------------
       6. Scroll Intersection Observer for Fade-In Effects
       ---------------------------------------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    fadeElements.forEach(el => appearObserver.observe(el));
});
