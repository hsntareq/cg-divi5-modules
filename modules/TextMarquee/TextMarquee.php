<?php
/**
 * Module: TextMarquee module class.
 *
 * @package CG\Divi5Modules\TextMarquee
 */

namespace CG\Divi5Modules\TextMarquee;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;
use ET\Builder\Packages\ModuleLibrary\ModuleRegistration;

class TextMarquee implements DependencyInterface {
	use TextMarqueeTrait\RenderCallbackTrait;
	use TextMarqueeTrait\ModuleClassnamesTrait;
	use TextMarqueeTrait\ModuleStylesTrait;
	use TextMarqueeTrait\ModuleScriptDataTrait;

	/**
	 * Loads TextMarquee module and registers Front-End render callback.
	 *
	 * @return void
	 */
	public function load() {
		$module_json_folder_path = CG_DIVI5_MODULES_JSON_PATH . 'text-marquee/';

		ModuleRegistration::register_module(
			$module_json_folder_path,
			[
				'render_callback' => [ TextMarquee::class, 'render_callback' ],
			]
		);
	}
}
