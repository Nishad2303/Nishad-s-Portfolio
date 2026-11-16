(() => {
  const carousel = document.querySelector('.about-carousel');
  if (!carousel) return;

  const image = carousel.querySelector('[data-carousel-image]');
  const caption = carousel.querySelector('[data-carousel-caption]');
  const current = carousel.querySelector('[data-carousel-current]');
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-to]'));
  if (!image || !caption || !current || !dots.length) return;

  const slides = [
    { src: 'about-carousel/personal-01.jpg', alt: 'Nishad and a teammate discussing their UAV at a workbench', caption: 'AeroKLE · UAV workshop', fit: 'photo' },
    { src: 'about-carousel/personal-02.jpg', alt: 'Nishad presenting an AeroKLE project at the university', caption: 'AeroKLE · Project presentation', fit: 'photo' },
    { src: 'about-carousel/personal-03.jpg', alt: 'Nishad speaking about an aerospace design project', caption: 'AeroKLE · Design team talk', fit: 'photo' },
    { src: 'about-carousel/personal-04.jpg', alt: 'Nishad working hands-on with a prototype in the workshop', caption: 'Prototyping · Workshop', fit: 'photo' },
    { src: 'about-carousel/personal-05.jpg', alt: 'Nishad and teammates collaborating around a design table', caption: 'Team session · Design review', fit: 'photo' },
    { src: 'about-carousel/personal-06.jpg', alt: 'AeroKLE teammates testing a UAV outdoors', caption: 'Aerothon · UAV trials', fit: 'photo' },
    { src: 'about-carousel/personal-07.jpg', alt: 'AeroKLE team gathered with their UAV at a competition', caption: 'AeroKLE · Competition team', fit: 'photo' },
    { src: 'about-carousel/personal-08.jpg', alt: 'AeroKLE team demonstrating their UAV to visitors', caption: 'AeroKLE · UAV showcase', fit: 'photo' },
  ];
  const previous = carousel.querySelector('[data-carousel-previous]');
  const next = carousel.querySelector('[data-carousel-next]');
  const count = carousel.querySelector('[data-carousel-total]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = 5000;
  let activeIndex = 0;
  let timer = 0;

  if (count) count.textContent = String(slides.length).padStart(2, '0');

  const setSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    const slide = slides[activeIndex];
    image.classList.remove('is-visible');
    const reveal = () => image.classList.add('is-visible');
    image.onload = reveal;
    image.src = slide.src;
    image.alt = slide.alt;
    image.classList.toggle('is-photo', slide.fit === 'photo');
    caption.textContent = slide.caption;
    current.textContent = String(activeIndex + 1).padStart(2, '0');
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
    const nextSlide = new Image();
    nextSlide.src = slides[(activeIndex + 1) % slides.length].src;
    if (image.complete && image.naturalWidth > 0) reveal();
  };

  const stop = () => { window.clearInterval(timer); timer = 0; };
  const start = () => {
    stop();
    if (!reducedMotion && !document.hidden) timer = window.setInterval(() => setSlide(activeIndex + 1), delay);
  };

  previous?.addEventListener('click', () => { setSlide(activeIndex - 1); start(); });
  next?.addEventListener('click', () => { setSlide(activeIndex + 1); start(); });
  dots.forEach((dot) => dot.addEventListener('click', () => {
    setSlide(Number(dot.dataset.carouselTo));
    start();
  }));
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) start();
  });
  document.addEventListener('visibilitychange', start);
  setSlide(0);
  start();
})();
