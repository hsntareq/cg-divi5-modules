document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.cg_carousel');

  carousels.forEach((carousel) => {
    // Find settings
    const inner = carousel.querySelector('.cg_carousel__inner') as HTMLElement;
    if (!inner) return;

    let settings = {
      autoplay: 'off',
      speed: 3000,
      transitionSpeed: 500,
      loop: 'on',
      arrows: 'on',
      dots: 'on'
    };

    const settingsAttr = inner.getAttribute('data-settings');
    if (settingsAttr) {
      try {
        settings = { ...settings, ...JSON.parse(settingsAttr) };
      } catch (e) {
        console.error('Error parsing carousel settings', e);
      }
    }

    const track = carousel.querySelector('.cg_carousel__track') as HTMLElement;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const slidesCount = slides.length;
    if (slidesCount <= 1) return; // No need to slide if 1 or 0 slides

    // Track active index
    let currentIndex = 1; // 1 because of pre-cloned slide
    let isTransitioning = false;
    let autoplayTimer: any = null;

    // Apply transition duration to track
    track.style.transition = `transform ${settings.transitionSpeed}ms ease-in-out`;

    // Clone first and last slides for infinite loop
    const firstClone = slides[0].cloneNode(true) as HTMLElement;
    const lastClone = slides[slidesCount - 1].cloneNode(true) as HTMLElement;
    
    // Mark them as clones
    firstClone.classList.add('cg_carousel__slide--clone');
    lastClone.classList.add('cg_carousel__slide--clone');

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    // Update initial position translating past the lastClone at index 0
    updateSlidePosition(false);

    // Dynamic Navigation: Arrows
    let prevBtn: HTMLButtonElement | null = null;
    let nextBtn: HTMLButtonElement | null = null;

    if (settings.arrows === 'on') {
      prevBtn = document.createElement('button');
      prevBtn.className = 'cg_carousel__arrow cg_carousel__arrow--prev';
      prevBtn.innerHTML = '&lsaquo;';
      prevBtn.setAttribute('aria-label', 'Previous slide');

      nextBtn = document.createElement('button');
      nextBtn.className = 'cg_carousel__arrow cg_carousel__arrow--next';
      nextBtn.innerHTML = '&rsaquo;';
      nextBtn.setAttribute('aria-label', 'Next slide');

      inner.appendChild(prevBtn);
      inner.appendChild(nextBtn);

      prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        stopAutoplay();
        goToSlide(currentIndex - 1);
        startAutoplay();
      });

      nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        stopAutoplay();
        goToSlide(currentIndex + 1);
        startAutoplay();
      });
    }

    // Dynamic Navigation: Dots
    let dotsContainer: HTMLDivElement | null = null;
    let dotElements: HTMLButtonElement[] = [];

    if (settings.dots === 'on') {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'cg_carousel__dots';

      for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'cg_carousel__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          if (isTransitioning) return;
          stopAutoplay();
          goToSlide(i + 1);
          startAutoplay();
        });
        dotsContainer.appendChild(dot);
        dotElements.push(dot);
      }
      inner.appendChild(dotsContainer);
    }

    function updateSlidePosition(withTransition = true) {
      if (withTransition) {
        track.style.transition = `transform ${settings.transitionSpeed}ms ease-in-out`;
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function updateActiveDot() {
      if (!dotsContainer) return;
      // Calculate dot index based on current slide index (1-based, minus clones)
      let dotIndex = currentIndex - 1;
      if (currentIndex === 0) {
        dotIndex = slidesCount - 1;
      } else if (currentIndex === slidesCount + 1) {
        dotIndex = 0;
      }
      dotElements.forEach((dot, index) => {
        if (index === dotIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(targetIndex: number) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = targetIndex;
      updateActiveDot();
      updateSlidePosition(true);
    }

    // Handle transition end to reset position for infinite loop
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      
      if (currentIndex === 0) {
        // Jump to last original slide (slidesCount) without transition
        currentIndex = slidesCount;
        updateSlidePosition(false);
      } else if (currentIndex === slidesCount + 1) {
        // Jump to first original slide (1) without transition
        currentIndex = 1;
        updateSlidePosition(false);
      }
    });

    // Autoplay implementation
    function startAutoplay() {
      if (settings.autoplay !== 'on') return;
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, settings.speed);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // Start autoplay
    startAutoplay();

    // Pause autoplay on mouse enter and resume on leave
    inner.addEventListener('mouseenter', stopAutoplay);
    inner.addEventListener('mouseleave', startAutoplay);
  });
});
