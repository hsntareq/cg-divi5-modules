import {
  type Metadata,
  type ModuleLibrary,
} from '@divi/types';

import metadata from './module.json';
import defaultRenderAttributes from './module-default-render-attributes.json';
import defaultPrintedStyleAttributes from './module-default-printed-style-attributes.json';
import { CGDriveVideoEdit } from './edit';
import { CGDriveVideoAttrs } from './types';

import './module.scss';

export const cgDriveVideo: ModuleLibrary.Module.RegisterDefinition<CGDriveVideoAttrs> = {
  metadata:                 metadata as Metadata.Values<CGDriveVideoAttrs>,
  defaultAttrs:             defaultRenderAttributes as Metadata.DefaultAttributes<CGDriveVideoAttrs>,
  defaultPrintedStyleAttrs: defaultPrintedStyleAttributes as Metadata.DefaultAttributes<CGDriveVideoAttrs>,
  renderers: {
    edit: CGDriveVideoEdit,
  },
};
export { CGDriveVideoEdit };
export type { CGDriveVideoAttrs };
export default cgDriveVideo;
