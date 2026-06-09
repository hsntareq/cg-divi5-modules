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

add_action(
	'divi_module_library_modules_dependency_tree',
	function ( $dependency_tree ) {
		$dependency_tree->add_dependency( new StaticModule() );
	}
);
