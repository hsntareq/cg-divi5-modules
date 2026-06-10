import React, { ReactElement } from 'react';
import { ChildModulesContainer, ModuleContainer } from '@divi/module';
import { useSelect } from '@wordpress/data';
import { CarouselEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

interface CarouselAttachmentImageProps {
  id: number;
  showTitle: boolean;
  showImage: boolean;
}

const CarouselAttachmentImage = ({ id, showTitle, showImage }: CarouselAttachmentImageProps) => {
  const media = useSelect((select: any) => {
    return select('core').getMedia(id);
  }, [id]);

  if (!media) {
    return (
      <div className="cg_carousel_item loading-slide">
        <div className="cg_carousel_item__inner">
          <div className="cg_carousel_item__image" style={{ background: '#f5f5f5', borderRadius: '4px', minHeight: '100px' }}>
          </div>
        </div>
      </div>
    );
  }

  const src = media.source_url || '';
  const alt = media.alt_text || '';
  const title = typeof media.title === 'object' ? media.title?.rendered : media.title || '';

  return (
    <div className="cg_carousel_item">
      <div className="cg_carousel_item__inner">
        {showImage && src && (
          <div className="cg_carousel_item__image">
            <img src={src} alt={alt} />
          </div>
        )}
        
        {showTitle && title && (
          <div className="cg_carousel_item__content-container">
            <h3 className="cg_carousel_item__title">{title}</h3>
          </div>
        )}
      </div>
    </div>
  );
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

  const showTitleAttr = attrs.showTitle?.innerContent?.desktop?.value ?? 'on';
  const showImageAttr = attrs.showImage?.innerContent?.desktop?.value ?? 'on';
  const showTitle = showTitleAttr === 'on';
  const showImage = showImageAttr === 'on';

  const galleryIdsVal = attrs.galleryIds?.innerContent?.desktop?.value || attrs.galleryIds?.desktop?.value || '';
  const ids = galleryIdsVal ? galleryIdsVal.split(',').map((item: string) => parseInt(item.trim(), 10)).filter(Boolean) : [];

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
            {ids.map((idVal: number) => (
              <CarouselAttachmentImage 
                key={idVal} 
                id={idVal} 
                showTitle={showTitle} 
                showImage={showImage} 
              />
            ))}
            <ChildModulesContainer ids={childrenIds} />
          </div>
        </div>
      </div>
    </ModuleContainer>
  );
};
