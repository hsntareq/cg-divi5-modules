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
      updateCarouselVideos(carousel);
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
      updateCarouselVideos(carousel);
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

    // Update carousel videos on scroll, resize, and initially
    window.addEventListener('scroll', () => updateCarouselVideos(carousel), { passive: true });
    window.addEventListener('resize', () => updateCarouselVideos(carousel), { passive: true });
    setTimeout(() => {
      updateCarouselVideos(carousel);
    }, 200);
  });
};

const isDirectVideo = (url: string): boolean => {
  if (!url) return false;
  if (/\.(mp4|webm|ogg|ogv)(\?|$)/i.test(url)) {
    return true;
  }
  return false;
};

const getGoogleDrivePreviewUrl = (url: string): string => {
  if (!url) return '';
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|uc\?id=)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const getGoogleDriveFileId = (url: string): string => {
  if (!url) return '';
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|uc\?id=)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(driveRegex);
  return match && match[1] ? match[1] : '';
};

const getVideoStreamUrl = (url: string): string => {
  if (!url) return '';
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|uc\?id=)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};

const playIframe = (iframe: HTMLIFrameElement) => {
  try {
    const src = iframe.getAttribute('src') || '';
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: '' }), '*');
    } else if (src.includes('vimeo.com')) {
      iframe.contentWindow?.postMessage(JSON.stringify({ method: 'play' }), '*');
    } else {
      const u = new URL(src, window.location.href);
      let changed = false;
      const isMuted = iframe.getAttribute('data-muted') !== 'off';
      const muteVal = isMuted ? '1' : '0';
      if (u.searchParams.get('autoplay') !== '1') {
        u.searchParams.set('autoplay', '1');
        changed = true;
      }
      if (u.searchParams.get('mute') !== muteVal) {
        u.searchParams.set('mute', muteVal);
        changed = true;
      }
      if (u.searchParams.get('muted') !== muteVal) {
        u.searchParams.set('muted', muteVal);
        changed = true;
      }
      if (changed) {
        iframe.src = u.toString();
      }
    }
  } catch (e) {
    let src = iframe.getAttribute('src') || '';
    const isMuted = iframe.getAttribute('data-muted') !== 'off';
    const muteVal = isMuted ? '1' : '0';
    if (src.indexOf('autoplay=1') < 0) {
      src = src.replace('autoplay=0', 'autoplay=1');
      if (src.indexOf('autoplay=1') < 0) {
        src += (src.indexOf('?') >= 0 ? '&' : '?') + 'autoplay=1';
      }
    }
    if (src.indexOf(`mute=${muteVal}`) < 0) {
      if (src.indexOf('mute=') >= 0) {
        src = src.replace(/mute=[01]/, `mute=${muteVal}`);
      } else {
        src += (src.indexOf('?') >= 0 ? '&' : '?') + `mute=${muteVal}`;
      }
    }
    if (src.indexOf(`muted=${muteVal}`) < 0) {
      if (src.indexOf('muted=') >= 0) {
        src = src.replace(/muted=[01]/, `muted=${muteVal}`);
      } else {
        src += (src.indexOf('?') >= 0 ? '&' : '?') + `muted=${muteVal}`;
      }
    }
    iframe.src = src;
  }
};

const pauseIframe = (iframe: HTMLIFrameElement) => {
  try {
    const src = iframe.getAttribute('src') || '';
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }), '*');
    } else if (src.includes('vimeo.com')) {
      iframe.contentWindow?.postMessage(JSON.stringify({ method: 'pause' }), '*');
    } else {
      const u = new URL(src, window.location.href);
      if (u.searchParams.get('autoplay') !== '0') {
        u.searchParams.set('autoplay', '0');
        iframe.src = u.toString();
      }
    }
  } catch (e) {
    let src = iframe.getAttribute('src') || '';
    if (src.indexOf('autoplay=1') >= 0) {
      src = src.replace('autoplay=1', 'autoplay=0');
      iframe.src = src;
    }
  }
};

const getGoogleDriveVideoDuration = (fileId: string): number => {
  const durations: Record<string, number> = {
    '1DuSYKkU3K_QrhnbkedkYpB-agocdVWIh': 51,
    '1934LX8ZRS99Rj7sMsP_UYkRhujvxFMKp': 21,
    '1S0dOPB7HNw7JSt9p5PC29XrkSssvjNSG': 33,
  };
  return (durations[fileId] || 30) * 1000;
};



