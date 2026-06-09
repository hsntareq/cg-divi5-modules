import { omit } from 'lodash';

import { addAction } from '@wordpress/hooks';

import { registerModule } from '@divi/module-library';

import { staticModule } from './components/static-module';
import { carousel } from './components/carousel';
import { carouselItem } from './components/carousel-item';

import './module-icons';

// Register modules.
const registerModules = () => {
  registerModule(staticModule.metadata, omit(staticModule, 'metadata'));
  registerModule(carousel.metadata, omit(carousel, 'metadata'));
  registerModule(carouselItem.metadata, omit(carouselItem, 'metadata'));
};

addAction('divi.moduleLibrary.registerModuleLibraryStore.after', 'cgDivi5Modules', registerModules);

// Fallback in case the hook has already fired when this bundle loads
if (typeof window !== 'undefined' && window.divi?.moduleLibrary?.registerModule) {
  registerModules();
}

