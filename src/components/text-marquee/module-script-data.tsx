import React, {
  Fragment,
  ReactElement,
} from 'react';

import {
  ModuleScriptDataProps,
} from '@divi/module';
import { TextMarqueeAttrs } from './types';

export const ModuleScriptData = ({
  elements,
}: ModuleScriptDataProps<TextMarqueeAttrs>): ReactElement => (
  <Fragment>
    {elements.scriptData({
      attrName: 'module',
    })}
  </Fragment>
);
