import React, {
  Fragment,
  ReactElement,
} from 'react';
import {
  ModuleScriptDataProps,
} from '@divi/module';
import { PortfolioPBAttrs } from './types';

/**
 * Portfolio PB module's script data component.
 */
export const ModuleScriptData = ({
  elements,
}: ModuleScriptDataProps<PortfolioPBAttrs>): ReactElement => (
  <Fragment>
    {elements.scriptData({
      attrName: 'module',
    })}
  </Fragment>
);
