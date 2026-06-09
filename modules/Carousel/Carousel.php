<?php
/**
 * Module: Carousel parent class.
 *
 * @package CG\Divi5Modules\Carousel
 */

namespace CG\Divi5Modules\Carousel;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;
use ET\Builder\Packages\ModuleLibrary\ModuleRegistration;

class Carousel implements DependencyInterface {
	use CarouselTrait\RenderCallbackTrait;
	use CarouselTrait\ModuleClassnamesTrait;
	use CarouselTrait\ModuleStylesTrait;
	use CarouselTrait\ModuleScriptDataTrait;

	/**
	 * Loads Carousel module and registers Front-End render callback.
	 *
	 * @return void
	 */
	public function load() {
		$module_json_folder_path = CG_DIVI5_MODULES_JSON_PATH . 'carousel/';

		ModuleRegistration::register_module(
			$module_json_folder_path,
			[
				'render_callback' => [ Carousel::class, 'render_callback' ],
			]
		);
	}
}
