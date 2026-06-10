import React, { ReactElement, useEffect } from 'react';
import { ChildModulesContainer, ModuleContainer } from '@divi/module';
import { CarouselEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

const fetchMediaDetails = async (id: number) => {
  let root = '/wp-json/';
  if (typeof window !== 'undefined' && (window as any).wpApiSettings?.root) {
    root = (window as any).wpApiSettings.root;
  }
  
  let fetchUrl = '';
  if (root.includes('?')) {
    fetchUrl = `${root}wp/v2/media/${id}`;
  } else {
    const separator = root.endsWith('/') ? '' : '/';
    fetchUrl = `${root}${separator}wp/v2/media/${id}`;
  }

  const res = await fetch(fetchUrl);
  if (!res.ok) throw new Error('Failed to fetch media');
  const data = await res.json();
  return {
    src: data.source_url || '',
    alt: data.alt_text || '',
    title: typeof data.title === 'object' ? data.title?.rendered : data.title || '',
  };
};

export const CarouselEdit = (props: CarouselEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
    childrenIds,
  } = props;

  const slidesToShowAttr = attrs.slidesToShow?.innerContent?.desktop?.value || attrs.slidesToShow?.desktop?.value || '4';
  const slidesToShow = String(slidesToShowAttr).replace(/[^0-9]/g, '') || '4';

  const innerStyle = {
    '--slides-to-show': slidesToShow,
  } as React.CSSProperties;

  useEffect(() => {
    const galleryIdsVal = attrs.galleryIds?.innerContent?.desktop?.value || attrs.galleryIds?.desktop?.value || '';
    if (!galleryIdsVal) return;

    const idsToProcess = galleryIdsVal.split(',').map((item: string) => parseInt(item.trim(), 10)).filter(Boolean);
    if (idsToProcess.length === 0) return;

    // Immediately clear parent galleryIds to avoid infinite loop
    const clearedAttr = {
      galleryIds: {
        innerContent: {
          desktop: {
            value: ''
          }
        }
      }
    };

    if (typeof window !== 'undefined' && (window as any).wp?.data && (window as any).wp?.blocks) {
      const wpData = (window as any).wp.data;
      const wpBlocks = (window as any).wp.blocks;

      wpData.dispatch('core/block-editor').updateBlockAttributes(id, clearedAttr);

      Promise.all(idsToProcess.map(idVal => fetchMediaDetails(idVal).catch(() => null)))
        .then(results => {
          const blocksToInsert = results
            .map((mediaInfo: any, idx) => {
              if (!mediaInfo) return null;
              const attachmentId = idsToProcess[idx];
              return wpBlocks.createBlock('cg/carousel-item', {
                image: {
                  innerContent: {
                    desktop: {
                      value: {
                        src: mediaInfo.src,
                        id: attachmentId,
                        alt: mediaInfo.alt,
                        titleText: mediaInfo.title
                      }
                    }
                  }
                },
                title: {
                  innerContent: {
                    desktop: {
                      value: mediaInfo.title
                    }
                  }
                }
              });
            })
            .filter(Boolean);

          if (blocksToInsert.length > 0) {
            wpData.dispatch('core/block-editor').insertBlocks(blocksToInsert, undefined, id);
          }
        })
        .catch(err => {
          console.error('Error importing gallery images as carousel items:', err);
        });
    }
  }, [attrs.galleryIds, id]);

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
    </ModuleContainer>
  );
};
