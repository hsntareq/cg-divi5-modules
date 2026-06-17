<?php
/**
 * PortfolioPB::module_classnames().
 *
 * @package CG\Divi5Modules\PortfolioPB
 */

namespace CG\Divi5Modules\PortfolioPB\PortfolioPBTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

trait ModuleClassnamesTrait {

	/**
	 * Module classnames function for Portfolio PB module.
	 */
	public static function module_classnames( $args ) {
		// No extra custom classnames needed. The container gets its name automatically.
	}

}
