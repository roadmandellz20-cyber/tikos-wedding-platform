import { useEffect, useRef, useState } from 'react';

const slides = [
  { image: 'photo-1769812344337-ec16a1b7cef8', position: 'center 49%', label: 'A garden ceremony framed by flowers' },
  { image: 'photo-1762216444919-043cf813e4de', position: 'center 47%', label: 'A ceremony set among a lush garden' },
  { image: 'photo-1747956895112-4b1ed4dc24fb', position: 'center 50%', label: 'A Black American couple celebrating on the coast' },
  { image: 'photo-1747359637295-20fb36bfefad', position: 'center 43%', label: 'A couple together in a garden setting' },
];

const imageUrl = (image, width) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=76`;

function HeroSlideshow() {
  const perfOff = (window.__YESLY_PERF__ || new Set()).has('off-slideshow');
  const layerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState(null);
  const [requested, setRequested] = useState([0]);
  const [loaded, setLoaded] = useState(() => new Set());
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(layer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const visibility = () => setTabVisible(!document.hidden);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(query.matches);
    document.addEventListener('visibilitychange', visibility);
    query.addEventListener?.('change', motion);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      query.removeEventListener?.('change', motion);
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      setActive(0);
      setOutgoing(null);
    }
  }, [reduced]);

  const running = inView && tabVisible && !reduced && !perfOff;
  const next = (active + 1) % slides.length;

  useEffect(() => {
    const hero = layerRef.current?.closest('.hero');
    if (!hero) return undefined;
    hero.classList.toggle('hero-motion-paused', !running);
    return () => hero.classList.remove('hero-motion-paused');
  }, [running]);

  useEffect(() => {
    if (!running) return undefined;
    if (!requested.includes(next)) {
      const requestTimer = window.setTimeout(() => setRequested(previous => previous.includes(next) ? previous : [...previous, next]), 8000);
      return () => window.clearTimeout(requestTimer);
    }
    if (!loaded.has(next)) return undefined;

    const advance = window.setTimeout(() => {
      setOutgoing(active);
      setActive(next);
      window.setTimeout(() => setOutgoing(current => current === active ? null : current), 2600);
    }, 7500);
    return () => window.clearTimeout(advance);
  }, [active, loaded, next, requested, running]);

  const markLoaded = index => setLoaded(previous => {
    if (previous.has(index)) return previous;
    const nextLoaded = new Set(previous);
    nextLoaded.add(index);
    return nextLoaded;
  });

  return (
    <div ref={layerRef} className={`hero-media${running ? '' : ' hero-effects-paused'}`} aria-hidden="true">
      {slides.map((slide, index) => {
        const visible = index === active || index === outgoing;
        const shouldLoad = requested.includes(index);
        const src = shouldLoad ? imageUrl(slide.image, 1600) : undefined;
        const srcSet = shouldLoad ? [600, 900, 1200, 1600].map(width => `${imageUrl(slide.image, width)} ${width}w`).join(', ') : undefined;
        return (
          <div
            key={slide.image}
            className={`hero-slide hero-slide-${index + 1}${visible ? ' is-visible' : ''}${visible && !reduced ? ' is-animating' : ''}`}
            aria-hidden="true"
          >
            <img
              src={src}
              srcSet={srcSet}
              sizes="100vw"
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding="async"
              draggable={false}
              style={{ '--object-position': slide.position }}
              onLoad={() => markLoaded(index)}
            />
          </div>
        );
      })}
    </div>
  );
}

export default HeroSlideshow;