const playCardVideo = (card: HTMLElement) => {
  if (!card.classList.contains('cg_portfolio_pb__card--video')) return;

  const thumbWrapper = card.querySelector('.cg_portfolio_pb__thumbnail-wrapper') as HTMLElement;
  if (!thumbWrapper) return;

  card.classList.add('cg_portfolio_pb__card--playing');

  const videoUrl = card.getAttribute('href');
  if (videoUrl && videoUrl !== '#') {
    const oldTimer = card.getAttribute('data-loop-timer-id');
    if (oldTimer) {
      clearInterval(parseInt(oldTimer, 10));
      card.removeAttribute('data-loop-timer-id');
    }
    if (isDirectVideo(videoUrl)) {
      let video = thumbWrapper.querySelector('video');
      if (!video) {
        const streamUrl = getVideoStreamUrl(videoUrl);
        video = document.createElement('video');
        video.src = streamUrl;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.zIndex = '1';

        thumbWrapper.appendChild(video);
      }
      if (video.paused) {
        video.play().catch((err) => {
          console.log('Video play failed:', err);
        });
      }
    } else {
      let iframe = thumbWrapper.querySelector('iframe');
      if (!iframe) {
        let mutedUrl = videoUrl;
        if (videoUrl.includes('drive.google.com')) {
          mutedUrl = getGoogleDrivePreviewUrl(videoUrl);
        }
        const autoplayVal = '1';
        try {
          const u = new URL(mutedUrl);
          u.searchParams.set('autoplay', autoplayVal);
          const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
          if (isYouTube) {
            u.searchParams.set('mute', '0');
            u.searchParams.set('muted', '0');
            u.searchParams.set('controls', '1');
            u.searchParams.set('enablejsapi', '1');
            u.searchParams.set('loop', '1');
            const ytIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (ytIdMatch && ytIdMatch[1]) {
              u.searchParams.set('playlist', ytIdMatch[1]);
            }
          } else {
            u.searchParams.set('mute', '1');
            u.searchParams.set('muted', '1');
            if (videoUrl.includes('vimeo.com')) {
              u.searchParams.set('loop', '1');
            }
            if (videoUrl.includes('drive.google.com')) {
              const fileId = getGoogleDriveFileId(videoUrl);
              if (fileId) {
                u.searchParams.set('loop', '1');
                u.searchParams.set('playlist', fileId);
              }
            }
          }
          mutedUrl = u.toString();
        } catch (e) {
          const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
          let extra = isYouTube ? `autoplay=${autoplayVal}&mute=0&muted=0&controls=1` : `autoplay=${autoplayVal}&mute=1&muted=1`;
          if (isYouTube) {
            extra += '&enablejsapi=1&loop=1';
            const ytIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (ytIdMatch && ytIdMatch[1]) {
              extra += `&playlist=${ytIdMatch[1]}`;
            }
          } else {
            if (videoUrl.includes('vimeo.com')) {
              extra += '&loop=1';
            }
            if (videoUrl.includes('drive.google.com')) {
              const fileId = getGoogleDriveFileId(videoUrl);
              if (fileId) {
                extra += `&loop=1&playlist=${fileId}`;
              }
            }
          }
          mutedUrl = mutedUrl + (mutedUrl.indexOf('?') >= 0 ? '&' : '?') + extra;
        }
        iframe = document.createElement('iframe');
        iframe.setAttribute('src', mutedUrl);
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen');
        iframe.setAttribute('allowfullscreen', 'true');
        if (videoUrl.includes('drive.google.com')) {
          iframe.classList.add('cg_portfolio_pb__iframe--gdrive');
        }
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.zIndex = '1';

        thumbWrapper.appendChild(iframe);

        if (videoUrl.includes('drive.google.com')) {
          const fileId = getGoogleDriveFileId(videoUrl);
          const durationMs = getGoogleDriveVideoDuration(fileId);
          const timerId = setInterval(() => {
            const activeIframe = thumbWrapper.querySelector('iframe');
            if (activeIframe) {
              const currentSrc = activeIframe.getAttribute('src') || '';
              activeIframe.setAttribute('src', '');
              setTimeout(() => {
                activeIframe.setAttribute('src', currentSrc);
              }, 50);
            }
          }, durationMs);
          card.setAttribute('data-loop-timer-id', timerId.toString());
        }
      } else {
        playIframe(iframe);
      }
    }
  }
};

