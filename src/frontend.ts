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

const initPortfolioPB = () => {
  const wrappers = document.querySelectorAll('.cg_portfolio_pb__wrapper');

  wrappers.forEach((wrapper) => {
    const tabs = wrapper.querySelectorAll('.cg_portfolio_pb__tab');
    const radiosContainers = wrapper.querySelectorAll('.cg_portfolio_pb__radios-container');
    const grid = wrapper.querySelector('.cg_portfolio_pb__grid');
    const cards = wrapper.querySelectorAll('.cg_portfolio_pb__card');
    const loadMoreContainer = wrapper.querySelector('.cg_portfolio_pb__load-more-container') as HTMLElement;
    const loadMoreBtn = wrapper.querySelector('.cg_portfolio_pb__load-more-btn') as HTMLElement;

    if (!grid) return;

    const postsLimit = parseInt(grid.getAttribute('data-posts-limit') || '12', 10);
    let currentLimit = postsLimit;

    // Helper function to update active/visible cards
    const filterCards = (activeCatId: string, activeSubcatId: string | null) => {
      grid.classList.add('filtering');

      setTimeout(() => {
        let matchedCount = 0;

        cards.forEach((cardNode) => {
          const card = cardNode as HTMLElement;
          const categoriesAttr = card.getAttribute('data-categories') || '';
          const postCats = categoriesAttr.split(',').filter(Boolean);

          let matchesCat = activeCatId === 'all';
          let matchesSubcat = !activeSubcatId || activeSubcatId === 'all';

          if (activeCatId !== 'all') {
            matchesCat = postCats.includes(activeCatId);
            if (matchesCat && activeSubcatId && activeSubcatId !== 'all') {
              if (activeSubcatId === 'direct') {
                const container = wrapper.querySelector(`.cg_portfolio_pb__radios-container[data-parent-cat-id="${activeCatId}"]`);
                if (container) {
                  const childIds = Array.from(container.querySelectorAll('input[type="radio"]'))
                    .map(input => (input as HTMLInputElement).value)
                    .filter(val => val !== 'all' && val !== 'direct');
                  matchesSubcat = !childIds.some(childId => postCats.includes(childId));
                } else {
                  matchesSubcat = true;
                }
              } else {
                matchesSubcat = postCats.includes(activeSubcatId);
              }
            }
          }

          if (matchesCat && matchesSubcat) {
            matchedCount++;
            if (matchedCount <= currentLimit) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          } else {
            card.style.display = 'none';
          }
        });

        // Toggle load more button visibility
        if (loadMoreContainer) {
          if (matchedCount > currentLimit) {
            loadMoreContainer.style.display = 'flex';
          } else {
            loadMoreContainer.style.display = 'none';
          }
        }

        // Toggle empty grid state
        let emptyMsg = grid.querySelector('.cg_portfolio_pb__empty') as HTMLElement;
        if (matchedCount === 0) {
          if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'cg_portfolio_pb__empty';
            emptyMsg.textContent = 'No items found for the selected filters.';
            grid.appendChild(emptyMsg);
          } else {
            emptyMsg.style.display = 'block';
          }
        } else if (emptyMsg) {
          emptyMsg.style.display = 'none';
        }

        grid.classList.remove('filtering');
      }, 150);
    };

    // Click tabs logic
    tabs.forEach((tabNode) => {
      const tab = tabNode as HTMLElement;
      tab.addEventListener('click', () => {
        // Update active tab style
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const catId = tab.getAttribute('data-cat-id') || 'all';

        // Toggle subcategory radios visibility
        radiosContainers.forEach((containerNode) => {
          const container = containerNode as HTMLElement;
          const parentId = container.getAttribute('data-parent-cat-id');

          if (parentId === catId) {
            container.style.display = 'flex';
            // Reset checked pill to "All"
            const radioPills = container.querySelectorAll('.cg_portfolio_pb__radio-pill');
            radioPills.forEach((pill, idx) => {
              const radioInput = pill.querySelector('input[type="radio"]') as HTMLInputElement;
              if (idx === 0) {
                pill.classList.add('checked');
                if (radioInput) radioInput.checked = true;
              } else {
                pill.classList.remove('checked');
                if (radioInput) radioInput.checked = false;
              }
            });
          } else {
            container.style.display = 'none';
          }
        });

        // Reset limit and filter cards
        currentLimit = postsLimit;
        filterCards(catId, 'all');
      });
    });

    // Subcategory radio toggle logic
    radiosContainers.forEach((containerNode) => {
      const container = containerNode as HTMLElement;
      const radioPills = container.querySelectorAll('.cg_portfolio_pb__radio-pill');

      radioPills.forEach((pillNode) => {
        const pill = pillNode as HTMLElement;
        const radio = pill.querySelector('input[type="radio"]') as HTMLInputElement;

        if (radio) {
          radio.addEventListener('change', () => {
            // Update active styling of pills in this container
            radioPills.forEach((p) => p.classList.remove('checked'));
            if (radio.checked) {
              pill.classList.add('checked');
            }

            const subcatId = radio.value;
            // Find current active category
            const activeTab = wrapper.querySelector('.cg_portfolio_pb__tab.active') as HTMLElement;
            const activeCatId = activeTab ? (activeTab.getAttribute('data-cat-id') || 'all') : 'all';

            // Reset limit and filter
            currentLimit = postsLimit;
            filterCards(activeCatId, subcatId);
          });
        }
      });
    });

    // Load more button logic
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        currentLimit += postsLimit;
        
        // Find current active category and subcategory
        const activeTab = wrapper.querySelector('.cg_portfolio_pb__tab.active') as HTMLElement;
        const activeCatId = activeTab ? (activeTab.getAttribute('data-cat-id') || 'all') : 'all';

        let activeSubcatId: string | null = null;
        if (activeCatId !== 'all') {
          const container = wrapper.querySelector(`.cg_portfolio_pb__radios-container[data-parent-cat-id="${activeCatId}"]`);
          if (container) {
            const checkedInput = container.querySelector('input[type="radio"]:checked') as HTMLInputElement;
            if (checkedInput) {
              activeSubcatId = checkedInput.value;
            }
          }
        }

        filterCards(activeCatId, activeSubcatId);
      });
    }
  });
};

