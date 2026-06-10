import React, { ReactElement } from 'react';
import { ModuleContainer } from '@divi/module';
import { CarouselItemEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

export const CarouselItemEdit = (props: CarouselItemEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
    parentAttrs,
  } = props;

  const showTitleAttr = parentAttrs?.showTitle?.innerContent?.desktop?.value ?? 'on';
  const showImageAttr = parentAttrs?.showImage?.innerContent?.desktop?.value ?? 'on';

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      scriptDataComponent={ModuleScriptData}
      classnamesFunction={moduleClassnames}
      className="cg_carousel_item"
    >
      {elements.styleComponents({
        attrName: 'module',
      })}

      <div className="cg_carousel_item__inner">
        {showImageAttr === 'on' && (
          <div className="cg_carousel_item__image">
            {elements.render({
              attrName: 'image',
            })}
          </div>
        )}
        
        {showTitleAttr === 'on' && (
          <div className="cg_carousel_item__content-container">
            {elements.render({
              attrName: 'title',
            })}
          </div>
        )}
      </div>
    </ModuleContainer>
  );
};
