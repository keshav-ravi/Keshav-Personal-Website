(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header gains a border once the page is scrolled; a thin bar tracks scroll progress.
  var header = document.querySelector('.site-header');
  var bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
      if (header) header.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (reduce || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    'main > .eyebrow, main > h1, main > .lead, main > p, main > .button-row, main .section-title, ' +
    'main .card, main .panels li, main .contact-form, main .contact-side, main section > .tags'
  );

  // Give stat tiles a stagger index so they pop in one after another.
  document.querySelectorAll('.stats').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (li, i) { li.style.setProperty('--i', i); });
  });

  var observer = new IntersectionObserver(function (entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting; });
    batch.forEach(function (entry, i) {
      var el = entry.target;
      el.style.setProperty('--d', Math.min(i * 0.09, 0.45) + 's');
      el.classList.add('in');
      observer.unobserve(el);

      // Once revealed, drop the reveal transition so hover effects aren't delayed.
      el.addEventListener('transitionend', function done(ev) {
        if (ev.target !== el || ev.propertyName !== 'opacity') return;
        el.classList.remove('reveal');
        el.style.removeProperty('--d');
        el.removeEventListener('transitionend', done);
      });
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
