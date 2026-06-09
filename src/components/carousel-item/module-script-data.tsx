import React, {
  Fragment,
  ReactElement,
} from 'react';

import {
  ModuleScriptDataProps,
} from '@divi/module';
import { CarouselItemAttrs } from './types';

export const ModuleScriptData = ({
  elements,
}: ModuleScriptDataProps<CarouselItemAttrs>): ReactElement => (
  <Fragment>
    {elements.scriptData({
      attrName: 'module',
    })}
  </Fragment>
);
