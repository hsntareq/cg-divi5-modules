import React, { ReactElement } from 'react';
import {
  StyleContainer,
  StylesProps,
  CssStyle,
} from '@divi/module';
import { PortfolioPBAttrs } from './types';
import { cssFields } from './custom-css';

/**
 * Portfolio PB style component for Visual Builder.
 */
export const ModuleStyles = ({
  attrs,
  elements,
  settings,
  orderClass,
  mode,
  state,
  noStyleTag,
}: StylesProps<PortfolioPBAttrs>): ReactElement => {
  return (
    <StyleContainer mode={mode} state={state} noStyleTag={noStyleTag}>
      {elements.style({
        attrName: 'module',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}

      {elements.style({
        attrName: 'titleText',
      })}

      {elements.style({
        attrName: 'tabText',
      })}

      {elements.style({
        attrName: 'radioPillText',
      })}

      {elements.style({
        attrName: 'loadMoreBtn',
      })}

      {elements.style({
        attrName: 'item',
      })}

      <CssStyle
        selector={orderClass}
        attr={attrs.css}
        cssFields={cssFields}
      />
    </StyleContainer>
  );
};
