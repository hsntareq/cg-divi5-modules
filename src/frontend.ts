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
      dots: 'on',
      slidesToShow: 4
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

    const originalSlides = Array.from(track.children) as HTMLElement[];
    const originalCount = originalSlides.length;
    const slidesToShow = Number(settings.slidesToShow) || 4;

    // If the number of slides is less than or equal to slidesToShow, we do not need to slide or clone
    if (originalCount <= slidesToShow) {
      track.style.transition = 'none';
      track.style.transform = 'none';
      
      // Hide arrows and dots since they aren't needed
      return;
    }

    // Track active index (initially equal to slidesToShow because of prepended clones)
    let currentIndex = slidesToShow;
    let isTransitioning = false;
    let autoplayTimer: any = null;

    // Apply initial transition speed to track
    track.style.transition = `transform ${settings.transitionSpeed}ms ease-in-out`;

    // Clone first slidesToShow slides and append them to the end
    const appendedClones: HTMLElement[] = [];
    for (let i = 0; i < slidesToShow; i++) {
      const clone = originalSlides[i].cloneNode(true) as HTMLElement;
      clone.classList.add('cg_carousel__slide--clone');
      appendedClones.push(clone);
    }

    // Clone last slidesToShow slides and prepend them to the beginning
    const prependedClones: HTMLElement[] = [];
    for (let i = originalCount - slidesToShow; i < originalCount; i++) {
      const clone = originalSlides[i].cloneNode(true) as HTMLElement;
      clone.classList.add('cg_carousel__slide--clone');
      prependedClones.push(clone);
    }

    // Append the clones to the end
    appendedClones.forEach(clone => track.appendChild(clone));

    // Prepend the clones to the beginning before the original first child
    const firstOriginal = originalSlides[0];
    prependedClones.forEach(clone => {
      track.insertBefore(clone, firstOriginal);
    });

    // Update initial position translating past prepended clones
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

      for (let i = 0; i < originalCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'cg_carousel__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          if (isTransitioning) return;
          stopAutoplay();
          goToSlide(slidesToShow + i);
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
      const translatePercent = currentIndex * (100 / slidesToShow);
      track.style.transform = `translateX(-${translatePercent}%)`;
    }

    function updateActiveDot() {
      if (!dotsContainer) return;
      
      // Calculate dot index based on current slide index offset by slidesToShow
      let dotIndex = (currentIndex - slidesToShow) % originalCount;
      if (dotIndex < 0) {
        dotIndex += originalCount;
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
        // Jump to last original slide (originalCount) without transition
        currentIndex = originalCount;
        updateSlidePosition(false);
      } else if (currentIndex === originalCount + slidesToShow) {
        // Jump to first original slide (slidesToShow) without transition
        currentIndex = slidesToShow;
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
