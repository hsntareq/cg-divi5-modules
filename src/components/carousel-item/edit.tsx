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
  } = props;



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
        <div className="cg_carousel_item__image">
          {elements.render({
            attrName: 'image',
          })}
        </div>
        
        <div className="cg_carousel_item__content-container">
          {elements.render({
            attrName: 'title',
          })}
        </div>
      </div>
    </ModuleContainer>
  );
};
