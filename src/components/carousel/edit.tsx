import React, { ReactElement, useEffect } from 'react';
import { ChildModulesContainer, ModuleContainer } from '@divi/module';
import { useSelect } from '@wordpress/data';
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

  const galleryIdsVal = attrs.galleryIds?.innerContent?.desktop?.value || attrs.galleryIds?.desktop?.value || '';

  // Select the current child blocks from the editor store
  const innerBlocks = useSelect((select: any) => {
    const blockEditor = select('core/block-editor');
    return blockEditor ? blockEditor.getBlocks(id) : [];
  }, [id]);

  // Synchronize galleryIds changes with child cg/carousel-item blocks
  useEffect(() => {
    const wpGlobal = (window as any).wp;
    if (!wpGlobal || !wpGlobal.blocks || !wpGlobal.data) {
      return;
    }

    const newIds = galleryIdsVal
      ? galleryIdsVal.split(',').map((item: string) => parseInt(item.trim(), 10)).filter(Boolean)
      : [];

    // Map current child blocks to their image IDs
    const currentChildren = (innerBlocks || []).map((block: any) => {
      const imgVal = block.attributes?.image?.innerContent?.desktop?.value || block.attributes?.image?.desktop?.value;
      const imageId = imgVal?.id ? String(imgVal.id) : null;
      return {
        clientId: block.clientId,
        imageId: imageId,
        block: block,
      };
    });

    const currentImageIds = currentChildren.map((c: any) => c.imageId).filter(Boolean);
    const targetIdsStrings = newIds.map(String);

    // Check if the current children already match the gallery selection exactly in order and ID
    const isSynced = currentImageIds.length === targetIdsStrings.length &&
      currentImageIds.every((val: string, index: number) => val === targetIdsStrings[index]);

    if (isSynced) {
      return;
    }

    // Determine missing IDs that we need to fetch media details for
    const existingImageIdsMap = new Map(currentChildren.map((c: any) => [c.imageId, c.block]));
    const missingIds = newIds.filter(idVal => !existingImageIdsMap.has(String(idVal)));

    const processSync = (mediaList: any[] = []) => {
      const fetchedMediaMap = new Map(mediaList.map(m => [String(m.id), m]));

      const blocksToSet = newIds.map((idVal) => {
        const idStr = String(idVal);
        const existingBlock = existingImageIdsMap.get(idStr);

        if (existingBlock) {
          // Clone existing block to preserve any custom title/styling modifications
          return wpGlobal.blocks.cloneBlock(existingBlock);
        }

        // Create a new block for the new image ID
        const media = fetchedMediaMap.get(idStr);
        const titleText = media?.title?.rendered || media?.title || '';

        return wpGlobal.blocks.createBlock('cg/carousel-item', {
          image: {
            innerContent: {
              desktop: {
                value: {
                  src: media?.source_url || '',
                  id: idStr,
                  alt: media?.alt_text || '',
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

      // Replace the inner blocks of the Carousel block
      wpGlobal.data.dispatch('core/block-editor').replaceInnerBlocks(id, blocksToSet);
    };

    if (missingIds.length > 0) {
      // Fetch details only for newly added images
      Promise.all(missingIds.map(idVal => fetchMediaDetails(idVal).catch(() => null)))
        .then(results => {
          const mediaList = results.map((res, idx) => {
            if (!res) return null;
            return {
              id: missingIds[idx],
              source_url: res.src,
              alt_text: res.alt,
              title: res.title
            };
          }).filter(Boolean);

          processSync(mediaList);
        })
        .catch((err: any) => {
          console.error('Error fetching media for carousel sync:', err);
        });
    } else {
      // If no new images are added (only removed or reordered), sync immediately
      processSync();
    }
  }, [galleryIdsVal, innerBlocks, id]);

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
