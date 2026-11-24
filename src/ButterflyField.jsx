import { useEffect, useRef } from 'react';
import pinkSprite from '../assets/butterflies/pink.png';
import orangeSprite from '../assets/butterflies/orange.png';
import blueSprite from '../assets/butterflies/blue.png';

const SPRITE_URLS = [pinkSprite, orangeSprite, blueSprite];
const TAU = Math.PI * 2;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const angleDelta = (a, b) => ((b - a + Math.PI * 3) % TAU) - Math.PI;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function buildSprite(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const center = width / 2;
  const bodyWidth = Math.max(12, width * 0.14);
  const halfWidth = center - bodyWidth / 2;
  const left = document.createElement('canvas');
  const right = document.createElement('canvas');
  const body = document.createElement('canvas');
  [left, right].forEach(canvas => { canvas.width = Math.ceil(halfWidth); canvas.height = height; });
  body.width = Math.ceil(bodyWidth); body.height = height;
  left.getContext('2d').drawImage(image, 0, 0, center - bodyWidth / 2, height, 0, 0, left.width, height);
  right.getContext('2d').drawImage(image, center + bodyWidth / 2, 0, width - center - bodyWidth / 2, height, 0, 0, right.width, height);
  body.getContext('2d').drawImage(image, center - bodyWidth / 2, 0, bodyWidth, height, 0, 0, body.width, height);
  return { left, right, body, width, height, halfWidth, bodyWidth };
}

