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

export const PortfolioPBEdit = (props: PortfolioPBEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
  } = props;

  // Extract settings using the robust helper
  const postType = getAttrValue(attrs?.postType, 'post');
  const postsNumber = parseInt(getAttrValue(attrs?.postsNumber, '12'), 10);
  const gridColumns = getAttrValue(attrs?.gridColumns, '3');
  const hideEmptySubcats = getAttrValue(attrs?.hideEmptySubcats, 'off');
  const directSubcatLabel = getAttrValue(attrs?.directSubcatLabel, 'parent');
  const showLoadMore = getAttrValue(attrs?.showLoadMore, 'on');
  const loadMoreText = getAttrValue(attrs?.loadMoreText, 'Load More');
  const activeColor = getAttrValue(attrs?.activeColor, '#7e22ce');

  // React state for fetched data & filters
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCat, setActiveCat] = useState<number | null>(null); // null = "All"
  const [activeSubcat, setActiveSubcat] = useState<number | null>(null); // null = "All"
  const [currentLimit, setCurrentLimit] = useState<number>(postsNumber);

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

      <div className="cg_portfolio_pb__wrapper" style={inlineStyles}>
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
            <div className={`cg_portfolio_pb__grid cg_portfolio_pb__grid--cols-${gridColumns}`}>
              {filteredPosts.length === 0 ? (
                <div className="cg_portfolio_pb__empty">
                  No items found for the selected filters.
                </div>
              ) : (
                filteredPosts.slice(0, currentLimit).map(post => {
                  const imgUrl = getPostImageUrl(post);
                  const titleText = post.title?.rendered || 'Untitled';

                  // Read size from post meta
                  const size = post.meta?.portfolio_pb_size || 'regular';
                  const viewType = post.meta?.portfolio_pb_view_type || 'default';

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

                  const isLightbox = viewType === 'lightbox';

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
                        {/* Hover Overlay */}
                        <div className="cg_portfolio_pb__overlay">
                          <div className="cg_portfolio_pb__overlay-content">
                            <h4 className="cg_portfolio_pb__card-title">{titleText}</h4>
                            {isLightbox ? (
                              <span className="cg_portfolio_pb__card-view-btn cg_portfolio_pb__card-view-btn--icon">
                                <svg className="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', display: 'inline-block' }}>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </span>
                            ) : (
                              <span className="cg_portfolio_pb__card-view-btn">View Details</span>
                            )}
                          </div>
                        </div>
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
