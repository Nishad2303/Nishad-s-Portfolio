(() => {
  const section = document.querySelector('.journey-scrolly');
  const canvas = document.querySelector('.journey-canvas');
  const loader = document.querySelector('.journey-loader');
  const progressFill = document.querySelector('#journey-progress');
  const loadProgress = document.querySelector('#journey-loader-progress');
  const loadPercent = document.querySelector('#journey-loader-percent');
  const frameCount = document.querySelector('#journey-frame-count');
  if (!section || !canvas || !loader || !progressFill) return;

  const FRAME_COUNT = 160;
  const basePath = window.location.protocol === 'file:' ? 'public/journey' : '/journey';
  const context = canvas.getContext('2d', { alpha: false });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lookAhead = window.matchMedia('(max-width: 700px)').matches ? 8 : 20;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  let targetProgress = 0;
  let easedProgress = 0;
  let lastTick = 0;
  let smoothingFrame = 0;
  let currentFrame = -1;
  let activeIndex = 0;
  let scheduled = false;
  const cache = new Map();
  const pending = new Map();

  const loadImage = (index) => {
    if (index < 0 || index >= FRAME_COUNT) return Promise.resolve(null);
    if (cache.has(index)) return Promise.resolve(cache.get(index));
    if (pending.has(index)) return pending.get(index);
    const request = new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = async () => {
      try { await image.decode(); } catch { /* onload confirms that it can still be drawn. */ }
      if (Math.abs(index - activeIndex) <= lookAhead || index < 20) {
        cache.set(index, image);
        if (Math.abs(index - activeIndex) <= 1) drawFrame(easedProgress * (FRAME_COUNT - 1));
      }
      resolve(image);
    };
    image.onerror = () => resolve(null);
    image.src = `${basePath}/frame-${String(index + 1).padStart(3, '0')}.jpg`;
    });
    pending.set(index, request);
    request.finally(() => pending.delete(index));
    return request;
  };

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const drawFrame = (position) => {
    const framePosition = Math.max(0, Math.min(FRAME_COUNT - 1, position));
    const lowerIndex = Math.floor(framePosition);
    const upperIndex = Math.min(FRAME_COUNT - 1, lowerIndex + 1);
    const fraction = framePosition - lowerIndex;
    const nearestIndex = fraction < .5 ? lowerIndex : upperIndex;
    const image = cache.get(nearestIndex) || cache.get(lowerIndex) || cache.get(upperIndex);
    if (!image) return;
    if (!context) return;
    resizeCanvas();
    const rect = canvas.getBoundingClientRect();
    context.fillStyle = '#080c10';
    context.fillRect(0, 0, rect.width, rect.height);
    const scale = Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(image, (rect.width - width) / 2, (rect.height - height) / 2, width, height);
    currentFrame = nearestIndex;
    frameCount.textContent = `${String(currentFrame + 1).padStart(3, '0')} / ${FRAME_COUNT}`;
  };

  const updateStory = (progress) => {
    document.querySelectorAll('.journey-story').forEach((story) => {
      const from = Number(story.dataset.from || 0);
      const to = Number(story.dataset.to || 1);
      const fade = Math.min(.05, (to - from) / 3);
      let opacity = progress < from + fade ? Math.min(1, Math.max(0, (progress - from) / fade)) : 1;
      const isFinalStory = story.classList.contains('journey-story-avascent');
      if (!isFinalStory && progress > to - fade) opacity = Math.min(opacity, Math.max(0, (to - progress) / fade));
      if (story.classList.contains('journey-story-intro') && progress <= to - fade) opacity = 1;
      story.style.opacity = String(opacity);
      story.style.transform = story.classList.contains('journey-story-intro')
        ? `translate(-50%, calc(-50% + ${(1 - opacity) * 12}px))`
        : `translateY(${(1 - opacity) * 12}px)`;
    });
    const contactButton = document.querySelector('.journey-contact-button');
    if (contactButton) {
      const contactOpacity = Math.min(1, Math.max(0, (progress - .965) / .025));
      contactButton.style.opacity = String(contactOpacity);
      contactButton.style.pointerEvents = contactOpacity > .5 ? 'auto' : 'none';
      contactButton.tabIndex = contactOpacity > .5 ? 0 : -1;
    }
  };

  const update = () => {
    scheduled = false;
    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    targetProgress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
    if (reducedMotion) easedProgress = targetProgress;
    if (!smoothingFrame) smoothingFrame = requestAnimationFrame(animateProgress);
  };

  const animateProgress = (timestamp) => {
    const delta = lastTick ? Math.min(48, timestamp - lastTick) : 16;
    lastTick = timestamp;
    const ease = reducedMotion ? 1 : 1 - Math.exp(-delta / 120);
    easedProgress += (targetProgress - easedProgress) * ease;
    if (Math.abs(targetProgress - easedProgress) < 0.00025) easedProgress = targetProgress;

    const progress = easedProgress;
    progressFill.style.width = `${progress * 100}%`;
    updateStory(progress);
    if (!reducedMotion) {
      const framePosition = progress * (FRAME_COUNT - 1);
      const index = Math.floor(framePosition);
      activeIndex = index;
      for (const cachedIndex of cache.keys()) {
        if (cachedIndex < index - 2 || (cachedIndex > index + lookAhead && cachedIndex >= 20)) cache.delete(cachedIndex);
      }
      loadImage(index).then((image) => { if (image && activeIndex === index) drawFrame(framePosition); });
      loadImage(index + 1).then((image) => { if (image && activeIndex === index) drawFrame(easedProgress * (FRAME_COUNT - 1)); });
      for (let offset = -2; offset <= lookAhead; offset += 1) loadImage(index + offset);
      if (cache.has(index)) drawFrame(framePosition);
    }
    if (Math.abs(targetProgress - easedProgress) >= 0.00025) smoothingFrame = requestAnimationFrame(animateProgress);
    else { smoothingFrame = 0; lastTick = 0; }
  };

  const queueUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  let loadedCount = 0;
  Promise.all(Array.from({ length: 20 }, (_, index) => loadImage(index).then((image) => {
    loadedCount += 1;
    const done = loadedCount;
    const percent = Math.round((done / 20) * 100);
    loadProgress.style.width = `${percent}%`;
    loadPercent.textContent = `${percent}%`;
    return image;
  }))).then((loaded) => {
    document.body.style.overflow = previousOverflow;
    loader.classList.add('is-ready');
    if (loaded.some((image) => !image)) {
      loader.classList.remove('is-ready');
      loader.querySelector('.journey-loader-content p').textContent = 'A FRAME COULD NOT LOAD — REFRESH TO TRY AGAIN';
      return;
    }
    if (reducedMotion) {
      activeIndex = FRAME_COUNT - 1;
      loadImage(activeIndex).then((image) => { if (image) drawFrame(activeIndex); });
    } else drawFrame(0);
    update();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
  });
})();
