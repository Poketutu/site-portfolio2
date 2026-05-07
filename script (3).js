/* ================================================
   PROJETO DE PORTFÓLIO — Desenvolvimento Front-End
   ================================================
   Arquivo  : script.js
   Projeto  : Site institucional fictício (DevSolutions)
              criado para demonstrar habilidades em JS puro.
   Técnicas : ES6+ (IIFE, arrow functions, destructuring),
              IntersectionObserver API, manipulação de DOM,
              eventos, animações via JS, validação de forms.
   ================================================ */

/* ============================================
   DevSolutions — script.js
   Funcionalidades:
   - Header com scroll detection
   - Menu hambúrguer mobile
   - Scroll suave
   - Animações reveal on scroll (IntersectionObserver)
   - Formulário de contato com feedback visual
   ============================================ */

(function () {
  'use strict';


  /* ── 1. HEADER — EFEITO AO ROLAR ─────────── */
  const header = document.getElementById('header');

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // roda ao carregar


  /* ── 2. MENU HAMBÚRGUER ──────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    // Impede scroll do body quando menu aberto
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Fecha ao clicar em um link do menu mobile
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fecha ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMenu(false);
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });


  /* ── 3. SCROLL SUAVE para âncoras ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  /* ── 4. ANIMAÇÕES REVEAL AO ROLAR ────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Para de observar após aparecer (performance)
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para browsers antigos: mostra tudo imediatamente
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* ── 5. FORMULÁRIO DE CONTATO ────────────── */
  const form        = document.getElementById('contato-form');
  const successMsg  = document.getElementById('form-success');
  const submitBtn   = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome     = form.nome.value.trim();
      const email    = form.email.value.trim();
      const mensagem = form.mensagem.value.trim();

      // Validação simples
      if (!nome || !email || !mensagem) {
        shakeForm();
        return;
      }

      if (!isValidEmail(email)) {
        highlightField(form.email);
        return;
      }

      // Simula envio: desabilita botão + mostra loading
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Enviando…';

      setTimeout(() => {
        // Sucesso visual
        form.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Enviar mensagem';

        successMsg.textContent = '✓ Mensagem enviada! Retornaremos em breve.';
        successMsg.classList.add('show');

        // Esconde mensagem após 5s
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }, 1400);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm() {
    form.style.animation = 'shake .4s ease';
    form.addEventListener('animationend', () => {
      form.style.animation = '';
    }, { once: true });
  }

  function highlightField(field) {
    field.style.borderColor = '#ef4444';
    field.focus();
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    }, { once: true });
  }


  /* ── 6. HIGHLIGHT DO LINK ATIVO NO MENU ──── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

  function setActiveLink() {
    const scrollY = window.scrollY + header.offsetHeight + 40;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ── 7. ANIMAÇÃO SHAKE (CSS inline) ─────── */
  // Injeta keyframes de shake dinamicamente
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-6px); }
      80%       { transform: translateX(6px); }
    }

    .nav-links a.active {
      color: var(--blue-600) !important;
      background: var(--blue-50) !important;
    }
  `;
  document.head.appendChild(style);


  /* ── 8. COUNTER ANIMADO nas estatísticas ─── */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const raw    = el.textContent.trim();              // ex: "+120", "98%", "5 anos"
    const numMatch = raw.match(/\d+/);
    if (!numMatch) return;

    const target  = parseInt(numMatch[0], 10);
    const prefix  = raw.slice(0, raw.indexOf(numMatch[0])); // ex: "+"
    const suffix  = raw.slice(raw.indexOf(numMatch[0]) + numMatch[0].length); // ex: "%"
    const duration = 1200; // ms
    const steps    = 40;
    const interval = duration / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.round(current) + suffix;
    }, interval);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));
  }

})();
