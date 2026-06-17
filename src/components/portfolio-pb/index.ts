// Divi dependencies.
import {
  type Metadata,
  type ModuleLibrary,
} from '@divi/types';

// Local dependencies.
import metadata from './module.json';
import defaultRenderAttributes from './module-default-render-attributes.json';
import defaultPrintedStyleAttributes from './module-default-printed-style-attributes.json';
import { PortfolioPBEdit } from './edit';
import { PortfolioPBAttrs } from './types';

// Styles.
import './style.scss';
import './module.scss';

export const portfolioPB: ModuleLibrary.Module.RegisterDefinition<PortfolioPBAttrs> = {
  metadata:                 metadata as Metadata.Values<PortfolioPBAttrs>,
  defaultAttrs:             defaultRenderAttributes as Metadata.DefaultAttributes<PortfolioPBAttrs>,
  defaultPrintedStyleAttrs: defaultPrintedStyleAttributes as Metadata.DefaultAttributes<PortfolioPBAttrs>,
  renderers: {
    edit: PortfolioPBEdit,
  },
};
