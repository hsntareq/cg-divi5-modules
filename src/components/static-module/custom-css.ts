// WordPress dependencies.
import { __ } from '@wordpress/i18n';

import metadata from './module.json';


const customCssFields = metadata.customCssFields as Record<'contentContainer' | 'title' | 'summary' | 'content' | 'image', { subName: string, selector?: string, selectorSuffix: string, label: string }>;

customCssFields.contentContainer.label = __('Content Container', 'cg-divi5-modules');
customCssFields.title.label            = __('Title', 'cg-divi5-modules');
customCssFields.summary.label          = __('Summary', 'cg-divi5-modules');
customCssFields.content.label          = __('Content', 'cg-divi5-modules');
customCssFields.image.label            = __('Image', 'cg-divi5-modules');

export const cssFields = { ...customCssFields };
