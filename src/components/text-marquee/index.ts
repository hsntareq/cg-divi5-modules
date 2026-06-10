import {
  type Metadata,
  type ModuleLibrary,
} from '@divi/types';

import metadata from './module.json';
import defaultRenderAttributes from './module-default-render-attributes.json';
import defaultPrintedStyleAttributes from './module-default-printed-style-attributes.json';
import { TextMarqueeEdit } from './edit';
import { TextMarqueeAttrs } from './types';
import { placeholderContent } from './placeholder-content';

import './module.scss';

export const textMarquee: ModuleLibrary.Module.RegisterDefinition<TextMarqueeAttrs> = {
  metadata:                 metadata as Metadata.Values<TextMarqueeAttrs>,
  defaultAttrs:             defaultRenderAttributes as Metadata.DefaultAttributes<TextMarqueeAttrs>,
  defaultPrintedStyleAttrs: defaultPrintedStyleAttributes as Metadata.DefaultAttributes<TextMarqueeAttrs>,
  placeholderContent,
  renderers: {
    edit: TextMarqueeEdit,
  },
};
export { TextMarqueeEdit };
export type { TextMarqueeAttrs };
export default textMarquee;
