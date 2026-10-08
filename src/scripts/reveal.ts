/*
 * Gentle reveal as things come into view: elements marked [data-reveal] fade
 * and rise once. No scroll pinning, so the page scrolls normally. Content is
 * visible by default; the hidden starting state is only applied once this
 * script runs, so nothing stays invisible if JavaScript fails.
 */
export function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  document.documentElement.classList.add('reveal-ready');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  items.forEach((el) => io.observe(el));
}
