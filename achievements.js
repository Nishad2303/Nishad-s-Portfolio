(() => {
  const track = document.querySelector('[data-achievement-track]');
  const status = document.querySelector('[data-achievement-status]');
  const viewer = document.querySelector('[data-achievement-viewer]');
  if (!track || !status || !viewer) return;

  const items = [
    {
      file: 'SAE ISS Aero Design Challenge 2022 (All India Rank 1).jpg',
      title: 'SAE ISS Aero Design Challenge',
      year: '2022',
      award: 'ALL INDIA RANK 1',
      summary: 'Designed and fabricated a fixed-wing RC aircraft with a 10-member KLE Tech team. Contributed to the technical report and presentation for an AIR 1 finish.',
      copy: 'As part of a 10-member team representing KLE Technological University at the SAE India Aero Design Challenge, I helped design and fabricate a fixed-wing RC aircraft. I also contributed to the technical reports and presentation. Our design and technical presentation earned AIR 1 overall, highlighting teamwork, creativity, and engineering precision.',
      alt: 'Nishad and the aeroKLE team presenting their award-winning fixed-wing aircraft',
    },
    {
      file: 'SAE ISS Autonomous Drone Design Challenge 2023 (All India Rank 2).jpg',
      title: 'SAE ISS Autonomous Drone Design Challenge',
      year: '2023',
      award: 'ALL INDIA RANK 2',
      summary: 'Worked across aerodynamics, structural design, and fabrication to build aeroKLE’s AIR 2 competition drone.',
      copy: 'At the SAE India Autonomous Drone Design Challenge 2023, I was a core member of aeroKLE and helped design and develop our competition drone. I worked on aerodynamic optimization, structural design, and fabrication to achieve stable, high-performance flight. The team earned AIR 2, reflecting our strengths in mechanical design, prototyping, and collaboration.',
      alt: 'Nishad with the aeroKLE autonomous drone design team at the 2023 competition',
    },
    {
      file: 'SAE India Aerothon 2023 [All India Rank 4 (Best Autonomous Flight) ].jpg',
      title: 'SAE India Aerothon',
      year: '2023',
      award: 'AIR 4 · BEST AUTONOMOUS FLIGHT',
      summary: 'Led mechanical performance, using MATLAB and ANSYS to help earn AIR 4 and Best Autonomous Flight.',
      copy: 'At SAE India Aerothon 2023, we earned AIR 4 and the Best Autonomous Flight award for our drone. As Mechanical Lead, I focused on stability and maneuverability, using MATLAB for stabilization and ANSYS Mechanical Workbench and ANSYS Fluent for simulation and analysis. The performance-driven design reflected my work in mechanical design, aerodynamics, and simulation-led engineering.',
      alt: 'The aeroKLE team with their Best Autonomous Flight drone at SAE India Aerothon 2023',
    },
    {
      file: 'SAE ISS Autonomous Drone Design Challenge 2024 (All India Rank 2).jpg',
      title: 'SAE ISS Autonomous Drone Design Challenge',
      year: '2024',
      award: 'ALL INDIA RANK 2',
      summary: 'Led the payload-delivery project and optimized its hub assembly. The payload landed 0.36 m from target, earning AIR 2.',
      copy: 'At the Autonomous Drone Design Challenge 2024, aeroKLE earned AIR 2 with a drone built to deliver a fragile payload. As Team Lead, I managed the project and resources while contributing to the technical work. I designed and optimized the hub assembly in SolidWorks and ran CFD analysis in ANSYS to improve performance. Our payload landed 0.36 meters from the target.',
      alt: 'The aeroKLE team celebrating their 2024 Autonomous Drone Design Challenge result',
    },
    {
      file: 'SAE India Aerothon 2024 (All India Rank 3).jpg',
      title: 'SAE India Aerothon',
      year: '2024',
      award: 'ALL INDIA RANK 3',
      summary: 'Led and piloted TRAKSHYA, an autonomous surveillance and disaster-response quadcopter, to AIR 3.',
      copy: 'At SAEINDIA Aerothon 2024, aeroKLE earned AIR 3 with TRAKSHYA, an autonomous quadcopter designed for surveillance and disaster management. It completed autonomous field surveillance, hotspot detection, shape classification, and precise payload delivery. As Team Captain and Pilot, I led the project, oversaw aerodynamic design, thermal management, and simulation, and piloted the aircraft at competition. The experience strengthened my leadership and hands-on UAV engineering.',
      alt: 'The aeroKLE team and TRAKSHYA autonomous quadcopter at SAE India Aerothon 2024',
    },
  ];

  const imageUrl = (file) => window.location.protocol === 'file:'
    ? `Achievements/${encodeURIComponent(file)}`
    : `/api/achievements/${encodeURIComponent(file)}`;

  document.querySelectorAll('[data-research-photo]').forEach((link) => {
    const file = link.dataset.researchPhoto;
    const url = window.location.protocol === 'file:'
      ? `Achievements/research%20%26%20recoqnistion/${encodeURIComponent(file)}`
      : `/api/research-recognition/${encodeURIComponent(file)}`;
    link.href = url;
    const photo = link.querySelector('img');
    if (photo) photo.src = url;
  });

  const researchViewer = document.querySelector('[data-research-viewer]');
  const researchViewerImage = researchViewer?.querySelector('[data-research-viewer-image]');
  const researchViewerTitle = researchViewer?.querySelector('[data-research-viewer-title]');
  const researchViewerCaption = researchViewer?.querySelector('[data-research-viewer-caption]');
  document.querySelectorAll('[data-research-photo]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (!researchViewer || !researchViewerImage || !researchViewerTitle || !researchViewerCaption) return;
      const preview = link.querySelector('img');
      researchViewerImage.src = link.href;
      researchViewerImage.alt = preview?.alt || link.dataset.researchTitle || 'Research and recognition photo';
      researchViewerTitle.textContent = link.dataset.researchTitle || 'Research and recognition photo';
      researchViewerCaption.textContent = link.dataset.researchCaption || '';
      researchViewer.showModal();
    });
  });
  researchViewer?.querySelector('.cert-viewer-close')?.addEventListener('click', () => researchViewer.close());
  researchViewer?.addEventListener('click', (event) => { if (event.target === researchViewer) researchViewer.close(); });
  researchViewer?.addEventListener('close', () => researchViewerImage?.removeAttribute('src'));

  const image = viewer.querySelector('[data-achievement-viewer-image]');
  const title = viewer.querySelector('[data-achievement-viewer-title]');
  const count = viewer.querySelector('[data-achievement-viewer-count]');
  const award = viewer.querySelector('[data-achievement-viewer-award]');
  const copy = viewer.querySelector('[data-achievement-viewer-copy]');
  let activePosition = 0;
  let viewerIndex = 0;
  let scrollFrame = 0;
  let recenterTimer = 0;
  let wheelAccumulator = 0;
  let lastWheelStep = 0;

  const createCard = (item, index, position) => {
    const article = document.createElement('article');
    article.className = 'cert-card achievement-card';
    article.dataset.position = String(position);

    const button = document.createElement('button');
    button.className = 'cert-card-open achievement-card-open';
    button.type = 'button';
    button.setAttribute('aria-label', `Open ${item.title} ${item.year}, ${item.award}`);

    const preview = document.createElement('span');
    preview.className = 'cert-card-preview achievement-card-preview';
    const photo = document.createElement('img');
    photo.src = imageUrl(item.file);
    photo.alt = item.alt;
    photo.loading = 'lazy';
    preview.append(photo);

    const details = document.createElement('span');
    details.className = 'cert-card-details achievement-card-details';
    const award = document.createElement('span');
    award.className = 'achievement-award';
    award.textContent = item.award;
    const heading = document.createElement('span');
    heading.className = 'cert-card-title achievement-card-title';
    heading.textContent = `${item.title} · ${item.year}`;
    const summary = document.createElement('span');
    summary.className = 'achievement-card-summary';
    summary.textContent = item.summary;
    const action = document.createElement('span');
    action.className = 'cert-card-action';
    action.innerHTML = 'OPEN PHOTO & STORY <span aria-hidden="true">↗</span>';
    details.append(award, heading, summary, action);
    button.append(preview, details);
    button.addEventListener('click', () => openViewer(index));
    article.append(button);
    return article;
  };

  const setActive = (position, moveTrack = false) => {
    activePosition = Math.max(0, Math.min(items.length * 3 - 1, position));
    const activeIndex = activePosition % items.length;
    track.querySelectorAll('.cert-card').forEach((card) => {
      const selected = Number(card.dataset.position) === activePosition;
      card.classList.toggle('is-active', selected);
      card.querySelector('button')?.setAttribute('aria-current', selected ? 'true' : 'false');
    });
    status.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} · SCROLL OR USE THE ARROWS`;
    if (moveTrack) {
      const card = track.querySelector(`[data-position="${activePosition}"]`);
      if (card) track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    }
  };

  const recenterIfNeeded = () => {
    const size = items.length;
    if (activePosition >= size && activePosition < size * 2) return;
    const position = activePosition < size ? activePosition + size : activePosition - size;
    const card = track.querySelector(`[data-position="${position}"]`);
    if (!card) return;
    activePosition = position;
    track.querySelectorAll('.cert-card').forEach((element) => {
      const selected = Number(element.dataset.position) === position;
      element.classList.toggle('is-active', selected);
      element.querySelector('button')?.setAttribute('aria-current', selected ? 'true' : 'false');
    });
    track.scrollLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
  };

  const updateActiveFromScroll = () => {
    scrollFrame = 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = activePosition;
    let distance = Infinity;
    track.querySelectorAll('.cert-card').forEach((card) => {
      const nextDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (nextDistance < distance) { distance = nextDistance; nearest = Number(card.dataset.position); }
    });
    setActive(nearest);
    window.clearTimeout(recenterTimer);
    recenterTimer = window.setTimeout(recenterIfNeeded, 140);
  };

  const showViewer = (index) => {
    viewerIndex = (index + items.length) % items.length;
    const item = items[viewerIndex];
    image.src = imageUrl(item.file);
    image.alt = item.alt;
    title.textContent = `${item.title} · ${item.year}`;
    count.textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    award.textContent = item.award;
    copy.textContent = item.copy;
  };

  function openViewer(index) {
    showViewer(index);
    if (!viewer.open) viewer.showModal();
  }

  track.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActiveFromScroll);
  }, { passive: true });
  track.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    wheelAccumulator += event.deltaY;
    const now = performance.now();
    if (Math.abs(wheelAccumulator) < 30 || now - lastWheelStep < 180) return;
    const direction = Math.sign(wheelAccumulator);
    wheelAccumulator = 0;
    lastWheelStep = now;
    setActive(activePosition + direction, true);
  }, { passive: false });
  document.querySelector('[data-achievement-previous]')?.addEventListener('click', () => setActive(activePosition - 1, true));
  document.querySelector('[data-achievement-next]')?.addEventListener('click', () => setActive(activePosition + 1, true));
  viewer.querySelector('.cert-viewer-close')?.addEventListener('click', () => viewer.close());
  viewer.querySelector('[data-achievement-viewer-previous]')?.addEventListener('click', () => showViewer(viewerIndex - 1));
  viewer.querySelector('[data-achievement-viewer-next]')?.addEventListener('click', () => showViewer(viewerIndex + 1));
  viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => image.removeAttribute('src'));
  window.addEventListener('keydown', (event) => {
    if (!viewer.open) return;
    if (event.key === 'ArrowRight') showViewer(viewerIndex + 1);
    if (event.key === 'ArrowLeft') showViewer(viewerIndex - 1);
  });

  for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
    items.forEach((item, index) => track.append(createCard(item, index, copyIndex * items.length + index)));
  }
  setActive(items.length, true);
})();
