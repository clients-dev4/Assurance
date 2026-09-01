(function () {
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  function close() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-open', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('data-open', String(!open));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
})();

(function () {
  document.querySelectorAll('.scroll-nav').forEach(function (nav) {
    var scroller = nav.parentElement.querySelector('.scroller');
    if (!scroller) return;

    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.scroll-btn');
      if (!btn) return;
      var card = scroller.firstElementChild;
      var step = card ? card.getBoundingClientRect().width + 16 : scroller.clientWidth * 0.8;
      scroller.scrollBy({
        left: btn.getAttribute('data-dir') === 'prev' ? -step : step,
        behavior: 'smooth'
      });
    });
  });
})();
