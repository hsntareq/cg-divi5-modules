import { omit } from 'lodash';

import { addAction } from '@wordpress/hooks';

import { registerModule } from '@divi/module-library';

import { staticModule } from './components/static-module';
import { carousel } from './components/carousel';
import { carouselItem } from './components/carousel-item';
import { textMarquee } from './components/text-marquee';
import { portfolioPB } from './components/portfolio-pb';
import { cgDriveVideo } from './components/cg-drive-video';

import './module-icons';

// Register modules.
const registerModules = () => {
  registerModule(staticModule.metadata, omit(staticModule, 'metadata'));
  registerModule(carousel.metadata, omit(carousel, 'metadata'));
  registerModule(carouselItem.metadata, omit(carouselItem, 'metadata'));
  registerModule(textMarquee.metadata, omit(textMarquee, 'metadata'));
  registerModule(portfolioPB.metadata, omit(portfolioPB, 'metadata'));
  registerModule(cgDriveVideo.metadata, omit(cgDriveVideo, 'metadata'));
};

addAction('divi.moduleLibrary.registerModuleLibraryStore.after', 'cgDivi5Modules', registerModules);

// Fallback in case the hook has already fired when this bundle loads
if (typeof window !== 'undefined' && window.divi?.moduleLibrary?.registerModule) {
  registerModules();
}

