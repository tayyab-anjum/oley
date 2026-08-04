/* ==========================================================================
   Oley & Thusoo — Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initScrollReveals();
  initAnimatedCounters();
  initMenuFiltersAndPreview();
  initToastNotifications();
});

/* 1. Header Scroll Behavior */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* 3. Intersection Observer Scroll Reveal Animations */
function initScrollReveals() {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (!revealItems.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger animation slightly based on index in batch
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 80 * (idx % 4));
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));
}

/* 4. Number Counters Animation */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(el => animateSingleCounter(el));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.about-stats-col');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }
}

function animateSingleCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800; // ms
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = (target * easeOut).toFixed(decimals);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* 5. Menu Filters & Live Image Preview */
function initMenuFiltersAndPreview() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuRows = document.querySelectorAll('.menu-item-row');
  
  const previewImg = document.getElementById('preview-img');
  const previewTitle = document.getElementById('preview-title');
  const previewPrice = document.getElementById('preview-price');
  const previewDesc = document.getElementById('preview-desc');
  const previewCategory = document.getElementById('preview-category');
  const previewCard = document.getElementById('menu-preview-card');

  if (!menuRows.length) return;

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuRows.forEach(row => {
        const cat = row.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          row.style.display = 'flex';
          row.style.opacity = '1';
        } else {
          row.style.display = 'none';
          row.style.opacity = '0';
        }
      });
    });
  });

  // Hover & Click Live Preview Update
  const updatePreview = (row) => {
    menuRows.forEach(r => r.classList.remove('active'));
    row.classList.add('active');

    const img = row.getAttribute('data-img');
    const title = row.getAttribute('data-title');
    const price = row.getAttribute('data-price');
    const desc = row.getAttribute('data-desc');
    const cat = row.getAttribute('data-category');

    if (previewCard) {
      previewCard.style.opacity = '0.5';
      setTimeout(() => {
        if (previewImg) previewImg.src = img;
        if (previewTitle) previewTitle.textContent = title;
        if (previewPrice) previewPrice.textContent = price;
        if (previewDesc) previewDesc.textContent = desc;
        if (previewCategory) previewCategory.textContent = cat.toUpperCase();
        previewCard.style.opacity = '1';
      }, 150);
    }
  };

  menuRows.forEach(row => {
    row.addEventListener('mouseenter', () => updatePreview(row));
    row.addEventListener('click', () => updatePreview(row));
  });
}

/* 6. Toast Notification Helper */
function initToastNotifications() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  window.showToast = function(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };
}
