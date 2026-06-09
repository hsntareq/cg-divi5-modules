<?php
/**
 * Module: CarouselItem child class.
 *
 * @package CG\Divi5Modules\CarouselItem
 */

namespace CG\Divi5Modules\CarouselItem;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;
use ET\Builder\Packages\ModuleLibrary\ModuleRegistration;

class CarouselItem implements DependencyInterface {
	use CarouselItemTrait\RenderCallbackTrait;
	use CarouselItemTrait\ModuleClassnamesTrait;
	use CarouselItemTrait\ModuleStylesTrait;
	use CarouselItemTrait\ModuleScriptDataTrait;

	/**
	 * Loads CarouselItem module and registers Front-End render callback.
	 *
	 * @return void
	 */
	public function load() {
		$module_json_folder_path = CG_DIVI5_MODULES_JSON_PATH . 'carousel-item/';

		ModuleRegistration::register_module(
			$module_json_folder_path,
			[
				'render_callback' => [ CarouselItem::class, 'render_callback' ],
			]
		);
	}
}