const pauseCardVideo = (card: HTMLElement) => {
  if (!card.classList.contains('cg_portfolio_pb__card--video')) return;

  const thumbWrapper = card.querySelector('.cg_portfolio_pb__thumbnail-wrapper') as HTMLElement;
  if (!thumbWrapper) return;

  card.classList.remove('cg_portfolio_pb__card--playing');
  const oldTimer = card.getAttribute('data-loop-timer-id');
  if (oldTimer) {
    clearInterval(parseInt(oldTimer, 10));
    card.removeAttribute('data-loop-timer-id');
  }
  const video = thumbWrapper.querySelector('video');
  if (video) {
    video.pause();
    video.remove();
  }
  const iframe = thumbWrapper.querySelector('iframe');
  if (iframe) {
    iframe.remove();
  }
};

const updateCarouselVideos = (carousel: HTMLElement) => {
  const inner = carousel.querySelector('.cg_carousel__inner');
  if (!inner) return;
  const innerRect = inner.getBoundingClientRect();

  // Find all standard videos inside this carousel
  const videos = carousel.querySelectorAll('.cg_drive_video__element') as NodeListOf<HTMLVideoElement>;
  videos.forEach((video) => {
    const videoRect = video.getBoundingClientRect();
    // Check if the video is visible inside the carousel inner container
    const isVisible = !(videoRect.right <= innerRect.left || videoRect.left >= innerRect.right);
    if (isVisible) {
      // If it is visible inside the carousel, and also the carousel itself is in the browser viewport
      const carouselRect = carousel.getBoundingClientRect();
      const inViewport = (carouselRect.top < window.innerHeight && carouselRect.bottom > 0);
      if (inViewport) {
        const isMuted = video.hasAttribute('muted');
        video.muted = isMuted;
        video.play().catch((e) => {
          console.log('Carousel video autoplay failed, trying muted fallback:', e);
          if (!isMuted) {
            video.muted = true;
            video.play().catch((err) => console.log('Carousel muted fallback play failed:', err));
          }
        });
      } else {
        video.pause();
      }
    } else {
      video.pause();
    }
  });

  // Find all portfolio video cards inside this carousel
  const cards = carousel.querySelectorAll('.cg_portfolio_pb__card--video') as NodeListOf<HTMLElement>;
  cards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const isVisible = !(cardRect.right <= innerRect.left || cardRect.left >= innerRect.right);
    if (isVisible) {
      const carouselRect = carousel.getBoundingClientRect();
      const inViewport = (carouselRect.top < window.innerHeight && carouselRect.bottom > 0);
      if (inViewport) {
        playCardVideo(card);
      } else {
        pauseCardVideo(card);
      }
    } else {
      pauseCardVideo(card);
    }
  });
};

