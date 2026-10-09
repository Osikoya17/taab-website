import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let started = false;

/** Smooth scrolling (Lenis) driving GSAP's ScrollTrigger. Skipped for people who turn motion off. */
export function startSmoothScroll() {
  if (started || reducedMotion) return;
  started = true;
  // anchors: links such as the top bar's logo (#hero) scroll there smoothly instead of being fought.
  const lenis = new Lenis({ lerp: 0.12, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
