<?php
/**
 * Register all modules with dependency tree.
 *
 * @package CG\Divi5Modules
 * @since ??
 */

namespace CG\Divi5Modules;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use CG\Divi5Modules\StaticModule\StaticModule;
use CG\Divi5Modules\Carousel\Carousel;
use CG\Divi5Modules\CarouselItem\CarouselItem;
use CG\Divi5Modules\TextMarquee\TextMarquee;
use CG\Divi5Modules\PortfolioPB\PortfolioPB;

add_action(
	'divi_module_library_modules_dependency_tree',
	function ( $dependency_tree ) {
		$dependency_tree->add_dependency( new StaticModule() );
		$dependency_tree->add_dependency( new Carousel() );
		$dependency_tree->add_dependency( new CarouselItem() );
		$dependency_tree->add_dependency( new TextMarquee() );
		$dependency_tree->add_dependency( new PortfolioPB() );
	}
);