const initPortfolioPB = () => {
  const wrappers = document.querySelectorAll('.cg_portfolio_pb__wrapper');

  wrappers.forEach((wrapper) => {
    // Prevent the script from executing inside the Visual Builder canvas
    if (wrapper.classList.contains('cg_portfolio_pb_parent') || wrapper.closest('.cg_portfolio_pb_parent') || wrapper.getAttribute('data-is-builder') === 'true') {
      return;
    }

    const tabs = wrapper.querySelectorAll('.cg_portfolio_pb__tab');
    const radiosContainers = wrapper.querySelectorAll('.cg_portfolio_pb__radios-container');
    const grid = wrapper.querySelector('.cg_portfolio_pb__grid');
    const cards = wrapper.querySelectorAll('.cg_portfolio_pb__card');
    const loadMoreContainer = wrapper.querySelector('.cg_portfolio_pb__load-more-container') as HTMLElement;
    const loadMoreBtn = wrapper.querySelector('.cg_portfolio_pb__load-more-btn') as HTMLElement;

    if (!grid) return;

    const postsLimit = parseInt(grid.getAttribute('data-posts-limit') || '12', 10);
    let currentLimit = postsLimit;

    // Helper to control single playing video card
    const playSingleVideo = (targetCard: HTMLElement | null) => {
      if (targetCard) {
        playCardVideo(targetCard);
      } else {
        cards.forEach((cardNode) => {
          const card = cardNode as HTMLElement;
          if (card.classList.contains('cg_portfolio_pb__card--video')) {
            pauseCardVideo(card);
          }
        });
      }
    };

    const updateViewportPlayback = () => {
      // Loop over observed cards and trigger play/pause based on viewport intersection
      cards.forEach((cardNode) => {
        const card = cardNode as HTMLElement;
        if (!card.classList.contains('cg_portfolio_pb__card--video')) return;

        // Skip if inside a carousel, as carousels have their own slide-based visibility manager
        if (card.closest('.cg_carousel')) return;

        const playOffscreen = card.getAttribute('data-play-offscreen') === 'on';

        if (card.dataset.isIntersecting === 'true') {
          playCardVideo(card);
        } else {
          if (!playOffscreen) {
            pauseCardVideo(card);
          }
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        card.dataset.isIntersecting = entry.isIntersecting ? 'true' : 'false';
      });
      updateViewportPlayback();
    }, {
      root: null,
      threshold: 0.5
    });

    cards.forEach((cardNode) => {
      const card = cardNode as HTMLElement;
      if (card.classList.contains('cg_portfolio_pb__card--video')) {
        observer.observe(card);
      }
    });

    // Attach ended listener to existing video elements printed by PHP
    cards.forEach((cardNode) => {
      const card = cardNode as HTMLElement;
      if (!card.classList.contains('cg_portfolio_pb__card--video')) return;

      const video = card.querySelector('.cg_portfolio_pb__thumbnail-wrapper video') as HTMLVideoElement;
      if (video) {
        video.loop = true;
      }
    });

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
          } else {
            card.style.display = 'none';
          }
        });

        // Determine columns
        let columns = 3;
        const gridClass = grid.className || '';
        const match = gridClass.match(/cg_portfolio_pb__grid--cols-(\d)/);
        if (match && match[1]) {
          columns = parseInt(match[1], 10);
        }

        // Collect all matched cards to filter
        let matchedCards: HTMLElement[] = [];
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
            matchedCards.push(card);
          }
        });

        // Shuffle the matched cards if the active tab is 'all'
        if (activeCatId === 'all') {
          matchedCards = [...matchedCards].sort(() => Math.random() - 0.5);
        }

        // Determine how many cards to show dynamically to fill the row
        let cardsToShow = 0;
        const totalMatched = matchedCards.length;
        if (totalMatched > 0) {
          let currentSpanSum = 0;
          let foundFill = false;
          for (let i = 0; i < totalMatched; i++) {
            const card = matchedCards[i];
            const span = (card.classList.contains('cg_portfolio_pb__card--2x1') || card.classList.contains('cg_portfolio_pb__card--2x2')) ? 2 : 1;
            currentSpanSum += span;
            if ((i + 1) >= currentLimit) {
              if (currentSpanSum % columns === 0) {
                cardsToShow = i + 1;
                foundFill = true;
                break;
              }
            }
          }
          if (!foundFill) {
            cardsToShow = Math.min(totalMatched, currentLimit);
          }
        }

        // Set card display states and visual order
        cards.forEach((cardNode) => {
          const card = cardNode as HTMLElement;
          const matchedIdx = matchedCards.indexOf(card);
          if (matchedIdx >= 0 && matchedIdx < cardsToShow) {
            card.style.display = 'block';
            if (activeCatId === 'all') {
              card.style.order = matchedIdx.toString();
            } else {
              card.style.order = '';
            }
          } else {
            card.style.display = 'none';
            card.style.order = '';
          }
        });

        grid.classList.remove('cg_portfolio_pb__grid--fill-row');

        // Toggle load more button visibility
        if (loadMoreContainer) {
          if (totalMatched > cardsToShow) {
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

        // Toggle iframe/video injection and sizing for all video cards
        cards.forEach((cardNode) => {
          const card = cardNode as HTMLElement;
          if (!card.classList.contains('cg_portfolio_pb__card--video')) return;

          const isVisibleVideo = (card.style.display !== 'none');
          const thumbWrapper = card.querySelector('.cg_portfolio_pb__thumbnail-wrapper') as HTMLElement;

          if (isVisibleVideo) {
            card.classList.add('cg_portfolio_pb__card--video-active');
            card.classList.remove('cg_portfolio_pb__card--playing');

            // Remove any leftover video/iframe elements if there are any
            if (thumbWrapper) {
              const video = thumbWrapper.querySelector('video');
              if (video) video.remove();
              const iframe = thumbWrapper.querySelector('iframe');
              if (iframe) iframe.remove();
            }
          } else {
            card.classList.remove('cg_portfolio_pb__card--video-active');
            card.classList.remove('cg_portfolio_pb__card--playing');

            // Remove iframe and video if present
            if (thumbWrapper) {
              const iframe = thumbWrapper.querySelector('iframe');
              if (iframe) iframe.remove();
              const video = thumbWrapper.querySelector('video');
              if (video) video.remove();
            }
          }
        });

        grid.classList.remove('filtering');
        updateViewportPlayback();
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

    // Custom events for visibility pausing/resuming
    wrapper.addEventListener('cg-pause-playback', () => {
      // Find currently playing card in this wrapper
      const currentPlaying = wrapper.querySelector('.cg_portfolio_pb__card--playing') as HTMLElement;
      if (currentPlaying) {
        const index = Array.from(cards).indexOf(currentPlaying);
        wrapper.dataset.lastPlayingIndex = index.toString();
      } else {
        delete wrapper.dataset.lastPlayingIndex;
      }
      playSingleVideo(null);
    });

    wrapper.addEventListener('cg-resume-playback', () => {
      const lastIndexStr = wrapper.dataset.lastPlayingIndex;
      if (lastIndexStr !== undefined) {
        const lastIndex = parseInt(lastIndexStr, 10);
        const card = cards[lastIndex] as HTMLElement;
        if (card && card.style.display !== 'none' && card.dataset.isIntersecting === 'true') {
          playSingleVideo(card);
          return;
        }
      }
      updateViewportPlayback();
    });

    // Initialize filter state once on load
    filterCards('all', 'all');
  });
};

