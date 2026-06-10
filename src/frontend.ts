const initCarousel = () => {
  const carousels = document.querySelectorAll('.cg_carousel');

  carousels.forEach((carousel) => {
    // Avoid double-initialization
    if (carousel.classList.contains('cg_carousel--initialized')) return;
    
    // Prevent the slider script from executing inside the Visual Builder canvas
    if (carousel.classList.contains('cg_carousel_parent') || carousel.closest('.cg_carousel_parent')) {
      return;
    }
    
    carousel.classList.add('cg_carousel--initialized');

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
      slidesToShow: 4,
      marquee: 'off'
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
      return;
    }

    // ----------------------------------------------------
    // MODE A: MARQUEE MODE (Continuous scrolling)
    // ----------------------------------------------------
    if (settings.marquee === 'on') {
      // Clone all original slides once to cover scrolling overflow seamlessly
      originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true) as HTMLElement;
        clone.classList.add('cg_carousel__slide--clone');
        track.appendChild(clone);
      });

      // Generate a unique CSS Keyframe animation name
      const animName = `cg_marquee_${Math.random().toString(36).substr(2, 9)}`;
      const translatePercent = originalCount * (100 / slidesToShow);

      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
        @keyframes ${animName} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${translatePercent}%); }
        }
      `;
      carousel.appendChild(styleTag);

      // Apply keyframe animation
      track.style.transition = 'none';
      track.style.animation = `${animName} ${settings.speed}ms linear infinite`;

      // Pause marquee on hover and resume on leave
      inner.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });
      inner.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
      return;
    }

    // ----------------------------------------------------
    // MODE B: STANDARD INFINITE LOOP SLIDER
    // ----------------------------------------------------
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

    // Append clones
    appendedClones.forEach(clone => track.appendChild(clone));

    // Prepend clones
    const firstOriginal = originalSlides[0];
    prependedClones.forEach(clone => {
      track.insertBefore(clone, firstOriginal);
    });

    // Translate past prepended clones
    updateSlidePosition(false);

    // Navigation: Arrows
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

    // Navigation: Dots
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

    // Wrap resets at transition ends for infinite loops
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      
      if (currentIndex === 0) {
        currentIndex = originalCount;
        updateSlidePosition(false);
      } else if (currentIndex === originalCount + slidesToShow) {
        currentIndex = slidesToShow;
        updateSlidePosition(false);
      }
    });

    // Autoplay timer
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

    startAutoplay();

    // Mouse pause actions
    inner.addEventListener('mouseenter', stopAutoplay);
    inner.addEventListener('mouseleave', startAutoplay);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}
