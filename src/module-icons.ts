import { addFilter } from '@wordpress/hooks';
import {
  moduleStatic,
  moduleCarousel,
  moduleCarouselItem,
} from './icons';

// Add module icons to the icon library.
addFilter('divi.iconLibrary.icon.map', 'cgDivi5Modules', (icons) => {
  return {
    ...icons, // This is important. Without this, all other icons will be overwritten.
    [moduleStatic.name]:  moduleStatic,
    [moduleCarousel.name]: moduleCarousel,
    [moduleCarouselItem.name]: moduleCarouselItem,
  };
});
