(() => {
  const body = document.body;
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('[data-scroll-progress]');
  const hero = document.querySelector('.hero');

  const setHeaderState = () => {
    if (!header) {
      return;
    }
    header.classList.toggle('scrolled', window.scrollY > 8);
  };

  const setProgress = () => {
    if (!progressBar) {
      return;
    }

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress)).toFixed(2)}%`;
  };

  const setHeroMotion = () => {
    if (!hero) {
      return;
    }
    const shift = Math.min(26, window.scrollY * 0.045);
    hero.style.setProperty('--hero-shift', `${shift}px`);
  };

  const sectionLinks = nav
    ? Array.from(nav.querySelectorAll('a[href^="#"]')).filter((link) => link.getAttribute('href').length > 1)
    : [];

  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const updateActiveLink = () => {
    if (!sectionLinks.length || !sections.length) {
      return;
    }

    const offsetY = window.scrollY + 150;
    let activeId = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= offsetY) {
        activeId = section.id;
      }
    });

    sectionLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  const onScroll = () => {
    setHeaderState();
    setProgress();
    setHeroMotion();
    updateActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveLink);

  const yearNodes = document.querySelectorAll('[data-year]');
  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (node) => {
    const target = Number(node.dataset.count || 0);
    if (!Number.isFinite(target)) {
      return;
    }

    const duration = 1300;
    const start = performance.now();

    const frame = (time) => {
      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      node.textContent = String(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const node = entry.target;
          animateCounter(node);
          counterObserver.unobserve(node);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count || counter.textContent;
    });
  }

  const forms = document.querySelectorAll('form[data-form-type]');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const response = form.querySelector('[data-form-response]');
      const formType = form.dataset.formType;
      const message =
        formType === 'quote'
          ? 'Thanks. Your quote request was received. We will call you shortly.'
          : 'Thanks. Your request was received. We will contact you shortly.';

      if (response) {
        response.textContent = message;
      }

      form.reset();
    });
  });

  const faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) {
        return;
      }

      faqItems.forEach((item) => {
        if (item !== detail) {
          item.open = false;
        }
      });
    });
  });

  const hoverCards = document.querySelectorAll('.card, .photo-card, .metric-card');
  hoverCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });

  onScroll();
  updateActiveLink();
})();
