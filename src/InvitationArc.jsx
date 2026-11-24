import { useEffect, useRef, useState } from 'react';

const designs = [
  { title: 'The Garden', image: 'photo-1641835187840-ad2f28c51a54', alt: 'A wedding arch decorated with flowers and greenery in White Sands' },
  { title: 'First Light', image: 'photo-1519741497674-611481863552', alt: 'A warm arrangement of wedding flowers in evening light' },
  { title: 'The Gathering', image: 'photo-1614804520306-ecbee1dfd39b', alt: 'A Black American couple standing together in Houston' },
  { title: 'Soft Petals', image: 'photo-1529636798458-92182e662485', alt: 'Wedding flowers and a bridal dress' },
  { title: 'A Quiet Promise', image: 'photo-1606800052052-a08af7148866', alt: 'Wedding rings resting among soft details' },
  { title: 'All Together', image: 'photo-1719179542047-a4d84fd35c1f', alt: 'A Black American couple embracing after their wedding' },
  { title: 'The Welcome', image: 'photo-1523438885200-e635ba2c371e', alt: 'A decorated outdoor wedding celebration' },
  { title: 'Golden Hour', image: 'photo-1718997534125-052b2ff48cd0', alt: 'A Black American couple sharing a portrait beneath a floral arch' },
  { title: 'The Celebration', image: 'photo-1614804549242-80f19682f416', alt: 'A Black American couple together in Houston' },
  { title: 'Made for You', image: 'photo-1464366400600-7168b8af9bc3', alt: 'Wedding flowers and a refined invitation detail' },
];

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;
const wrappedDelta = (value, count) => mod(value + count / 2, count) - count / 2;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileRadius = width => width <= 375 ? 535 : width <= 390 ? 580 : Math.min(760, 580 + (width - 390) * 0.8);
const perfFlags = new URLSearchParams(window.location.search).get('yeslyPerf') === '1' ? new Set((new URLSearchParams(window.location.search).get('fx') || '').split(',').filter(Boolean)) : new Set();

