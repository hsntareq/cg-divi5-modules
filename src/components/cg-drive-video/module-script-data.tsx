import React, {
  Fragment,
  ReactElement,
} from 'react';

import {
  ModuleScriptDataProps,
} from '@divi/module';
import { CGDriveVideoAttrs } from './types';

export const ModuleScriptData = ({
  elements,
}: ModuleScriptDataProps<CGDriveVideoAttrs>): ReactElement => (
  <Fragment>
    {elements.scriptData({
      attrName: 'module',
    })}
  </Fragment>
);
