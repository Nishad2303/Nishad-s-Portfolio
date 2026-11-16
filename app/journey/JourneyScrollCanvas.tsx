'use client';

import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type RefObject } from 'react';

const FRAME_COUNT = 160;
const INITIAL_BUFFER = 20;
const FRAME_PATHS = Array.from({ length: FRAME_COUNT }, (_, index) =>
  `/journey/frame-${String(index + 1).padStart(3, '0')}.jpg`,
);

type CanvasFrame = HTMLImageElement;

export default function JourneyScrollCanvas() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameNumberRef = useRef<HTMLSpanElement>(null);
  const contactLinkRef = useRef<HTMLAnchorElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const frameCacheRef = useRef(new Map<number, CanvasFrame>());
  const frameRequestsRef = useRef(new Map<number, Promise<CanvasFrame | null>>());
  const loadFrameRef = useRef<((index: number) => Promise<CanvasFrame | null>) | null>(null);
  const drawLatestRef = useRef<((value: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const currentFrameRef = useRef(1);
  const introRef = useRef<HTMLElement>(null);
  const aeroReducedRef = useRef<HTMLElement>(null);
  const isroReducedRef = useRef<HTMLElement>(null);
  const avascentReducedRef = useRef<HTMLElement>(null);
  const introInView = useInView(introRef, { once: true, amount: 0.25 });
  const aeroInView = useInView(aeroReducedRef, { once: true, amount: 0.2 });
  const isroInView = useInView(isroReducedRef, { once: true, amount: 0.2 });
  const avascentInView = useInView(avascentReducedRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });
  const easedProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
    skipInitialAnimation: true,
  });

  const introOpacity = useTransform(easedProgress, [0, 0.015, 0.08, 0.13], [1, 1, 0.45, 0]);
  const introY = useTransform(easedProgress, [0.08, 0.13], [0, -10]);
  const aeroOpacity = useTransform(easedProgress, [0.2, 0.25, 0.5, 0.55], [0, 1, 1, 0]);
  const aeroY = useTransform(easedProgress, [0.2, 0.25, 0.5, 0.55], [10, 0, 0, -8]);
  const isroOpacity = useTransform(easedProgress, [0.5, 0.55, 0.83, 0.88], [0, 1, 1, 0]);
  const isroY = useTransform(easedProgress, [0.5, 0.55, 0.83, 0.88], [10, 0, 0, -8]);
  const avascentOpacity = useTransform(easedProgress, [0.83, 0.88, 1], [0, 1, 1]);
  const avascentY = useTransform(easedProgress, [0.83, 0.88], [10, 0]);
  const contactOpacity = useTransform(easedProgress, [0.965, 0.99, 1], [0, 0.75, 1]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);

    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    let disposed = false;
    let finishedInitial = 0;
    let failedInitial = false;
    const lookAhead = window.matchMedia('(max-width: 700px)').matches ? 8 : 20;

    const loadFrame = (index: number): Promise<CanvasFrame | null> => {
      if (index < 0 || index >= FRAME_COUNT) return Promise.resolve(null);
      const cached = frameCacheRef.current.get(index);
      if (cached) return Promise.resolve(cached);
      const pending = frameRequestsRef.current.get(index);
      if (pending) return pending;

      const request = new Promise<CanvasFrame | null>((resolve) => {
        const image = new Image();
        image.decoding = 'async';
        const settle = (loadedImage: CanvasFrame | null) => {
          if (index < INITIAL_BUFFER) {
            finishedInitial += 1;
            if (!loadedImage) failedInitial = true;
            if (!disposed) setProgress(Math.round((finishedInitial / INITIAL_BUFFER) * 100));
          }
          const active = activeIndexRef.current;
          if (loadedImage && !disposed && index >= active - 2 && index <= active + lookAhead) {
            frameCacheRef.current.set(index, loadedImage);
            if (Math.abs(index - active) <= 1) drawLatestRef.current?.(easedProgress.get());
          }
          resolve(loadedImage);
        };
        image.onload = async () => {
          try { await image.decode(); } catch { /* A successful load remains drawable. */ }
          settle(image);
        };
        image.onerror = () => settle(null);
        image.src = FRAME_PATHS[index];
      });
      frameRequestsRef.current.set(index, request);
      void request.finally(() => frameRequestsRef.current.delete(index));
      return request;
    };
    loadFrameRef.current = loadFrame;

    Promise.all(Array.from({ length: INITIAL_BUFFER }, (_, index) => loadFrame(index))).then((initialFrames) => {
      if (disposed) return;
      if (failedInitial || initialFrames.some((frame) => !frame)) setLoadError(true);
      else setReady(true);
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    });

    return () => {
      disposed = true;
      loadFrameRef.current = null;
      drawLatestRef.current = null;
      motionPreference.removeEventListener('change', updateMotionPreference);
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!ready || !canvas || !context) return;

    let queuedFrame = 0;
    let latestProgress = easedProgress.get();
    const lookAhead = window.matchMedia('(max-width: 700px)').matches ? 8 : 20;

    const draw = (value: number) => {
      const framePosition = reducedMotion ? FRAME_COUNT - 1 : Math.min(FRAME_COUNT - 1, Math.max(0, value * (FRAME_COUNT - 1)));
      const lowerIndex = Math.floor(framePosition);
      const upperIndex = Math.min(FRAME_COUNT - 1, lowerIndex + 1);
      const fraction = framePosition - lowerIndex;
      const lowerImage = frameCacheRef.current.get(lowerIndex);
      const upperImage = frameCacheRef.current.get(upperIndex);
      if (!lowerImage) void loadFrameRef.current?.(lowerIndex);
      if (!upperImage) void loadFrameRef.current?.(upperIndex);
      if (!lowerImage && !upperImage) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = '#0A0A0A';
      context.fillRect(0, 0, bounds.width, bounds.height);

      const drawCover = (image: CanvasFrame, opacity: number) => {
        const scale = Math.min(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        context.globalAlpha = opacity;
        context.drawImage(image, (bounds.width - drawWidth) / 2, (bounds.height - drawHeight) / 2, drawWidth, drawHeight);
      };
      if (lowerImage) drawCover(lowerImage, upperImage && upperIndex !== lowerIndex ? 1 - fraction : 1);
      else if (upperImage) drawCover(upperImage, 1);
      if (lowerImage && upperImage && upperIndex !== lowerIndex && fraction > 0) drawCover(upperImage, fraction);
      context.globalAlpha = 1;
      const nextFrame = Math.round(framePosition) + 1;
      if (currentFrameRef.current !== nextFrame) {
        currentFrameRef.current = nextFrame;
        if (frameNumberRef.current) frameNumberRef.current.textContent = String(nextFrame).padStart(3, '0');
        if (contactLinkRef.current) contactLinkRef.current.tabIndex = nextFrame === FRAME_COUNT ? 0 : -1;
      }
    };
    drawLatestRef.current = draw;

    const scheduleDraw = (value: number) => {
      latestProgress = value;
      const target = reducedMotion ? FRAME_COUNT - 1 : Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(value * (FRAME_COUNT - 1))));
      activeIndexRef.current = target;
      void loadFrameRef.current?.(target);
      if (!reducedMotion) {
        for (let offset = -2; offset <= lookAhead; offset += 1) void loadFrameRef.current?.(target + offset);
        frameCacheRef.current.forEach((_, index) => {
          if (index < target - 2 || index > target + lookAhead) {
            frameCacheRef.current.delete(index);
          }
        });
      }
      if (queuedFrame) return;
      queuedFrame = window.requestAnimationFrame(() => {
        queuedFrame = 0;
        draw(latestProgress);
      });
    };

    const unsubscribe = easedProgress.on('change', scheduleDraw);
    const resizeObserver = new ResizeObserver(() => scheduleDraw(easedProgress.get()));
    resizeObserver.observe(canvas);
    draw(easedProgress.get());

    return () => {
      if (drawLatestRef.current === draw) drawLatestRef.current = null;
      unsubscribe();
      resizeObserver.disconnect();
      if (queuedFrame) window.cancelAnimationFrame(queuedFrame);
    };
  }, [ready, reducedMotion, easedProgress]);

  const reducedChapter = (ref: RefObject<HTMLElement | null>, visible: boolean, label: string, title: string, copy: string, className = '') => (
    <motion.article
      ref={ref}
      className={`reduced-chapter ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="chapter-label">{label}</p>
      <h2>{title}</h2>
      <p className="chapter-copy">{copy}</p>
    </motion.article>
  );

  return (
    <>
      {!ready && (
        <div className="journey-loader" role="status" aria-live="polite">
          <div className="loader-content">
            {loadError ? <div className="loader-error-mark">!</div> : <span className="loader-spinner" aria-hidden="true"><img src="/assets/brand-mark.svg" alt="" onError={(event) => { event.currentTarget.hidden = true; }} /></span>}
            <p className="loader-label">{loadError ? 'SEQUENCE LOAD INTERRUPTED' : 'PREPARING THE JOURNEY'}</p>
            <p className="loader-message">{loadError ? 'Some sequence frames could not be loaded.' : 'Loading the opening frames'}</p>
            <div className="loader-progress-track"><span style={{ width: `${progress}%` }} /></div>
            <p className="loader-percent">{loadError ? 'RELOAD TO TRY AGAIN' : `${progress}%`}</p>
            {loadError && <button className="loader-retry" type="button" onClick={() => window.location.reload()}>Reload frames</button>}
          </div>
        </div>
      )}

      {reducedMotion ? (
        <div className="journey-reduced-layout" ref={scrollRef}>
          <div className="journey-final-canvas"><canvas ref={canvasRef} aria-label="Final assembled regional jet frame" /></div>
          <div className="reduced-chapter-list">
            {reducedChapter(introRef, introInView, 'THE BEGINNING', 'This is how I got here.', 'A path through machines, teams, and increasingly complex aerospace systems.', 'reduced-intro')}
            {reducedChapter(aeroReducedRef, aeroInView, 'CHAPTER 01 · MAR 2024 TO JAN 2025', 'AeroKLE · Hubli', 'Mechanical subsystem team lead. Joined as an intern, then led the mechanical subsystem team working on micro drones under 2kg and fixed-wing aircraft up to a 2.5m wingspan, representing the university nationally with multiple All India ranks.')}
            {reducedChapter(isroReducedRef, isroInView, 'CHAPTER 02 · FEB 2025 TO MAY 2025', 'ISRO', 'Project Intern · Satellite systems. Contributed to real-scale satellite design, manufacturing, assembly and testing, including prestigious programs such as Gaganyaan and NISAR.')}
            {reducedChapter(avascentReducedRef, avascentInView, 'CHAPTER 03 · MAR 2026 TO PRESENT', 'Avascent Aero', 'Structural Repair Engineer (Design). Supporting Bombardier CRJ aircraft through structural analysis and engineering judgment to ensure integrity, performance and compliance.')}
            <a className="chapter-contact-link" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      ) : (
        <div className="journey-scroll-section" ref={scrollRef}>
          <div className="journey-sticky-stage">
            <canvas ref={canvasRef} aria-label="Scroll controlled 160 frame transformation from a drone to a satellite to a regional jet" />
            <div className="canvas-shade" aria-hidden="true" />

            <div className="journey-story-layer">
              <motion.article className="story-card story-intro" style={{ opacity: introOpacity, y: introY }}>
                <p className="chapter-label">AEROSPACE · MECHANICAL · MAKING</p>
                <h1>This is how<br />I got here.</h1>
                <p className="story-hint">Scroll to move through the transformation</p>
              </motion.article>

              <motion.article className="story-card story-aero" style={{ opacity: aeroOpacity, y: aeroY }}>
                <p className="chapter-label">CHAPTER 01 · MAR 2024 TO JAN 2025</p>
                <h2>AeroKLE · Hubli</h2>
                <p className="story-role">Mechanical subsystem team lead</p>
                <p>Joined as an intern, went on to lead the mechanical subsystem team. Worked on micro drones under 2kg and fixed-wing aircraft up to a 2.5m wingspan, representing the university nationally with multiple All India ranks as team lead.</p>
              </motion.article>

              <motion.article className="story-card story-isro" style={{ opacity: isroOpacity, y: isroY }}>
                <p className="chapter-label">CHAPTER 02 · FEB 2025 TO MAY 2025</p>
                <h2>ISRO</h2>
                <p className="story-role">Project Intern · Satellite systems</p>
                <p>Project intern on real-scale satellite work: design, manufacturing, assembly and testing, contributing to prestigious programs including Gaganyaan and NISAR.</p>
              </motion.article>

              <motion.article className="story-card story-avascent" style={{ opacity: avascentOpacity, y: avascentY }}>
                <p className="chapter-label">CHAPTER 03 · MAR 2026 TO PRESENT</p>
                <h2>Avascent Aero</h2>
                <p className="story-role">Structural Repair Engineer (Design)</p>
                <p>Structural analysis and support for Bombardier CRJ aircraft, applying engineering judgment to ensure structural integrity, performance and compliance, bridging a mechanical engineering background into high reliability aerospace systems.</p>
                <motion.a ref={contactLinkRef} className="story-contact-link" href="#contact" style={{ opacity: contactOpacity }} tabIndex={-1}>
                  Get in touch <span aria-hidden="true">↗</span>
                </motion.a>
              </motion.article>
            </div>

            <div className="journey-screen-hud" aria-hidden="true">
              <span className="frame-counter"><span ref={frameNumberRef}>001</span> <i>/</i> 160</span>
              <span className="hud-caption">DRONE <i>→</i> SATELLITE <i>→</i> REGIONAL JET</span>
            </div>
            <motion.div className="journey-scroll-progress" style={{ scaleX: easedProgress }} aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
}

