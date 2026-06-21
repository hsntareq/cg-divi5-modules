<?php
/**
 * Module: CGDriveVideo module class.
 *
 * @package CG\Divi5Modules\CGDriveVideo
 */

namespace CG\Divi5Modules\CGDriveVideo;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;
use ET\Builder\Packages\ModuleLibrary\ModuleRegistration;

class CGDriveVideo implements DependencyInterface {
	use CGDriveVideoTrait\RenderCallbackTrait;
	use CGDriveVideoTrait\ModuleClassnamesTrait;
	use CGDriveVideoTrait\ModuleStylesTrait;
	use CGDriveVideoTrait\ModuleScriptDataTrait;

	/**
	 * Loads CGDriveVideo module and registers Front-End render callback.
	 *
	 * @return void
	 */
	public function load() {
		$module_json_folder_path = CG_DIVI5_MODULES_JSON_PATH . 'cg-drive-video/';

		ModuleRegistration::register_module(
			$module_json_folder_path,
			[
				'render_callback' => [ CGDriveVideo::class, 'render_callback' ],
			]
		);
	}
}
