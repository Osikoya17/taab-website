import { gsap, reducedMotion, startSmoothScroll } from './motion';

/*
 * In units of the logo's 605-wide drawing, as percentages of its width:
 * "tab" is "ab" slid left over "ta" (SLIDE), with the pair centred (CENTRE).
 * Same numbers as the app's loading animation.
 */
const pct = (units: number) => (units / 605) * 100;
const CENTRE = pct(85.5);
const AB_IN_TAB = pct(85.5 - 170.94);

const GAP = 16;

/** Where the ink of a group of letters starts and ends, as fractions of the 605-wide drawing. */
function inkExtent(svg: SVGElement) {
  const boxes = [...svg.querySelectorAll<SVGPathElement>('path')].map((p) => p.getBBox());
  return {
    left: Math.min(...boxes.map((b) => b.x)) / 605,
    right: Math.max(...boxes.map((b) => b.x + b.width)) / 605,
  };
}

export function initHero() {
  const q = <T extends Element>(sel: string) => document.querySelector<T>(sel)!;
  const ta = q<SVGElement>('[data-hero-ta]');
  const ab = q<SVGElement>('[data-hero-ab]');
  const tab = q<SVGElement>('[data-hero-tab]');
  const phone = q<HTMLElement>('[data-hero-phone]');
  const copy = q<HTMLElement>('[data-hero-copy]');
  const tagline = q<HTMLElement>('[data-hero-tagline]');
  const hint = q<HTMLElement>('[data-hero-hint]');
  const wordmark = q<HTMLElement>('.wordmark');
  const taPart = q<HTMLElement>('[data-hero-part="ta"]');
  const abPart = q<HTMLElement>('[data-hero-part="ab"]');

  // "ta" and "ab" end just outside the phone's edges, whatever the screen size.
  // Both the wordmark and the phone are centred on the stage, so only their widths matter
  // (no window or scrollbar measurements that could put the gap off-centre).
  const parted = () => {
    const TA_RIGHT = inkExtent(ta).right;
    const AB_LEFT = inkExtent(ab).left;
    const w = wordmark.offsetWidth;
    const half = phone.offsetWidth / 2;
    return {
      ta: w * (0.5 - TA_RIGHT) - half - GAP,
      ab: half + GAP + w * (0.5 - AB_LEFT),
    };
  };

  if (reducedMotion) {
    // Final, still layout: the phone between "ta" and "ab".
    gsap.set(taPart, { x: parted().ta });
    gsap.set(abPart, { x: parted().ab });
    gsap.set(phone, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50 });
    gsap.set(tagline, { opacity: 1 });
    return;
  }

  startSmoothScroll();

  // 1. On load: "tab" (the app icon) opens into "taab", like the app's splash.
  gsap.set(ta, { xPercent: CENTRE, opacity: 0 });
  gsap.set(ab, { xPercent: AB_IN_TAB, opacity: 0 });
  gsap.set(tab, { opacity: 1 });
  gsap
    .timeline({ delay: 0.35 })
    .to(tab, { opacity: 0, duration: 0.15 })
    .to([ta, ab], { opacity: 1, duration: 0.15 }, '<')
    .to([ta, ab], { xPercent: 0, duration: 0.7, ease: 'power3.out' }, '>-0.05')
    .from(copy.children, { y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.35');

  // 2. On scroll: "ta" and "ab" part, and the app rises into the gap.
  gsap
    .timeline({
      scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=140%', scrub: 0.6, pin: true, invalidateOnRefresh: true },
    })
    .to(hint, { opacity: 0, duration: 0.1 }, 0)
    .to(copy, { opacity: 0, y: -30, duration: 0.25 }, 0)
    .to(taPart, { x: () => parted().ta, duration: 1, ease: 'power2.inOut' }, 0)
    .to(abPart, { x: () => parted().ab, duration: 1, ease: 'power2.inOut' }, 0)
    .fromTo(phone, { opacity: 0, scale: 0.55, xPercent: -50, yPercent: -40 }, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 1, ease: 'power2.out' }, 0.1)
    .to(tagline, { opacity: 1, duration: 0.3 }, 0.8);
}