const initLightbox = () => {
  document.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.cg_portfolio_pb__card--lightbox') as HTMLAnchorElement;
    if (!card) return;

    e.preventDefault();
    const imgUrl = card.getAttribute('href');
    if (!imgUrl || imgUrl === '#') return;

    const titleEl = card.querySelector('.cg_portfolio_pb__card-title');
    const titleText = titleEl ? titleEl.textContent || '' : '';

    let overlay = document.querySelector('.cg_portfolio_pb__lightbox-overlay') as HTMLElement;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'cg_portfolio_pb__lightbox-overlay';
      overlay.innerHTML = `
        <button class="cg_portfolio_pb__lightbox-close" aria-label="Close lightbox">&times;</button>
        <div class="cg_portfolio_pb__lightbox-content">
          <img class="cg_portfolio_pb__lightbox-img" src="" alt="Lightbox image" />
          <div class="cg_portfolio_pb__lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener('click', (evt) => {
        if (
          evt.target === overlay ||
          (evt.target as HTMLElement).classList.contains('cg_portfolio_pb__lightbox-close')
        ) {
          closeLightbox(overlay);
        }
      });

      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' && overlay.classList.contains('active')) {
          closeLightbox(overlay);
        }
      });
    }

    const lightboxImg = overlay.querySelector('.cg_portfolio_pb__lightbox-img') as HTMLImageElement;
    const lightboxCaption = overlay.querySelector('.cg_portfolio_pb__lightbox-caption') as HTMLElement;

    if (lightboxImg) lightboxImg.src = imgUrl;
    if (lightboxCaption) lightboxCaption.textContent = titleText;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeLightbox = (overlay: HTMLElement) => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
};

const initAll = () => {
  initCarousel();
  initPortfolioPB();
  initLightbox();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
