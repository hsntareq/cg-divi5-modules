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
      console.log('Carousel Sync: wp global or dependencies not available');
      return;
    }

    if (!galleryIdsVal) {
      console.log('Carousel Sync: galleryIdsVal is empty, skipping sync');
      return;
    }

    const newIds = galleryIdsVal.split(',').map((item: string) => parseInt(item.trim(), 10)).filter(Boolean);
    if (newIds.length === 0) {
      console.log('Carousel Sync: parsed newIds is empty, skipping sync');
      return;
    }

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

    console.log('Carousel Sync: Current slide image IDs:', currentImageIds);
    console.log('Carousel Sync: Target gallery image IDs:', targetIdsStrings);

    // Check if the current children already match the gallery selection exactly in order and ID
    const isSynced = currentImageIds.length === targetIdsStrings.length &&
      currentImageIds.every((val: string, index: number) => val === targetIdsStrings[index]);

    if (isSynced) {
      console.log('Carousel Sync: Already synced, skipping update');
      return;
    }

    // Determine missing IDs that we need to fetch media details for
    const existingImageIdsMap = new Map(currentChildren.map((c: any) => [c.imageId, c.block]));
    const missingIds = newIds.filter(idVal => !existingImageIdsMap.has(String(idVal)));

    console.log('Carousel Sync: Missing image IDs that need fetching:', missingIds);

    const processSync = (mediaList: any[] = []) => {
      const fetchedMediaMap = new Map(mediaList.map(m => [String(m.id), m]));

      const blocksToSet = newIds.map((idVal) => {
        const idStr = String(idVal);
        const existingBlock = existingImageIdsMap.get(idStr);

        if (existingBlock) {
          console.log(`Carousel Sync: Reusing existing block for image ID ${idStr}`);
          return wpGlobal.blocks.cloneBlock(existingBlock);
        }

        // Create a new block for the new image ID
        const media = fetchedMediaMap.get(idStr);
        const titleText = media?.title?.rendered || media?.title || '';

        console.log(`Carousel Sync: Creating new block for image ID ${idStr}`);
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

      console.log('Carousel Sync: Dispatching replaceInnerBlocks with', blocksToSet.length, 'blocks');
      wpGlobal.data.dispatch('core/block-editor').replaceInnerBlocks(id, blocksToSet);
    };

    if (missingIds.length > 0) {
      console.log('Carousel Sync: Fetching media details via apiFetch for IDs:', missingIds);
      wpGlobal.apiFetch({ path: `/wp/v2/media?include=${missingIds.join(',')}` })
        .then((mediaList: any[]) => {
          console.log('Carousel Sync: Fetched media details successfully:', mediaList);
          processSync(mediaList);
        })
        .catch((err: any) => {
          console.error('Carousel Sync: Error fetching media details:', err);
          // Sync anyway with fallback empty image properties
          processSync([]);
        });
    } else {
      console.log('Carousel Sync: No missing images. Synchronizing block order/deletion synchronously');
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
