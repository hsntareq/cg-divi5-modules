import React, { ReactElement, useEffect, useState } from 'react';
import { ChildModulesContainer, ModuleContainer } from '@divi/module';
import { CarouselEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

export const CarouselEdit = (props: CarouselEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
    childrenIds,
  } = props;

  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    console.log(`[Carousel VB Log] ${msg}`);
  };

  const slidesToShowAttr = attrs.slidesToShow?.innerContent?.desktop?.value || attrs.slidesToShow?.desktop?.value || '4';
  const slidesToShow = String(slidesToShowAttr).replace(/[^0-9]/g, '') || '4';

  const galleryIdsVal = attrs.galleryIds?.innerContent?.desktop?.value || attrs.galleryIds?.desktop?.value || '';

  // Listen to galleryIds changes to programmatically create child modules using Divi 5 native store actions
  useEffect(() => {
    const getWpDependency = (key: string) => {
      if (typeof window !== 'undefined') {
        // 1. Check local window context
        try {
          const t = window as any;
          if (t.wp?.[key]) return t.wp[key];
          if (t.vendor?.wp?.[key]) return t.vendor.wp[key];
          if (t.divi?.[key]) return t.divi[key];
          if (t.vendor?.divi?.[key]) return t.vendor.divi[key];
        } catch (e) {}

        // 2. Check parent window context
        try {
          const p = window.parent as any;
          if (p) {
            if (p.wp?.[key]) return p.wp[key];
            if (p.vendor?.wp?.[key]) return p.vendor.wp[key];
            if (p.divi?.[key]) return p.divi[key];
            if (p.vendor?.divi?.[key]) return p.vendor.divi[key];
          }
        } catch (e) {}

        // 3. Check top window context
        try {
          const top = window.top as any;
          if (top) {
            if (top.wp?.[key]) return top.wp[key];
            if (top.vendor?.wp?.[key]) return top.vendor.wp[key];
            if (top.divi?.[key]) return top.divi[key];
            if (top.vendor?.divi?.[key]) return top.vendor.divi[key];
          }
        } catch (e) {}
      }
      return null;
    };

    const debugInspect = () => {
      const info: string[] = [];
      if (typeof window !== 'undefined') {
        // window
        try {
          const t = window as any;
          info.push(`window.wp: ${typeof t.wp}`);
          info.push(`window.vendor.wp: ${typeof t.vendor?.wp}`);
          info.push(`window.divi: ${typeof t.divi}`);
          info.push(`window.vendor.divi: ${typeof t.vendor?.divi}`);
        } catch (e: any) {
          info.push(`window.err: ${e.message || 'security'}`);
        }

        // parent
        try {
          const p = window.parent as any;
          if (p) {
            info.push(`parent.wp: ${typeof p.wp}`);
            info.push(`parent.vendor.wp: ${typeof p.vendor?.wp}`);
            info.push(`parent.divi: ${typeof p.divi}`);
            info.push(`parent.vendor.divi: ${typeof p.vendor?.divi}`);
          } else {
            info.push(`parent: null`);
          }
        } catch (e: any) {
          info.push(`parent.err: ${e.message || 'security'}`);
        }

        // top
        try {
          const top = window.top as any;
          if (top) {
            info.push(`top.wp: ${typeof top.wp}`);
            info.push(`top.vendor.wp: ${typeof top.vendor?.wp}`);
            info.push(`top.divi: ${typeof top.divi}`);
            info.push(`top.vendor.divi: ${typeof top.vendor?.divi}`);
          } else {
            info.push(`top: null`);
          }
        } catch (e: any) {
          info.push(`top.err: ${e.message || 'security'}`);
        }
      }
      return info.join(' | ');
    };

    const apiFetch = getWpDependency('apiFetch');
    const dataStore = getWpDependency('data');

    if (!dataStore) {
      addLog(`wp.data/divi.data not found. Globals: ${debugInspect()}`);
      return;
    }

    if (!galleryIdsVal) {
      return;
    }

    addLog(`Detected galleryIdsVal change: "${galleryIdsVal}"`);

    const ids = galleryIdsVal
      .split(',')
      .map((item: string) => parseInt(item.trim(), 10))
      .filter(Boolean);

    if (ids.length === 0) {
      addLog('No valid image IDs found in uploader string');
      return;
    }

    addLog(`Parsed IDs to fetch: ${ids.join(', ')}`);

    // 1. Reset parent's galleryIds attribute synchronously so it clears the settings uploader modal and prevents re-triggering
    try {
      addLog('Clearing uploader attribute via editModuleAttribute...');
      
      // Dispatch both sub-path and root attribute value updates to cover any binding mismatches
      dataStore.dispatch('divi/edit-post').editModuleAttribute(
        id,
        'galleryIds.innerContent',
        {
          desktop: {
            value: ''
          }
        }
      );

      dataStore.dispatch('divi/edit-post').editModuleAttribute(
        id,
        'galleryIds',
        {
          innerContent: {
            desktop: {
              value: ''
            }
          }
        }
      );
      
      addLog('Successfully dispatched cleared uploader attributes.');
    } catch (e: any) {
      addLog(`Failed to clear uploader attribute: ${e.message}`);
    }

    if (!apiFetch) {
      addLog(`wp.apiFetch not found. Globals: ${debugInspect()}`);
      return;
    }

    // 2. Fetch media details for these IDs using WordPress apiFetch
    addLog('Fetching media details from WP REST API...');
    apiFetch({ path: `/wp/v2/media?include=${ids.join(',')}` })
      .then((mediaList: any[]) => {
        addLog(`Successfully fetched ${mediaList ? mediaList.length : 0} media items`);
        if (!mediaList || mediaList.length === 0) {
          addLog('No media items returned from server.');
          return;
        }

        // Sort the fetched media list to match the original selection order of IDs
        const sortedMediaList = ids
          .map(idVal => mediaList.find(m => m.id === idVal))
          .filter(Boolean);

        addLog(`Beginning to add child modules (count: ${sortedMediaList.length})...`);

        // 3. For each media item, add a native cg/carousel-item child module inside the parent Carousel
        sortedMediaList.forEach((media, index) => {
          const titleText = media.title?.rendered || media.title || '';
          addLog(`Adding slide #${index + 1}: ID=${media.id}, Title="${titleText}"`);
          
          try {
            dataStore.dispatch('divi/edit-post').addModule(
              id,
              'cg/carousel-item',
              {
                attrs: {
                  image: {
                    innerContent: {
                      desktop: {
                        value: {
                          src: media.source_url || '',
                          id: String(media.id),
                          alt: media.alt_text || '',
                          titleText: titleText
                        }
                      }
                    }
                  },
                  title: {
                    innerContent: {
                      desktop: {
                        value: titleText
                      }
                    }
                  }
                }
              },
              'inside'
            );
            addLog(`Successfully added slide #${index + 1}`);
          } catch (e: any) {
            addLog(`Failed to add slide #${index + 1}: ${e.message}`);
          }
        });
      })
      .catch((err: any) => {
        addLog(`Error fetching media details: ${err.message || err}`);
      });
  }, [galleryIdsVal, id]);

  const innerStyle = {
    '--slides-to-show': slidesToShow,
  } as React.CSSProperties;

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      scriptDataComponent={ModuleScriptData}
      classnamesFunction={moduleClassnames}
      className="cg_carousel_parent"
    >
      {elements.styleComponents({
        attrName: 'module',
      })}
      
      <div className="cg_carousel__inner" style={innerStyle}>
        <div className="cg_carousel__track-wrapper">
          <div className="cg_carousel__track">
            <ChildModulesContainer ids={childrenIds} />
          </div>
        </div>
      </div>

      {/* On-screen diagnostic logs for debugging Visual Builder action dispatchers */}
      <div className="cg-diagnostic-box" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#000',
        padding: '15px',
        fontSize: '12px',
        fontFamily: 'monospace',
        borderRadius: '6px',
        margin: '20px auto 10px auto',
        border: '2px solid #ff4a4a',
        maxWidth: '600px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 99999,
        position: 'relative',
        textAlign: 'left'
      }}>
        <strong style={{ color: '#d00', fontSize: '13px' }}>⚙️ Carousel Diagnostic Monitor:</strong>
        <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
          <strong>Parent ID:</strong> {id} | <strong>Slides Count:</strong> {childrenIds ? childrenIds.length : 0} | <strong>Uploader Raw:</strong> "{galleryIdsVal}"
        </div>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', lineHeight: '1.4' }}>
          {logs.length === 0 ? (
            <li style={{ color: '#777', listStyleType: 'none', marginLeft: '-20px' }}>No actions triggered yet. Select images in settings uploader to start.</li>
          ) : (
            logs.map((log, idx) => (
              <li key={idx}>{log}</li>
            ))
          )}
        </ul>
      </div>
    </ModuleContainer>
  );
};
