<?php
/**
 * CGDriveVideo::module_classnames().
 *
 * @package CG\Divi5Modules\CGDriveVideo
 */

namespace CG\Divi5Modules\CGDriveVideo\CGDriveVideoTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

trait ModuleClassnamesTrait {

	/**
	 * Module classnames function for CGDriveVideo module.
	 *
	 * @param array $args
	 */
	public static function module_classnames( $args ) {
		$classnames_instance = $args['classnamesInstance'];
		$classnames_instance->add( 'cg_drive_video', true );
	}

}
