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

  // Listen to galleryIds changes to programmatically create cg/carousel-item child blocks
  useEffect(() => {
    const wpGlobal = (window as any).wp;
    if (!wpGlobal || !wpGlobal.apiFetch || !wpGlobal.blocks || !wpGlobal.data) {
      return;
    }

    if (!galleryIdsVal) {
      return;
    }

    const ids = galleryIdsVal.split(',').map((item: string) => parseInt(item.trim(), 10)).filter(Boolean);
    if (ids.length === 0) {
      return;
    }

    // Reset the parent's galleryIds attribute synchronously so it updates settings modal and doesn't trigger again
    wpGlobal.data.dispatch('core/block-editor').updateBlockAttributes(id, {
      galleryIds: {
        innerContent: {
          desktop: {
            value: ''
          }
        }
      }
    });

    // Fetch media details from WP REST API
    wpGlobal.apiFetch({ path: `/wp/v2/media?include=${ids.join(',')}` })
      .then((mediaList: any[]) => {
        if (!mediaList || mediaList.length === 0) {
          return;
        }

        // Sort media items to match the user's selected gallery order
        const sortedMediaList = ids.map(idVal => mediaList.find(m => m.id === idVal)).filter(Boolean);

        const blocks = sortedMediaList.map((media) => {
          const titleText = media.title?.rendered || media.title || '';
          return wpGlobal.blocks.createBlock('cg/carousel-item', {
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
          });
        });

        // Append child blocks to the parent carousel block
        wpGlobal.data.dispatch('core/block-editor').insertBlocks(blocks, undefined, id);
      })
      .catch((err: any) => {
        console.error('Error auto-creating carousel items from gallery:', err);
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
