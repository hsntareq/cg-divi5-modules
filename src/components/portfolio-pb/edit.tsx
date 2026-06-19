import React, { ReactElement, useState, useEffect } from 'react';
import { ModuleContainer } from '@divi/module';
import { PortfolioPBEditProps } from './types';
import { ModuleStyles } from './styles';
import { moduleClassnames } from './module-classnames';
import { ModuleScriptData } from './module-script-data';

// Helper function to resolve attribute values robustly across all potential structures
const getAttrValue = (attr: any, defaultValue: string): string => {
  if (!attr) return defaultValue;
  if (typeof attr === 'string') return attr;
  if (typeof attr === 'number') return String(attr);
  if (typeof attr === 'object') {
    if (attr.innerContent?.desktop?.value !== undefined) {
      return String(attr.innerContent.desktop.value);
    }
    if (attr.desktop?.value !== undefined) {
      return String(attr.desktop.value);
    }
    if (attr.value !== undefined) {
      return String(attr.value);
    }
  }
  return defaultValue;
};

const isDirectVideo = (url: string): boolean => {
  if (!url) return false;
  if (/\.(mp4|webm|ogg|ogv)(\?|$)/i.test(url)) {
    return true;
  }
  if (url.includes('drive.google.com')) {
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

export const PortfolioPBEdit = (props: PortfolioPBEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
  } = props;

  // Extract settings using the robust helper
  const postType = getAttrValue(attrs?.postType, 'post');
  const gridColumns = getAttrValue(attrs?.gridColumns, '3');
  const columnsInt = parseInt(gridColumns, 10) || 3;

  const rowsNumberAttr = getAttrValue(attrs?.rowsNumber, '');
  const postsNumberAttr = getAttrValue(attrs?.postsNumber, '');

  let postsNumber = 12;
  if (postsNumberAttr) {
    postsNumber = parseInt(postsNumberAttr, 10) || 12;
  } else if (rowsNumberAttr) {
    postsNumber = (parseInt(rowsNumberAttr, 10) || 4) * columnsInt;
  }
  const hideEmptySubcats = getAttrValue(attrs?.hideEmptySubcats, 'off');
  const directSubcatLabel = getAttrValue(attrs?.directSubcatLabel, 'parent');
  const showLoadMore = getAttrValue(attrs?.showLoadMore, 'on');
  const loadMoreText = getAttrValue(attrs?.loadMoreText, 'Load More');
  const activeColor = getAttrValue(attrs?.activeColor, '#7e22ce');
  const openInNewTab = getAttrValue(attrs?.openInNewTab, 'off');
  const pauseOnTabSwitch = getAttrValue(attrs?.pauseOnTabSwitch, 'on');
  const fillRow = getAttrValue(attrs?.fillRow, 'off');

  // React state for fetched data & filters
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCat, setActiveCat] = useState<number | null>(null); // null = "All"
  const [activeSubcat, setActiveSubcat] = useState<number | null>(null); // null = "All"
  const [currentLimit, setCurrentLimit] = useState<number>(postsNumber);
  const [hiddenOverlays, setHiddenOverlays] = useState<Record<number, boolean>>({});

  // Fetch data on mount / attributes change
  useEffect(() => {
    setLoading(true);
    let restRoot = '';
    const winContexts = [window, window.parent, window.top];
    for (const ctx of winContexts) {
      try {
        if (ctx && (ctx as any).wpApiSettings?.root) {
          restRoot = (ctx as any).wpApiSettings.root;
          break;
        }
      } catch (e) {}
    }
    if (!restRoot) {
      restRoot = '/wp-json/';
    }

    const catTaxonomy = postType === 'project' ? 'project_category' : 'categories';
    const postEndpoint = postType === 'project' ? 'project' : 'posts';

    const tryFetch = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
      return data;
    };

    // Fetch categories with self-healing fallback paths
    const fetchCategories = async () => {
      const primaryUrl = `${restRoot}wp/v2/${catTaxonomy}?per_page=100`;
      try {
        const data = await tryFetch(primaryUrl);
        setCategories(data);
      } catch (err) {
        console.warn(`[PortfolioPB] Failed to fetch categories from ${primaryUrl}:`, err);
        if (postType === 'project') {
          const fallbacks = [
            `${restRoot}wp/v2/project-category?per_page=100`,
            `${restRoot}wp/v2/project-categories?per_page=100`,
            `${restRoot}wp/v2/project_category?per_page=100`
          ];
          for (const url of fallbacks) {
            try {
              console.log(`[PortfolioPB] Trying fallback category endpoint: ${url}`);
              const data = await tryFetch(url);
              setCategories(data);
              return;
            } catch (fallbackErr) {
              console.warn(`[PortfolioPB] Fallback failed for ${url}:`, fallbackErr);
            }
          }
        }
        setCategories([]);
      }
    };

    // Fetch posts with self-healing fallback paths
    const fetchPosts = async () => {
      const primaryUrl = `${restRoot}wp/v2/${postEndpoint}?per_page=${postsNumber}&_embed=wp:featuredmedia`;
      try {
        const data = await tryFetch(primaryUrl);
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.warn(`[PortfolioPB] Failed to fetch posts from ${primaryUrl}:`, err);
        if (postType === 'project') {
          const fallbacks = [
            `${restRoot}wp/v2/projects?per_page=${postsNumber}&_embed=wp:featuredmedia`,
            `${restRoot}wp/v2/project?per_page=${postsNumber}&_embed=wp:featuredmedia`
          ];
          for (const url of fallbacks) {
            try {
              console.log(`[PortfolioPB] Trying fallback post endpoint: ${url}`);
              const data = await tryFetch(url);
              setPosts(data);
              setLoading(false);
              return;
            } catch (fallbackErr) {
              console.warn(`[PortfolioPB] Fallback failed for ${url}:`, fallbackErr);
            }
          }
        }
        setPosts([]);
        setLoading(false);
      }
    };

    fetchCategories();
    fetchPosts();
  }, [postType, postsNumber]);

  // Whenever active category changes, reset active subcategory to "All"
  useEffect(() => {
    setActiveSubcat(null);
  }, [activeCat]);

  // Reset limit when postsNumber or filters change
  useEffect(() => {
    setCurrentLimit(postsNumber);
  }, [postsNumber, postType, activeCat, activeSubcat]);

  // Filter categories to top-level ones (parent === 0)
  const topCategories = categories.filter(cat => cat.parent === 0);

  // Helper to get all category IDs including ancestors
  const getPostCategoriesWithAncestors = (postCats: any[]): number[] => {
    if (!Array.isArray(postCats)) return [];
    const resolved = new Set<number>();
    postCats.forEach(catId => {
      const id = Number(catId);
      resolved.add(id);
      let current = categories.find(c => c.id === id);
      while (current && current.parent !== 0) {
        resolved.add(current.parent);
        current = categories.find(c => c.id === current.parent);
      }
    });
    return Array.from(resolved);
  };

  // Filter subcategories of the currently active top-level category
  const subCategories = activeCat
    ? categories.filter(cat => {
        if (cat.parent !== activeCat) return false;
        if (hideEmptySubcats === 'on') {
          // Check if at least one post has BOTH activeCat and this subcat ID
          return posts.some(post => {
            const rawCats = postType === 'project' ? post.project_category : post.categories;
            const postCats = getPostCategoriesWithAncestors(rawCats);
            return postCats.includes(activeCat) && postCats.includes(cat.id);
          });
        }
        return true;
      })
    : [];

  // Check if there are posts directly assigned to activeCat and not to its children
  const hasDirectPosts = activeCat !== null && (() => {
    const childrenIds = categories.filter(c => c.parent === activeCat).map(c => c.id);
    return posts.some(post => {
      const rawCats = postType === 'project' ? post.project_category : post.categories;
      const postCats = getPostCategoriesWithAncestors(rawCats);
      if (postCats.includes(activeCat)) {
        return !postCats.some(id => id !== activeCat && childrenIds.includes(id));
      }
      return false;
    });
  })();

  // Filter posts based on active category and subcategory selection
  const filteredPosts = posts.filter(post => {
    const rawCats = postType === 'project' ? post.project_category : post.categories;
    const postCats = getPostCategoriesWithAncestors(rawCats);
    if (postCats.length === 0) return activeCat === null;

    if (activeCat !== null) {
      // Must belong to active top category
      const belongsToParent = postCats.includes(activeCat);
      if (!belongsToParent) return false;

      // If subcategory is active, must also belong to that subcategory
      if (activeSubcat !== null) {
        if (activeSubcat === 'direct') {
          // Must not belong to any child category of activeCat
          const childrenIds = categories.filter(c => c.parent === activeCat).map(c => c.id);
          const belongsToChild = postCats.some(id => id !== activeCat && childrenIds.includes(id));
          return !belongsToChild;
        }
        return postCats.includes(activeSubcat);
      }
    }
    return true;
  });

  // Find the exact number of posts to display to fill the row gaps with actual posts
  let postsToShow = 0;
  const totalFiltered = filteredPosts.length;
  if (totalFiltered > 0) {
    let currentSpanSum = 0;
    let foundFill = false;
    for (let i = 0; i < totalFiltered; i++) {
      const post = filteredPosts[i];
      const size = post.meta?.portfolio_pb_size || 'regular';
      const span = (size === '2x1' || size === '2x2') ? 2 : 1;
      currentSpanSum += span;
      if ((i + 1) >= currentLimit) {
        if (currentSpanSum % columnsInt === 0) {
          postsToShow = i + 1;
          foundFill = true;
          break;
        }
      }
    }
    if (!foundFill) {
      postsToShow = Math.min(totalFiltered, currentLimit);
    }
  } else {
    postsToShow = currentLimit;
  }

  const slicedPosts = filteredPosts.slice(0, postsToShow);
  const firstVideoPost = null;

  // Resolve thumbnail image URL helper
  const getPostImageUrl = (post: any): string | null => {
    const embedded = post._embedded;
    if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
      const media = embedded['wp:featuredmedia'][0];
      return media.source_url || media.media_details?.sizes?.medium?.source_url || null;
    }
    return null;
  };

  const inlineStyles = {
    '--portfolio-accent-color': activeColor,
  } as React.CSSProperties;

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      classnamesFunction={moduleClassnames}
      scriptDataComponent={ModuleScriptData}
    >
      {elements.styleComponents({
        attrName: 'module',
      })}

      <div className="cg_portfolio_pb__wrapper cg_portfolio_pb_parent" style={inlineStyles} data-is-builder="true" data-pause-on-tab-switch={pauseOnTabSwitch}>
        {/* Category Tabs */}
        <div className="cg_portfolio_pb__tabs-container">
          <button
            type="button"
            className={`cg_portfolio_pb__tab ${activeCat === null ? 'active' : ''}`}
            onClick={() => setActiveCat(null)}
          >
            All
          </button>
          {topCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`cg_portfolio_pb__tab ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategories (Radio Pills) */}
        {activeCat !== null && (subCategories.length > 0 || hideEmptySubcats === 'off' || hasDirectPosts) && (
          <div className="cg_portfolio_pb__radios-container">
            <label className={`cg_portfolio_pb__radio-pill ${activeSubcat === null ? 'checked' : ''}`}>
              <input
                type="radio"
                name={`cg_portfolio_pb_subcat_${id}`}
                checked={activeSubcat === null}
                onChange={() => setActiveSubcat(null)}
              />
              <span>All</span>
            </label>
            {(hideEmptySubcats === 'off' || hasDirectPosts) && (
              <label className={`cg_portfolio_pb__radio-pill ${activeSubcat === 'direct' ? 'checked' : ''}`}>
                <input
                  type="radio"
                  name={`cg_portfolio_pb_subcat_${id}`}
                  checked={activeSubcat === 'direct'}
                  onChange={() => setActiveSubcat('direct')}
                />
                <span>
                  {directSubcatLabel === 'direct'
                    ? 'Direct'
                    : directSubcatLabel === 'other'
                    ? 'Other'
                    : categories.find(c => c.id === activeCat)?.name || 'Direct'}
                </span>
              </label>
            )}
            {subCategories.map(subcat => (
              <label
                key={subcat.id}
                className={`cg_portfolio_pb__radio-pill ${activeSubcat === subcat.id ? 'checked' : ''}`}
              >
                <input
                  type="radio"
                  name={`cg_portfolio_pb_subcat_${id}`}
                  checked={activeSubcat === subcat.id}
                  onChange={() => setActiveSubcat(subcat.id)}
                />
                <span>{subcat.name}</span>
              </label>
            ))}
          </div>
        )}

        {/* Builder Status / Loading */}
        {loading && (
          <div className="cg_portfolio_pb__loading">
            <span className="cg_portfolio_pb__spinner"></span>
            Loading portfolio items...
          </div>
        )}

        {/* Post Thumbnails Grid */}
        {!loading && (
          <>
            <div className={`cg_portfolio_pb__grid cg_portfolio_pb__grid--cols-${gridColumns} ${fillRow === 'on' ? 'cg_portfolio_pb__grid--fill-row' : ''}`}>
              {filteredPosts.length === 0 ? (
                <div className="cg_portfolio_pb__empty">
                  No items found for the selected filters.
                </div>
              ) : (
                slicedPosts.map(post => {
                  const imgUrl = getPostImageUrl(post);
                  const titleText = post.title?.rendered || 'Untitled';

                  // Read size from post meta
                  const originalSize = post.meta?.portfolio_pb_size || 'regular';
                  const size = originalSize;
                  const viewType = post.meta?.portfolio_pb_view_type || 'lightbox';
                  const isVideoCard = viewType === 'video';
                  const isFirstVideo = !!(firstVideoPost && post.id === firstVideoPost.id);

                  const isOverlayHidden = !!hiddenOverlays[post.id];
                  const cardClasses = ['cg_portfolio_pb__card'];
                  if (size === '2x1') {
                    cardClasses.push('cg_portfolio_pb__card--2x1');
                  } else if (size === '2x2') {
                    cardClasses.push('cg_portfolio_pb__card--2x2');
                  } else if (size === '1x2') {
                    cardClasses.push('cg_portfolio_pb__card--1x2');
                  } else {
                    cardClasses.push('cg_portfolio_pb__card--regular');
                  }

                  if (isVideoCard) {
                    cardClasses.push('cg_portfolio_pb__card--video-active');
                  }

                  if (isFirstVideo) {
                    cardClasses.push('cg_portfolio_pb__card--playing');
                  }

                  if (isOverlayHidden) {
                    cardClasses.push('cg_portfolio_pb__card--overlay-hidden');
                  }

                  const isLightbox = viewType === 'lightbox' || viewType === 'video';

                  // Mute and autoplay Visual Builder iframe/video if video card
                  let mutedUrl = post.meta?.portfolio_pb_video_url;
                  const isDirect = isVideoCard && mutedUrl && isDirectVideo(mutedUrl);

                  if (isVideoCard && mutedUrl && !isDirect) {
                    if (mutedUrl.includes('drive.google.com')) {
                      mutedUrl = getGoogleDrivePreviewUrl(mutedUrl);
                    }
                    const autoplayVal = '0';
                    try {
                      const u = new URL(mutedUrl);
                      u.searchParams.set('autoplay', autoplayVal);
                      u.searchParams.set('mute', '1');
                      u.searchParams.set('muted', '1');
                      if (mutedUrl.includes('youtube.com') || mutedUrl.includes('youtu.be')) {
                        u.searchParams.set('enablejsapi', '1');
                      }
                      if (mutedUrl.includes('drive.google.com')) {
                        const fileId = getGoogleDriveFileId(mutedUrl);
                        if (fileId) {
                          u.searchParams.set('loop', '1');
                          u.searchParams.set('playlist', fileId);
                        }
                      }
                      mutedUrl = u.toString();
                    } catch (e) {
                      let extra = `autoplay=${autoplayVal}&mute=1&muted=1`;
                      if (mutedUrl.includes('youtube.com') || mutedUrl.includes('youtu.be')) {
                        extra += '&enablejsapi=1';
                      }
                      if (mutedUrl.includes('drive.google.com')) {
                        const fileId = getGoogleDriveFileId(mutedUrl);
                        if (fileId) {
                          extra += `&loop=1&playlist=${fileId}`;
                        }
                      }
                      mutedUrl = mutedUrl + (mutedUrl.indexOf('?') >= 0 ? '&' : '?') + extra;
                    }
                  }

                  return (
                    <div key={post.id} className={cardClasses.join(' ')}>
                      <div className="cg_portfolio_pb__thumbnail-wrapper">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={titleText}
                            className="cg_portfolio_pb__thumbnail"
                          />
                        ) : (
                          <div className="cg_portfolio_pb__thumbnail-placeholder">
                            <span className="placeholder-icon">🖼️</span>
                          </div>
                        )}
                        {isVideoCard && (
                          isDirect ? (
                            <video
                              src={getVideoStreamUrl(mutedUrl)}
                              autoPlay={false}
                              muted={true}
                              loop={false}
                              playsInline={true}
                              style={{ border: 'none', width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0, objectFit: 'cover', zIndex: 1 }}
                            />
                          ) : (
                            <iframe
                              src={mutedUrl}
                              width="640"
                              height="480"
                              style={{ border: 'none', width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            />
                          )
                        )}
                        {/* Hover Overlay - always rendered so it sits on top of the iframe/thumbnail */}
                        <div className="cg_portfolio_pb__overlay">
                          <button
                            type="button"
                            className="cg_portfolio_pb__overlay-close"
                            aria-label="Hide overlay"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setHiddenOverlays(prev => ({ ...prev, [post.id]: true }));
                            }}
                          >
                            &times;
                          </button>
                          <div className="cg_portfolio_pb__overlay-content">
                            <h4 className="cg_portfolio_pb__card-title">{titleText}</h4>
                            {viewType === 'video' ? (
                              <span className="cg_portfolio_pb__card-view-btn cg_portfolio_pb__card-view-btn--icon">
                                <svg className="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                                  <polygon points="6 3 20 12 6 21 6 3" />
                                </svg>
                              </span>
                            ) : viewType === 'lightbox' ? (
                              <span className="cg_portfolio_pb__card-view-btn cg_portfolio_pb__card-view-btn--icon">
                                <svg className="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              </span>
                            ) : (
                              <span className="cg_portfolio_pb__card-view-btn cg_portfolio_pb__card-view-btn--icon">
                                <svg className="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Show modal trigger button */}
                        {isLightbox && (
                          <button
                            type="button"
                            className="cg_portfolio_pb__show-modal-trigger"
                            aria-label="Open gallery modal"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Toggle overlay visibility in visual builder
                              setHiddenOverlays(prev => ({ ...prev, [post.id]: false }));
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {showLoadMore === 'on' && filteredPosts.length > currentLimit && (
              <div className="cg_portfolio_pb__load-more-container">
                <button
                  type="button"
                  className="cg_portfolio_pb__load-more-btn"
                  onClick={() => setCurrentLimit(prev => prev + postsNumber)}
                >
                  {loadMoreText}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </ModuleContainer>
  );
};