function ButterflyField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const flags = window.__YESLY_PERF__ || new Set();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const dustSprite = document.createElement('canvas');
    dustSprite.width = dustSprite.height = 12;
    const dustCtx = dustSprite.getContext('2d');
    const glow = dustCtx.createRadialGradient(6, 6, 0, 6, 6, 6);
    glow.addColorStop(0, 'rgba(255,239,207,.8)');
    glow.addColorStop(1, 'rgba(255,239,207,0)');
    dustCtx.fillStyle = glow;
    dustCtx.fillRect(0, 0, 12, 12);

    let width = innerWidth;
    let height = innerHeight;
    let dpr = 1;
    let raf = 0;
    let previous = 0;
    let sprites = null;
    // Keep the ambient field alive across the entire page, not only around the
    // hero and ring. The single viewport canvas naturally follows page scroll.
    let visible = true;
    let hidden = document.hidden;
    let staticPainted = false;
    let disposed = false;
    const fliers = [];
    const particles = Array.from({ length: innerWidth <= 640 ? 18 : 40 }, () => ({ active: false }));
    let particleCursor = 0;

    const minSeparation = () => width <= 640 ? 132 : 165;
    const nextTarget = b => {
      const min = minSeparation();
      let best = null;
      let bestDistance = -1;
      for (let i = 0; i < 18; i += 1) {
        let point;
        if (Math.random() < .18) {
          const side = Math.floor(Math.random() * 4);
          const margin = Math.max(58, Math.min(width, height) * .12);
          point = side === 0 ? { x: -margin, y: Math.random() * height }
            : side === 1 ? { x: width + margin, y: Math.random() * height }
              : side === 2 ? { x: Math.random() * width, y: -margin }
                : { x: Math.random() * width, y: height + margin };
        } else {
          point = { x: width * (.04 + Math.random() * .92), y: height * (.04 + Math.random() * .92) };
        }
        const nearest = fliers.reduce((distance, other) => other === b ? distance : Math.min(distance, Math.hypot(point.x - other.x, point.y - other.y)), Infinity);
        if (nearest >= min) return point;
        if (nearest > bestDistance) { best = point; bestDistance = nearest; }
      }
      return best || { x: width / 2, y: height / 2 };
    };
    const seed = (b, index, count) => {
      const columns = width <= 640 ? 2 : 3;
      const rows = Math.ceil(count / columns);
      const col = index % columns;
      const row = Math.floor(index / columns);
      const cellW = width / columns;
      const cellH = height / rows;
      b.x = cellW * (col + .5) + (Math.random() - .5) * cellW * .16;
      b.y = cellH * (row + .5) + (Math.random() - .5) * cellH * .16;
      b.vx = (Math.random() - .5) * 20;
      b.vy = (Math.random() - .5) * 20;
      b.ax = 0;
      b.ay = 0;
      b.angle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
      b.bank = 0;
      b.species = 0;
      b.size = 20 + Math.random() * 20;
      b.phase = Math.random() * TAU;
      b.flap = Math.random() * TAU;
      b.target = null;
      b.targetAt = 0;
      b.dartUntil = 0;
      b.dustAt = performance.now() + Math.random() * 90;
      b.bob = Math.random() * TAU;
      b.opacity = .68 + Math.random() * .24;
    };
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fliers.length = 0;
      const count = motion.matches ? 4 : width <= 640 ? 5 : 9;
      const speciesMix = Array.from({ length: count }, (_, index) => index % SPRITE_URLS.length);
      for (let i = speciesMix.length - 1; i > 0; i -= 1) {
        const swap = Math.floor(Math.random() * (i + 1));
        [speciesMix[i], speciesMix[swap]] = [speciesMix[swap], speciesMix[i]];
      }
      for (let i = 0; i < count; i += 1) {
        const b = {};
        seed(b, i, count);
        b.species = speciesMix[i];
        fliers.push(b);
      }
      particles.forEach(particle => { particle.active = false; });
      staticPainted = false;
      if (sprites && motion.matches) paintStatic();
      else sync();
    };
    const emitDust = (b, time) => {
      if (flags.has('off-dust') || flags.has('off-butterflies')) return;
      const particle = particles[particleCursor++ % particles.length];
      particle.active = true;
      particle.x = b.x - b.vx * .025;
      particle.y = b.y - b.vy * .025;
      particle.vx = -b.vx * .08 + (Math.random() - .5) * 8;
      particle.vy = -b.vy * .08 + (Math.random() - .5) * 8;
      particle.born = time;
      particle.life = 650 + Math.random() * 600;
      particle.size = 3 + Math.random() * 4;
      particle.alpha = .18 + Math.random() * .26;
    };
    const paintButterfly = (b, time, still = false) => {
      const sprite = sprites[b.species];
      const scale = b.size / sprite.width;
      const wingWidth = sprite.halfWidth * scale;
      const height = sprite.height * scale;
      const flap = still ? .74 : .25 + .75 * (.5 + .5 * Math.sin(b.flap));
      const x = b.x;
      const y = b.y + (still ? 0 : Math.sin(time / 620 + b.bob) * 2.2);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(b.angle + b.bank);
      ctx.globalAlpha = b.opacity;
      ctx.drawImage(sprite.left, -wingWidth * flap, -height / 2, wingWidth * flap, height);
      ctx.drawImage(sprite.right, 0, -height / 2, wingWidth * flap, height);
      ctx.drawImage(sprite.body, -sprite.bodyWidth * scale / 2, -height / 2, sprite.bodyWidth * scale, height);
      ctx.restore();
    };
    const paintStatic = () => {
      if (staticPainted || !sprites) return;
      ctx.clearRect(0, 0, width, height);
      fliers.forEach((b, index) => {
        const columns = width <= 640 ? 2 : 3;
        b.x = width * ((index % columns) + .5) / columns;
        b.y = height * (Math.floor(index / columns) + .5) / Math.ceil(fliers.length / columns);
        b.angle = -.12 + index * .12;
        paintButterfly(b, 0, true);
      });
      staticPainted = true;
    };
    const frame = time => {
      raf = 0;
      if (hidden || !visible || motion.matches || !sprites) return;
      const dt = Math.min(.04, previous ? (time - previous) / 1000 : 1 / 60);
      previous = time;
      ctx.clearRect(0, 0, width, height);
      const separation = minSeparation();
      if (!flags.has('off-butterflies')) fliers.forEach(b => {
        if (!b.target || time > b.targetAt) {
          b.target = nextTarget(b);
          b.targetAt = time + 2400 + Math.random() * 3800;
          if (Math.random() < .1) b.dartUntil = time + 180 + Math.random() * 250;
        }
        const dx = b.target.x - b.x;
        const dy = b.target.y - b.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const desiredSpeed = Math.min(74, 28 + distance * .04) * (time < b.dartUntil ? 1.65 : 1);
        let targetAx = dx / distance * desiredSpeed - b.vx;
        let targetAy = dy / distance * desiredSpeed - b.vy;
        for (const other of fliers) {
          if (other === b) continue;
          const apartX = b.x - other.x;
          const apartY = b.y - other.y;
          const apart = Math.max(1, Math.hypot(apartX, apartY));
          if (apart < separation) {
            const push = (separation - apart) / separation * 88;
            targetAx += apartX / apart * push;
            targetAy += apartY / apart * push;
          }
        }
        targetAx = clamp(targetAx, -42, 42);
        targetAy = clamp(targetAy, -42, 42);
        const steeringEase = 1 - Math.exp(-dt * 1.45);
        b.ax += (targetAx - b.ax) * steeringEase;
        b.ay += (targetAy - b.ay) * steeringEase;
        const ax = b.ax;
        const ay = b.ay;
        b.vx += ax * dt;
        b.vy += ay * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const heading = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        b.angle += angleDelta(b.angle, heading) * (1 - Math.exp(-dt * 1.25));
        const bankTarget = clamp(-ax * .0014, -.12, .12);
        b.bank += (bankTarget - b.bank) * (1 - Math.exp(-dt * 1.5));
        const speed = Math.hypot(b.vx, b.vy);
        b.flap += dt * (4.2 + Math.min(10, speed * .13)) + Math.sin(time / 83 + b.phase) * .018;
      });
      // Apply a small positional correction after steering so momentum cannot
      // carry two sprites into one another during a close pass.
      for (let i = 0; i < fliers.length; i += 1) {
        const first = fliers[i];
        for (let j = i + 1; j < fliers.length; j += 1) {
          const second = fliers[j];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distance = Math.hypot(dx, dy);
          if (distance >= separation) continue;
          const safeDistance = Math.max(0.001, distance);
          const angle = distance > 0.001 ? 0 : (i + j) * 1.7;
          const nx = distance > 0.001 ? dx / safeDistance : Math.cos(angle);
          const ny = distance > 0.001 ? dy / safeDistance : Math.sin(angle);
          const correction = (separation - distance) * .5;
          first.x += nx * correction;
          first.y += ny * correction;
          second.x -= nx * correction;
          second.y -= ny * correction;
        }
      }
      fliers.forEach(b => {
        const nearby = b.x > -70 && b.x < width + 70 && b.y > -70 && b.y < height + 70;
        if (!nearby) return;
        if (time > b.dustAt) {
          emitDust(b, time);
          b.dustAt = time + 78 + ((b.phase * 100) % 50);
        }
        paintButterfly(b, time);
      });
      if (!flags.has('off-dust')) {
        for (const particle of particles) {
          if (!particle.active) continue;
          const age = time - particle.born;
          if (age >= particle.life) { particle.active = false; continue; }
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          ctx.globalAlpha = particle.alpha * (1 - age / particle.life);
          ctx.drawImage(dustSprite, particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      const running = !!sprites && !hidden && visible && !motion.matches && !(flags.has('off-dust') && flags.has('off-butterflies'));
      if (running && !raf) { previous = 0; raf = requestAnimationFrame(frame); }
      else if (!running && raf) { cancelAnimationFrame(raf); raf = 0; previous = 0; }
      if (motion.matches) paintStatic();
    };
    const onVisibility = () => { hidden = document.hidden; sync(); };
    const onMotion = () => resize();
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener?.('change', onMotion);
    resize();
    Promise.all(SPRITE_URLS.map(loadImage)).then(images => {
      if (disposed) return;
      sprites = images.map(buildSprite);
      sync();
      if (motion.matches) paintStatic();
    }).catch(() => {});
    return () => {
      disposed = true;
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener?.('change', onMotion);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="butterfly-field" aria-hidden="true"><canvas ref={canvasRef} className="fairy-dust-canvas" /></div>;
}
export default ButterflyField;
