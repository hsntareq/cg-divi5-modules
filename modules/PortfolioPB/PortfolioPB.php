<?php
/**
 * Module: Portfolio PB class.
 *
 * @package CG\Divi5Modules\PortfolioPB
 */

namespace CG\Divi5Modules\PortfolioPB;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;
use ET\Builder\Packages\ModuleLibrary\ModuleRegistration;

/**
 * `PortfolioPB` registers the Front-End render callback and handles dependencies.
 */
class PortfolioPB implements DependencyInterface {
	use PortfolioPBTrait\RenderCallbackTrait;
	use PortfolioPBTrait\ModuleClassnamesTrait;
	use PortfolioPBTrait\ModuleStylesTrait;
	use PortfolioPBTrait\ModuleScriptDataTrait;

	/**
	 * Loads `PortfolioPB` module and registers Front-End render callback.
	 *
	 * @return void
	 */
	public function load() {
		$module_json_folder_path = CG_DIVI5_MODULES_JSON_PATH . 'portfolio-pb/';

		ModuleRegistration::register_module(
			$module_json_folder_path,
			[
				'render_callback' => [ PortfolioPB::class, 'render_callback' ],
			]
		);
	}
}
