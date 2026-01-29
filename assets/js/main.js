// initMenu: idempotent initializer for mobile navbar toggle (works with Astro client navigations)
function initMenu() {
  // quick guard to avoid noisy errors
  try {
    var btns = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'));
    var nav = document.getElementById('nav-menu-container');

    // If nav or buttons are not present yet, poll a few times to wait for late DOM insertion
    if (!nav || btns.length === 0) {
      var pollKey = '__astroNavPoll';
      if (!window[pollKey]) window[pollKey] = { attempts: 0, timer: null };
      if (window[pollKey].attempts >= 20) return; // give up after ~3s
      window[pollKey].attempts += 1;
      clearTimeout(window[pollKey].timer);
      window[pollKey].timer = setTimeout(function() { initMenu(); }, 150);
      return;
    }
    // if we succeeded, clear any poll state
    if (window.__astroNavPoll) { clearTimeout(window.__astroNavPoll.timer); window.__astroNavPoll = null; }

    if (nav.dataset.menuInit === '1') return;
    // remove data-cloak so nav becomes visible after JS initializes
    if (nav.hasAttribute('data-cloak')) nav.removeAttribute('data-cloak');

    // ensure overlay exists
    var overlay = document.getElementById('mobile-body-overly');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mobile-body-overly';
      overlay.style.display = 'none';
      document.body.appendChild(overlay);
    }

    function closeAll() {
      nav.classList.remove('open');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      btns.forEach(function(b) { b.classList.remove('is-active'); b.setAttribute('aria-expanded', 'false'); });
    }

    overlay.addEventListener('click', closeAll);

    btns.forEach(function(btn) {
      btn.setAttribute('aria-expanded', 'false');
      // set accessible label state
      btn.setAttribute('aria-label', 'Open navigatie');
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var isOpen = nav.classList.toggle('open');
        // only toggle class on button; CSS handles SVG swap
        btn.classList.toggle('is-active', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        btn.setAttribute('aria-label', isOpen ? 'Sluit navigatie' : 'Open navigatie');
        overlay.style.display = isOpen ? 'block' : 'none';
        if (isOpen) {
          var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          if (scrollbarWidth > 0) document.body.style.paddingRight = scrollbarWidth + 'px';
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
      });
    });

    if (!window.__astroNavEscAdded) {
      document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeAll(); });
      window.__astroNavEscAdded = true;
    }

    nav.dataset.menuInit = '1';
  } catch (err) {
    console.error('initMenu error', err);
  }
}

// observe body for late additions of #nav-menu-container (catch cases where layout is replaced after init)
(function() {
  if (!window.__astroNavObserverAdded) {
    var body = document.body;
    if (!body) return;
    var obs = new MutationObserver(function(muts) {
      muts.forEach(function(mu) {
        if (mu.addedNodes && mu.addedNodes.length) {
          for (var i = 0; i < mu.addedNodes.length; i++) {
            var n = mu.addedNodes[i];
            if (n.nodeType === 1) {
              if (n.id === 'nav-menu-container' || n.querySelector && n.querySelector('#nav-menu-container')) {
                setTimeout(initMenu, 50);
                return;
              }
            }
          }
        }
      });
    });
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    window.__astroNavObserverAdded = true;
  }
})();

// initialize on first load and re-init after Astro client page loads
function scheduleInit() {
  initMenu();
  // retry a few times to catch late DOM mutations (e.g., after hydration)
  [100, 300, 800].forEach(function(ms) { setTimeout(initMenu, ms); });
}
document.addEventListener('DOMContentLoaded', scheduleInit);
document.addEventListener('astro:page-load', function() { if (document.getElementById('nav-menu-container')) document.getElementById('nav-menu-container').dataset.menuInit = ''; scheduleInit(); });
window.addEventListener('load', scheduleInit);
window.addEventListener('resize', function() { setTimeout(initMenu, 100); });
// call once immediately
scheduleInit();

