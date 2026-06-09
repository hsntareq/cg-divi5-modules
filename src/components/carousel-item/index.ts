import {
  type Metadata,
  type ModuleLibrary,
} from '@divi/types';

import metadata from './module.json';
import { CarouselItemEdit } from './edit';
import { CarouselItemAttrs } from './types';

import './module.scss';

export const carouselItem: ModuleLibrary.Module.RegisterDefinition<CarouselItemAttrs> = {
  metadata: metadata as Metadata.Values<CarouselItemAttrs>,
  renderers: {
    edit: CarouselItemEdit,
  },
  parentsName: ['cg/carousel'],
};
