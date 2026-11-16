(() => {
  const track = document.querySelector('[data-cert-track]');
  const status = document.querySelector('[data-cert-status]');
  const viewer = document.querySelector('[data-cert-viewer]');
  if (!track || !status || !viewer) return;

  const imageViewer = viewer.querySelector('[data-viewer-image]');
  const pdfViewer = viewer.querySelector('[data-viewer-pdf]');
  const titleViewer = viewer.querySelector('[data-viewer-title]');
  const countViewer = viewer.querySelector('[data-viewer-count]');
  let certificates = [];
  let activeIndex = 0;
  let activePosition = 0;
  let viewerIndex = 0;
  let scrollFrame = 0;
  let recenterTimer = 0;
  let wheelAccumulator = 0;
  let lastWheelStep = 0;
  const localCertificates = [
    '3D Printing Application From Illinois University.png',
    'Certified As SolidWorks 3D Creator Associate.jpg',
    'Certified As SolidWorks Associate In Additive Manufacturing.jpg',
    'Certified As SolidWorks Associate In Mechanical Design.jpg',
    'Certified As SolidWorks Sustainability Associate.jpg',
    'Failure Mode And Effects Analysis (FMEA) from IMTMA.png',
    'Geometric Dimensioning & Tolerancing (GD&T)  from IMTMA.png',
    'HyperWorks for Pre Processing v2022.2.png',
    'Introduction to Python Programming  from Penn University.png',
    'Mastering ANSYS with FEA &CFD(Computational Fluid Dynamics).jpg',
    'Siemens NX Unigraphics (UG) Fundamental 3D Modelling Course.jpg',
    'Topology Optimization Using Ansys Mechanical.png',
  ].map((name) => {
    const extension = name.slice(name.lastIndexOf('.')).toLowerCase();
    return {
      name,
      title: name.slice(0, name.lastIndexOf('.')).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim(),
      type: extension === '.pdf' ? 'pdf' : 'image',
      url: `certificate/${encodeURIComponent(name)}`,
    };
  });

  const makeCard = (certificate, index, position) => {
    const article = document.createElement('article');
    article.className = 'cert-card';
    article.dataset.certIndex = String(index);
    article.dataset.position = String(position);

    const button = document.createElement('button');
    button.className = 'cert-card-open';
    button.type = 'button';
    button.setAttribute('aria-label', `Open ${certificate.title} full screen`);

    const preview = document.createElement('span');
    preview.className = 'cert-card-preview';
    if (certificate.type === 'image') {
      const image = document.createElement('img');
      image.src = certificate.url;
      image.alt = '';
      image.loading = 'lazy';
      preview.append(image);
    } else {
      preview.classList.add('cert-card-pdf-preview');
      preview.innerHTML = '<span class="cert-pdf-mark" aria-hidden="true">PDF</span><span class="cert-pdf-lines" aria-hidden="true"><i></i><i></i><i></i></span><span class="cert-pdf-caption">OPEN TO VIEW CERTIFICATE</span>';
    }

    const details = document.createElement('span');
    details.className = 'cert-card-details';
    const number = document.createElement('span');
    number.className = 'cert-card-number';
    number.textContent = `CERTIFICATE ${String(index + 1).padStart(2, '0')}`;
    const title = document.createElement('span');
    title.className = 'cert-card-title';
    title.textContent = certificate.title;
    const open = document.createElement('span');
    open.className = 'cert-card-action';
    open.innerHTML = 'VIEW FULL PAGE <span aria-hidden="true">↗</span>';
    details.append(number, title, open);
    button.append(preview, details);
    button.addEventListener('click', () => openViewer(index));
    article.append(button);
    return article;
  };

  const setActive = (position, moveTrack = false) => {
    if (!certificates.length) return;
    activePosition = Math.max(0, Math.min(certificates.length * 3 - 1, position));
    activeIndex = activePosition % certificates.length;
    const cards = track.querySelectorAll('.cert-card');
    cards.forEach((card) => {
      const selected = Number(card.dataset.position) === activePosition;
      card.classList.toggle('is-active', selected);
      card.querySelector('button')?.setAttribute('aria-current', selected ? 'true' : 'false');
    });
    status.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(certificates.length).padStart(2, '0')} · SCROLL OR USE THE ARROWS`;
    if (moveTrack) {
      const card = track.querySelector(`[data-position="${activePosition}"]`);
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    }
  };

  const recenterIfNeeded = () => {
    const count = certificates.length;
    if (!count || (activePosition >= count && activePosition < count * 2)) return;
    const nextPosition = activePosition < count ? activePosition + count : activePosition - count;
    const card = track.querySelector(`[data-position="${nextPosition}"]`);
    if (!card) return;
    activePosition = nextPosition;
    activeIndex = activePosition % count;
    track.querySelectorAll('.cert-card').forEach((item) => {
      const selected = Number(item.dataset.position) === activePosition;
      item.classList.toggle('is-active', selected);
      item.querySelector('button')?.setAttribute('aria-current', selected ? 'true' : 'false');
    });
    track.scrollLeft = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
  };

  const updateActiveFromScroll = () => {
    scrollFrame = 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    const cards = [...track.querySelectorAll('.cert-card')];
    if (!cards.length) return;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const nextDistance = Math.abs(cardCenter - center);
      if (nextDistance < distance) { distance = nextDistance; nearest = Number(card.dataset.position); }
    });
    setActive(nearest);
    window.clearTimeout(recenterTimer);
    recenterTimer = window.setTimeout(recenterIfNeeded, 120);
  };

  const showViewerCertificate = (index) => {
    if (!certificates.length) return;
    viewerIndex = (index + certificates.length) % certificates.length;
    const certificate = certificates[viewerIndex];
    titleViewer.textContent = certificate.title;
    countViewer.textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(certificates.length).padStart(2, '0')}`;
    if (certificate.type === 'pdf') {
      imageViewer.hidden = true;
      imageViewer.removeAttribute('src');
      pdfViewer.hidden = false;
      pdfViewer.src = `${certificate.url}#toolbar=0&navpanes=0&view=Fit`;
    } else {
      pdfViewer.hidden = true;
      pdfViewer.removeAttribute('src');
      imageViewer.hidden = false;
      imageViewer.src = certificate.url;
      imageViewer.alt = certificate.title;
    }
  };

  function openViewer(index) {
    showViewerCertificate(index);
    if (!viewer.open) viewer.showModal();
  }

  const closeViewer = () => {
    viewer.close();
    pdfViewer.removeAttribute('src');
    imageViewer.removeAttribute('src');
  };

  track.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActiveFromScroll);
  }, { passive: true });
  track.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      wheelAccumulator += event.deltaY;
      const now = performance.now();
      if (Math.abs(wheelAccumulator) < 30 || now - lastWheelStep < 180) return;
      const direction = Math.sign(wheelAccumulator);
      wheelAccumulator = 0;
      lastWheelStep = now;
      setActive(activePosition + direction, true);
    }
  }, { passive: false });
  document.querySelector('[data-cert-previous]')?.addEventListener('click', () => setActive(activePosition - 1, true));
  document.querySelector('[data-cert-next]')?.addEventListener('click', () => setActive(activePosition + 1, true));
  viewer.querySelector('.cert-viewer-close')?.addEventListener('click', closeViewer);
  viewer.querySelector('[data-viewer-previous]')?.addEventListener('click', () => showViewerCertificate(viewerIndex - 1));
  viewer.querySelector('[data-viewer-next]')?.addEventListener('click', () => showViewerCertificate(viewerIndex + 1));
  viewer.addEventListener('click', (event) => { if (event.target === viewer) closeViewer(); });
  viewer.addEventListener('close', () => {
    pdfViewer.removeAttribute('src');
    imageViewer.removeAttribute('src');
  });
  window.addEventListener('keydown', (event) => {
    if (!viewer.open) return;
    if (event.key === 'ArrowRight') showViewerCertificate(viewerIndex + 1);
    if (event.key === 'ArrowLeft') showViewerCertificate(viewerIndex - 1);
  });

  (window.location.protocol === 'file:'
    ? Promise.resolve(localCertificates)
    : fetch('/api/certificates', { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('Could not load certificates');
      return response.json();
    }))
    .then((items) => {
      certificates = Array.isArray(items) ? items : [];
      if (!certificates.length) {
        status.innerHTML = 'Add PDF, PNG, JPG, JPEG, or WEBP files to the <code>certificate</code> folder to show them here.';
        track.innerHTML = '<div class="cert-empty"><span>01</span><h2>Your certificates will appear here</h2><p>Drop your files in the certificate folder and refresh this page.</p></div>';
        document.querySelectorAll('[data-cert-previous], [data-cert-next]').forEach((button) => { button.disabled = true; });
        return;
      }
      for (let copy = 0; copy < 3; copy += 1) {
        certificates.forEach((certificate, index) => {
          track.append(makeCard(certificate, index, copy * certificates.length + index));
        });
      }
      setActive(certificates.length, true);
    })
    .catch(() => {
      status.textContent = 'Open this page through the portfolio server to load certificates.';
      track.innerHTML = '<div class="cert-empty"><span>!</span><h2>Certificate gallery unavailable</h2><p>Reload the page through the local portfolio server.</p></div>';
    });
})();