const initLightbox = () => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // Ignore all click events originating from within the Visual Builder canvas
    if (target.closest('.cg_portfolio_pb_parent')) {
      return;
    }

    // 1. Intercept close button clicks on the overlay
    const closeBtn = target.closest('.cg_portfolio_pb__overlay-close');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const parentCard = closeBtn.closest('.cg_portfolio_pb__card');
      if (parentCard) {
        parentCard.classList.add('cg_portfolio_pb__card--overlay-hidden');
      }
      return;
    }

    // 1.5. Intercept expand/show button clicks to restore the overlay
    const showTrigger = target.closest('.cg_portfolio_pb__show-modal-trigger');
    if (showTrigger) {
      e.preventDefault();
      e.stopPropagation();
      const parentCard = showTrigger.closest('.cg_portfolio_pb__card');
      if (parentCard) {
        parentCard.classList.remove('cg_portfolio_pb__card--overlay-hidden');
      }
      return;
    }

    // 2. Resolve card
    const card = target.closest('.cg_portfolio_pb__card--lightbox, .cg_portfolio_pb__card--video') as HTMLAnchorElement;
    if (!card) return;

    // 3. Modal video/lightbox should open only when the modal opener is clicked
    const modalOpener = target.closest('.cg_portfolio_pb__card-view-btn');
    if (!modalOpener) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const mediaUrl = card.getAttribute('href');
    if (!mediaUrl || mediaUrl === '#') return;

    const titleEl = card.querySelector('.cg_portfolio_pb__card-title');
    const titleText = titleEl ? titleEl.textContent || '' : '';

    let overlay = document.querySelector('.cg_portfolio_pb__lightbox-overlay') as HTMLElement;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'cg_portfolio_pb__lightbox-overlay';
      overlay.innerHTML = `
        <button class="cg_portfolio_pb__lightbox-close" aria-label="Close lightbox">&times;</button>
        <div class="cg_portfolio_pb__lightbox-content">
          <div class="cg_portfolio_pb__lightbox-media-container"></div>
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

    const mediaContainer = overlay.querySelector('.cg_portfolio_pb__lightbox-media-container') as HTMLElement;
    const lightboxCaption = overlay.querySelector('.cg_portfolio_pb__lightbox-caption') as HTMLElement;

    if (mediaContainer) {
      mediaContainer.innerHTML = ''; // Clear previous content
      mediaContainer.className = 'cg_portfolio_pb__lightbox-media-container';

      if (card.classList.contains('cg_portfolio_pb__card--video')) {
        const cardSize = card.getAttribute('data-original-size') || 'regular';
        if (cardSize === '1x2') {
          mediaContainer.classList.add('cg_portfolio_pb__lightbox-media-container--video-vertical');
        } else {
          mediaContainer.classList.add('cg_portfolio_pb__lightbox-media-container--video-landscape');
        }

        if (isDirectVideo(mediaUrl)) {
          const streamUrl = getVideoStreamUrl(mediaUrl);
          const video = document.createElement('video');
          video.src = streamUrl;
          video.controls = true;
          video.autoplay = true; // Play on modal
          mediaContainer.appendChild(video);
          video.play().catch((err) => {
            console.log('Autoplay in lightbox failed:', err);
          });
        } else {
          let popupUrl = mediaUrl;
          if (mediaUrl.includes('drive.google.com')) {
            popupUrl = getGoogleDrivePreviewUrl(mediaUrl);
          }
          try {
            const u = new URL(popupUrl);
            u.searchParams.set('autoplay', '1'); // Play on modal
            u.searchParams.delete('mute'); // Play with sound when started
            if (mediaUrl.includes('drive.google.com')) {
              const fileId = getGoogleDriveFileId(mediaUrl);
              if (fileId) {
                u.searchParams.set('loop', '1');
                u.searchParams.set('playlist', fileId);
              }
            }
            popupUrl = u.toString();
          } catch (err) {
            let extra = 'autoplay=1';
            if (mediaUrl.includes('drive.google.com')) {
              const fileId = getGoogleDriveFileId(mediaUrl);
              if (fileId) {
                extra += `&loop=1&playlist=${fileId}`;
              }
            }
            popupUrl = popupUrl + (popupUrl.indexOf('?') >= 0 ? '&' : '?') + extra;
          }

          const iframe = document.createElement('iframe');
          iframe.setAttribute('src', popupUrl);
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allow', 'autoplay; fullscreen');
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.className = 'cg_portfolio_pb__lightbox-video';

          mediaContainer.appendChild(iframe);
        }
      } else {
        mediaContainer.classList.add('cg_portfolio_pb__lightbox-media-container--image');
        const img = document.createElement('img');
        img.className = 'cg_portfolio_pb__lightbox-img';
        img.src = mediaUrl;
        img.alt = titleText || 'Lightbox image';
        mediaContainer.appendChild(img);
      }
    }

    if (lightboxCaption) lightboxCaption.textContent = titleText;

    // Pause the active playing video/iframe
    const playingCard = document.querySelector('.cg_portfolio_pb__card--playing') as HTMLElement;
    if (playingCard) {
      const iframe = playingCard.querySelector('iframe');
      if (iframe) {
        if (!iframe.getAttribute('data-saved-src')) {
          iframe.setAttribute('data-saved-src', iframe.src);
          iframe.src = 'about:blank';
        }
      }
      const video = playingCard.querySelector('video');
      if (video) {
        video.pause();
      }
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeLightbox = (overlay: HTMLElement) => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    const mediaContainer = overlay.querySelector('.cg_portfolio_pb__lightbox-media-container') as HTMLElement;
    if (mediaContainer) {
      mediaContainer.innerHTML = '';
    }

    // Resume the playing video/iframe
    const playingCard = document.querySelector('.cg_portfolio_pb__card--playing') as HTMLElement;
    if (playingCard) {
      const iframe = playingCard.querySelector('iframe');
      if (iframe) {
        const savedSrc = iframe.getAttribute('data-saved-src');
        if (savedSrc) {
          iframe.src = savedSrc;
          iframe.removeAttribute('data-saved-src');
        } else {
          playIframe(iframe);
        }
      }
      const video = playingCard.querySelector('video');
      if (video) {
        video.play().catch((err) => console.log('Autoplay failed to resume:', err));
      }
    }
  };
};

// Global tab visibility listener to pause and resume videos
document.addEventListener('visibilitychange', () => {
  const isHidden = document.hidden;
  const wrappers = document.querySelectorAll('.cg_portfolio_pb__wrapper');
  
  wrappers.forEach((wrapperNode) => {
    const wrapper = wrapperNode as HTMLElement;
    if (wrapper.classList.contains('cg_portfolio_pb_parent') || wrapper.closest('.cg_portfolio_pb_parent') || wrapper.getAttribute('data-is-builder') === 'true') {
      return;
    }
    const pauseOnTabSwitchAttr = wrapper.getAttribute('data-pause-on-tab-switch');
    const pauseOnTabSwitch = pauseOnTabSwitchAttr !== 'off'; // default is true (on)
    
    if (pauseOnTabSwitch) {
      if (isHidden) {
        wrapper.dispatchEvent(new CustomEvent('cg-pause-playback'));
      } else {
        wrapper.dispatchEvent(new CustomEvent('cg-resume-playback'));
      }
    }
  });
});

// Reset YouTube / Vimeo iframes to beginning when they finish playing
window.addEventListener('message', (e) => {
  let data;
  try {
    data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
  } catch (err) {
    return;
  }
  if (!data) return;

  // Find target iframe
  const iframes = document.querySelectorAll('.cg_portfolio_pb__thumbnail-wrapper iframe, .cg_drive_video__iframe') as NodeListOf<HTMLIFrameElement>;
  let targetIframe: HTMLIFrameElement | null = null;
  for (const iframe of iframes) {
    if (iframe.contentWindow === e.source) {
      targetIframe = iframe;
      break;
    }
  }
  if (!targetIframe) return;

  // YouTube ended: onStateChange with info === 0 (ended)
  if (data.event === 'onStateChange' && data.info === 0) {
    targetIframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
    targetIframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: '' }), '*');
  }

  // Vimeo ended: event === 'finish'
  if (data.event === 'finish') {
    targetIframe.contentWindow?.postMessage(JSON.stringify({ method: 'seekTo', value: 0 }), '*');
    targetIframe.contentWindow?.postMessage(JSON.stringify({ method: 'play' }), '*');
  }
});

const initDriveVideo = () => {
  const videos = document.querySelectorAll('.cg_drive_video__element') as NodeListOf<HTMLVideoElement>;
  videos.forEach((video) => {
    if (video.getAttribute('data-loop-initialized') === 'true') return;
    video.setAttribute('data-loop-initialized', 'true');
    
    // Explicitly set muted state based on the HTML muted attribute
    const isMuted = video.hasAttribute('muted');
    video.muted = isMuted;


    video.addEventListener('ended', function () {
      this.muted = isMuted;
      this.src = this.src;
      this.load();
      this.play().catch((e) => console.log('Google Drive video loop failed:', e));
    });
  });

  // Viewport observer for standard Drive Videos and Iframes (not inside a carousel)
  const driveVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const playOffscreen = element.getAttribute('data-play-offscreen') === 'on';
      if (element.tagName === 'VIDEO') {
        const video = element as HTMLVideoElement;
        if (entry.isIntersecting) {
          const isMuted = video.hasAttribute('muted');
          video.muted = isMuted;
          video.play().catch((e) => {
            console.log('Viewport video play failed, trying muted fallback:', e);
            if (!isMuted) {
              video.muted = true;
              video.play().catch((err) => console.log('Muted fallback play failed:', err));
            }
          });
        } else {
          if (!playOffscreen) {
            video.pause();
          }
        }
      } else if (element.tagName === 'IFRAME') {
        const iframe = element as HTMLIFrameElement;
        if (entry.isIntersecting) {
          playIframe(iframe);
        } else {
          if (!playOffscreen) {
            pauseIframe(iframe);
          }
        }
      }
    });
  }, {
    root: null,
    threshold: 0.5
  });

  document.querySelectorAll('.cg_drive_video__element, .cg_drive_video__iframe').forEach((el) => {
    // Skip elements inside a carousel, as they are managed by updateCarouselVideos
    if (el.closest('.cg_carousel')) return;
    driveVideoObserver.observe(el);
  });
};

const initSingleVideoPlayback = () => {
  // Empty: Multiple videos are allowed to play simultaneously when in viewport
};

const initAll = () => {
  initCarousel();
  initPortfolioPB();
  initLightbox();
  initDriveVideo();
  initSingleVideoPlayback();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