function InvitationArc() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesEnabled, setImagesEnabled] = useState(false);
  const sectionRef = useRef(null);
  const activeTitle = designs[activeIndex].title;
  const initialMobile = window.innerWidth <= 640;
  const radiusRef = useRef(initialMobile ? mobileRadius(window.innerWidth) : Math.max(780, Math.min(940, window.innerWidth * 0.62)));
  const stepAngleRef = useRef(initialMobile ? 27 : 20);
  const cardRefs = useRef([]);
  const positionRef = useRef(0);
  const activeIndexRef = useRef(0);
  const pointerRef = useRef(null);
  const velocityRef = useRef(0);
  const motionRef = useRef(null);
  const rafRef = useRef(0);
  const frameTimeRef = useRef(0);
  const targetRef = useRef(0);
  const suppressClickRef = useRef(false);
  const wheelTimeRef = useRef(0);
  const pitch = () => Math.max(48, radiusRef.current * Math.sin((stepAngleRef.current * Math.PI) / 180));

  const publishActiveIndex = () => {
    const next = mod(Math.round(positionRef.current), designs.length);
    if (next !== activeIndexRef.current) {
      activeIndexRef.current = next;
      setActiveIndex(next);
    }
  };

  const renderCards = position => {
    const angleStep = stepAngleRef.current;
    const radiusValue = radiusRef.current;
    const mobile = window.innerWidth <= 640;
    const fadeStart = mobile ? 48 : 60;
    const fadeEnd = mobile ? 74 : 82;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const relative = wrappedDelta(index - position, designs.length);
      const thetaDegrees = relative * angleStep;
      const theta = (thetaDegrees * Math.PI) / 180;
      const x = radiusValue * Math.sin(theta);
      const z = radiusValue * (1 - Math.cos(theta));
      const distance = Math.abs(thetaDegrees);
      const fade = Math.min(1, Math.max(0, (distance - fadeStart) / Math.max(1, fadeEnd - fadeStart)));
      const selected = distance < angleStep * 0.52;
      const scale = selected ? 1.08 : mobile ? 0.78 : 0.94;
      card.style.transform = perfFlags.has('off-ring3d') ? `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% - var(--arc-card-lift)), 0) scale(${selected ? 1.04 : .9})` : `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% - var(--arc-card-lift)), ${z.toFixed(2)}px) rotateY(${-thetaDegrees.toFixed(2)}deg) scale(${scale})`;
      card.style.opacity = String((selected ? 1 : mobile ? 0.76 : 0.86) * (1 - fade));
      card.style.willChange = (motionRef.current || pointerRef.current) ? 'transform, opacity' : 'auto';
    });
    publishActiveIndex();
  };

  const stopFrame = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    frameTimeRef.current = 0;
  };

  const scheduleFrame = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  };

  const tick = now => {
    rafRef.current = 0;
    const elapsed = frameTimeRef.current ? Math.min(32, now - frameTimeRef.current) : 16.67;
    frameTimeRef.current = now;
    const mode = motionRef.current;

    if (mode === 'drag') {
      renderCards(positionRef.current);
      frameTimeRef.current = 0;
      return;
    }

    if (mode === 'inertia') {
      positionRef.current += velocityRef.current * elapsed;
      velocityRef.current *= Math.pow(0.935, elapsed / 16.67);
      renderCards(positionRef.current);
      if (Math.abs(velocityRef.current) < 0.00065) {
        velocityRef.current = 0;
        targetRef.current = Math.round(positionRef.current);
        motionRef.current = 'spring';
      }
    } else if (mode === 'spring') {
      const error = targetRef.current - positionRef.current;
      const omega = 0.019;
      const acceleration = (omega * omega * error) - (2 * omega * velocityRef.current);
      velocityRef.current += acceleration * elapsed;
      positionRef.current += velocityRef.current * elapsed;
      renderCards(positionRef.current);
      if (Math.abs(error) < 0.0008 && Math.abs(velocityRef.current) < 0.00008) {
        positionRef.current = targetRef.current;
        velocityRef.current = 0;
        motionRef.current = null;
        renderCards(positionRef.current);
        frameTimeRef.current = 0;
        return;
      }
    } else {
      frameTimeRef.current = 0;
      return;
    }

    scheduleFrame();
  };

  const settleTo = target => {
    targetRef.current = target;
    velocityRef.current = 0;
    if (reducedMotion()) {
      stopFrame();
      motionRef.current = null;
      velocityRef.current = 0;
      positionRef.current = target;
      renderCards(target);
      return;
    }
    motionRef.current = 'spring';
    scheduleFrame();
  };

  const stepOneCard = direction => {
    const nearest = Math.round(positionRef.current);
    settleTo(nearest + direction);
  };

  const centerDesign = index => {
    const relative = wrappedDelta(index - positionRef.current, designs.length);
    settleTo(positionRef.current + relative);
  };

  const releasePointer = event => {
    const drag = pointerRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const movement = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (movement < 6 && drag.cardIndex !== null) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 350);
      if (drag.cardIndex === activeIndexRef.current) window.location.hash = 'offer';
      else centerDesign(drag.cardIndex);
      pointerRef.current = null;
      motionRef.current = null;
      return;
    }

    pointerRef.current = null;
    if (movement >= 6) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 350);
    }
    if (reducedMotion()) {
      positionRef.current = Math.round(positionRef.current);
      motionRef.current = null;
      velocityRef.current = 0;
      renderCards(positionRef.current);
      return;
    }
    velocityRef.current = Math.max(-0.014, Math.min(0.014, velocityRef.current));
    motionRef.current = Math.abs(velocityRef.current) > 0.00065 ? 'inertia' : 'spring';
    targetRef.current = Math.round(positionRef.current);
    scheduleFrame();
  };

  const handlePointerDown = event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    stopFrame();
    motionRef.current = 'drag';
    velocityRef.current = 0;
    const card = event.target.closest('[data-card-index]');
    const now = performance.now();
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: positionRef.current,
      cardIndex: card ? Number(card.dataset.cardIndex) : null,
      samples: [{ time: now, position: positionRef.current }],
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = event => {
    const drag = pointerRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    positionRef.current = drag.startPosition - deltaX / pitch();
    const now = performance.now();
    drag.samples.push({ time: now, position: positionRef.current });
    while (drag.samples.length > 2 && now - drag.samples[0].time > 100) drag.samples.shift();
    const first = drag.samples[0];
    const last = drag.samples[drag.samples.length - 1];
    velocityRef.current = last.time > first.time ? (last.position - first.position) / (last.time - first.time) : 0;
    publishActiveIndex();
    scheduleFrame();
  };

  const handleWheel = event => {
    if (Math.abs(event.deltaX) < 2 || Math.abs(event.deltaX) < Math.abs(event.deltaY) * 1.15) return;
    event.preventDefault();
    const now = performance.now();
    const amount = event.deltaX / pitch();
    positionRef.current -= amount;
    if (now - wheelTimeRef.current < 120 && now > wheelTimeRef.current) velocityRef.current = -amount / (now - wheelTimeRef.current);
    else velocityRef.current = -amount / 16.67;
    velocityRef.current = Math.max(-0.014, Math.min(0.014, velocityRef.current));
    wheelTimeRef.current = now;
    motionRef.current = reducedMotion() ? null : 'inertia';
    if (reducedMotion()) {
      positionRef.current = Math.round(positionRef.current);
      renderCards(positionRef.current);
    } else scheduleFrame();
  };

  const handleKeyDown = event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    stepOneCard(event.key === 'ArrowRight' ? 1 : -1);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) { setImagesEnabled(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setImagesEnabled(true); observer.disconnect(); } }, { rootMargin: '300px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth <= 640;
      const nextRadius = mobile ? mobileRadius(window.innerWidth) : Math.max(780, Math.min(940, window.innerWidth * 0.62));
      const nextStep = mobile ? 27 : 20;
      radiusRef.current = nextRadius;
      stepAngleRef.current = nextStep;
      renderCards(positionRef.current);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    renderCards(positionRef.current);
    return () => {
      window.removeEventListener('resize', resize);
      stopFrame();
    };
  }, []);

  return (
    <section
      id="moments"
      role="region"
      aria-roledescription="carousel"
      aria-label="YESLY by TIKOS invitation designs"
      aria-labelledby="wheel-title"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={sectionRef}
      className="arc-section relative w-full outline-none"
    >
      <header className="arc-header relative z-20 mx-auto flex w-[calc(100%-2.4rem)] max-w-[1440px] items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="font-[Manrope] text-[11px] font-semibold uppercase tracking-[.16em] text-[#6d5b50]">YESLY by TIKOS · The invitation collection</p>
          <h2 id="wheel-title" className="mt-2 font-[Cormorant_Garamond] text-[clamp(2.7rem,5vw,4.25rem)] font-normal leading-[.9] tracking-[-.045em] text-[#211d1a]">
            A style that feels <em className="text-[#532c1c]">like you.</em>
          </h2>
        </div>

      </header>

      <div className="arc-stage relative mx-auto w-full" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
        <div
          className="arc-track absolute inset-0"
          style={{ touchAction: 'pan-y', userSelect: 'none', transformStyle: 'preserve-3d' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={releasePointer}
          onPointerCancel={() => {
            pointerRef.current = null;
            velocityRef.current = 0;
            settleTo(Math.round(positionRef.current));
          }}
          onWheel={handleWheel}
          onClickCapture={event => {
            if (suppressClickRef.current) {
              event.preventDefault();
              event.stopPropagation();
              suppressClickRef.current = false;
            }
          }}
        >
          {designs.map((design, index) => (
            <article
              key={design.title}
              ref={node => { cardRefs.current[index] = node; }}
              data-card-index={index}
              role="group"
              aria-label={index === activeIndex ? `Design ${String(index + 1).padStart(2, '0')}: ${design.title}, selected` : `Go to design ${String(index + 1).padStart(2, '0')}: ${design.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className="arc-card-position absolute left-1/2"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <a
                href="#offer"
                tabIndex={index === activeIndex ? 0 : -1}
                aria-label={index === activeIndex ? `View ${design.title} invitation design` : undefined}
                className={`arc-card group relative block rounded-[24px] bg-[#b79b86] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d78]${index === activeIndex ? ' is-selected' : ''}`}
                onClick={event => {
                  if (suppressClickRef.current) {
                    event.preventDefault();
                    return;
                  }
                  if (index !== activeIndexRef.current) {
                    event.preventDefault();
                    centerDesign(index);
                  }
                }}
                draggable={false}
              >
                <span className="arc-card-face absolute inset-0 block overflow-hidden rounded-[inherit] border border-[#c9b6aa]">
                  <img className="arc-card-image absolute inset-0 h-full w-full object-cover" src={imagesEnabled && Math.abs(wrappedDelta(index - activeIndex, designs.length)) <= 2 ? `https://images.unsplash.com/${design.image}?auto=format&fit=crop&w=700&q=76` : undefined} alt={design.alt} loading="lazy" decoding="async" draggable={false} />
                  <span className="arc-card-shade pointer-events-none absolute inset-0" aria-hidden="true" />
                  <span className="arc-card-title absolute inset-x-0 bottom-0 px-4 pb-5 pt-16 text-center font-[Cormorant_Garamond] text-[26px] leading-none text-white">{design.title}</span>
                  <span className="arc-card-index absolute left-4 top-4 font-[Manrope] text-[11px] font-semibold tracking-[.14em] text-white/85">{String(index + 1).padStart(2, '0')}</span>
                </span>
                {imagesEnabled && !perfFlags.has('off-reflections') && Math.abs(wrappedDelta(index - activeIndex, designs.length)) <= 2 && (
                    <span className="arc-card-reflection absolute block" aria-hidden="true">
                    <img src={`https://images.unsplash.com/${design.image}?auto=format&fit=crop&w=700&q=76`} alt="" loading="lazy" decoding="async" />
                  </span>
                )}
              </a>
            </article>
          ))}
        </div>
      </div>

      <nav aria-label="Invitation collection controls" className="arc-controls relative z-20 mx-auto flex w-fit items-center justify-center gap-3">
        <button type="button" onClick={() => stepOneCard(-1)} aria-label="Previous invitation design" className="arc-arrow grid size-11 place-items-center rounded-full border border-[#805f4e]/55 text-[#532c1c] transition duration-200 hover:scale-105 hover:bg-[#532c1c] hover:text-[#f8f5f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d78]">←</button>
        <button type="button" onClick={() => stepOneCard(1)} aria-label="Next invitation design" className="arc-arrow grid size-11 place-items-center rounded-full border border-[#805f4e]/55 text-[#532c1c] transition duration-200 hover:scale-105 hover:bg-[#532c1c] hover:text-[#f8f5f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d78]">→</button>
      </nav>

      <div className="arc-readout relative z-20 mx-auto mt-6 text-center" aria-live="polite" aria-atomic="true">
        <div key={activeIndex} className="arc-readout-copy">
          <p className="font-[Manrope] text-[11px] font-semibold uppercase tracking-[.16em] text-[#756c64]">{String(activeIndex + 1).padStart(2, '0')} / 10</p>
          <h3 className="mt-1 font-[Cormorant_Garamond] text-[30px] leading-none text-[#532c1c]">{activeTitle}</h3>
        </div>
        <a className="mt-2 inline-block font-[Manrope] text-[11px] font-bold uppercase tracking-[.12em] text-[#532c1c] underline decoration-[#ad9188] underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d78]" href="#offer">View designs <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

export default InvitationArc;
