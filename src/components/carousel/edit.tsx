import React, { ReactElement, useEffect } from 'react';
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

  const slidesToShowAttr = attrs.slidesToShow?.innerContent?.desktop?.value || attrs.slidesToShow?.desktop?.value || '4';
  const slidesToShow = String(slidesToShowAttr).replace(/[^0-9]/g, '') || '4';

  const galleryIdsVal = attrs.galleryIds?.innerContent?.desktop?.value || attrs.galleryIds?.desktop?.value || '';

  // Listen to galleryIds changes to programmatically create child modules using Divi 5 native store actions
  useEffect(() => {
    const wpGlobal = (window as any).wp;
    if (!wpGlobal || !wpGlobal.apiFetch || !wpGlobal.data) {
      return;
    }

    if (!galleryIdsVal) {
      return;
    }

    const ids = galleryIdsVal
      .split(',')
      .map((item: string) => parseInt(item.trim(), 10))
      .filter(Boolean);

    if (ids.length === 0) {
      return;
    }

    console.log('Carousel Bulk Add: Found galleryIdsVal to process:', galleryIdsVal, 'Parsed IDs:', ids);

    // 1. Reset parent's galleryIds attribute synchronously so it clears the settings uploader modal and prevents re-triggering
    wpGlobal.data.dispatch('divi/edit-post').editModuleAttribute(
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

    // 2. Fetch media details for these IDs using WordPress apiFetch
    wpGlobal.apiFetch({ path: `/wp/v2/media?include=${ids.join(',')}` })
      .then((mediaList: any[]) => {
        if (!mediaList || mediaList.length === 0) {
          console.log('Carousel Bulk Add: No media details found from API');
          return;
        }

        // Sort the fetched media list to match the original selection order of IDs
        const sortedMediaList = ids
          .map(idVal => mediaList.find(m => m.id === idVal))
          .filter(Boolean);

        console.log('Carousel Bulk Add: Adding modules for media items:', sortedMediaList);

        // 3. For each media item, add a native cg/carousel-item child module inside the parent Carousel
        sortedMediaList.forEach((media) => {
          const titleText = media.title?.rendered || media.title || '';
          wpGlobal.data.dispatch('divi/edit-post').addModule(
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
        });
      })
      .catch((err: any) => {
        console.error('Carousel Bulk Add: Error fetching media details:', err);
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
    </ModuleContainer>
  );
};
