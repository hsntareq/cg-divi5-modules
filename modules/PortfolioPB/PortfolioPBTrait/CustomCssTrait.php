<?php
/**
 * PortfolioPB::custom_css().
 *
 * @package CG\Divi5Modules\PortfolioPB
 */

namespace CG\Divi5Modules\PortfolioPB\PortfolioPBTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

trait CustomCssTrait {

	/**
	 * Custom CSS fields.
	 */
	public static function custom_css() {
		return \WP_Block_Type_Registry::get_instance()->get_registered( 'cg/portfolio-pb' )->customCssFields;
	}

}
