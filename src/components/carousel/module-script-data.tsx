import React, {
  Fragment,
  ReactElement,
} from 'react';

import {
  ModuleScriptDataProps,
} from '@divi/module';
import { CarouselAttrs } from './types';

export const ModuleScriptData = ({
  elements,
}: ModuleScriptDataProps<CarouselAttrs>): ReactElement => (
  <Fragment>
    {elements.scriptData({
      attrName: 'module',
    })}
  </Fragment>
);
