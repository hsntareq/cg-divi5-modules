import {
  type Metadata,
  type ModuleLibrary,
} from '@divi/types';

import metadata from './module.json';
import { CarouselEdit } from './edit';
import { CarouselAttrs } from './types';

import './module.scss';

export const carousel: ModuleLibrary.Module.RegisterDefinition<CarouselAttrs> = {
  metadata: metadata as Metadata.Values<CarouselAttrs>,
  childrenName: ['cg/carousel-item'],
  template: [
    ['cg/carousel-item', {}],
    ['cg/carousel-item', {}],
    ['cg/carousel-item', {}],
  ],
  renderers: {
    edit: CarouselEdit,
  },
};
