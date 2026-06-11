<?php
/*
Plugin Name: CG Divi 5 Modules
Plugin URI:
Description: Example modules.
Version:     1.0.0
Author:      Elegant Themes
Author URI:  https://elegantthemes.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: cg-divi5-modules
Domain Path: /languages

CG Divi 5 Modules is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

CG Divi 5 Modules is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with CG Divi 5 Modules. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
*/

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

define( 'CG_DIVI5_MODULES_PATH', plugin_dir_path( __FILE__ ) );
define( 'CG_DIVI5_MODULES_JSON_PATH', CG_DIVI5_MODULES_PATH . 'modules-json/' );

/**
 * Requires Autoloader.
 */
require CG_DIVI5_MODULES_PATH . 'vendor/autoload.php';
require CG_DIVI5_MODULES_PATH . 'modules/Modules.php';



/**
 * Enqueue style and scripts of Module Extension Example for Visual Builder.
 *
 * @since ??
 */
function cg_divi5_modules_enqueue_vb_scripts() {
	if ( et_builder_d5_enabled() && et_core_is_fb_enabled() ) {
		$plugin_dir_url = plugin_dir_url( __FILE__ );

		$js_version  = file_exists( CG_DIVI5_MODULES_PATH . 'scripts/bundle.js' ) ? filemtime( CG_DIVI5_MODULES_PATH . 'scripts/bundle.js' ) : '1.0.0';
		$css_version = file_exists( CG_DIVI5_MODULES_PATH . 'styles/vb-bundle.css' ) ? filemtime( CG_DIVI5_MODULES_PATH . 'styles/vb-bundle.css' ) : '1.0.0';

		\ET\Builder\VisualBuilder\Assets\PackageBuildManager::register_package_build(
			[
				'name'   => 'cg-divi5-modules-builder-bundle-script',
				'version' => $js_version,
				'script' => [
					'src' => "{$plugin_dir_url}scripts/bundle.js",
					'deps'               => [
						'divi-module-library',
						'divi-vendor-wp-hooks',
						'divi-vendor-wp-data',
						'divi-vendor-wp-api-fetch',
					],
					'enqueue_top_window' => true,
					'enqueue_app_window' => true,
				],
			]
		);

		\ET\Builder\VisualBuilder\Assets\PackageBuildManager::register_package_build(
			[
				'name'   => 'cg-divi5-modules-builder-vb-bundle-style',
				'version' => $css_version,
				'style' => [
					'src' => "{$plugin_dir_url}styles/vb-bundle.css",
					'deps'               => [],
					'enqueue_top_window' => true,
					'enqueue_app_window' => true,
				],
			]
		);
	}
}
add_action( 'divi_visual_builder_assets_before_enqueue_scripts', 'cg_divi5_modules_enqueue_vb_scripts' );

/**
 * Enqueue style and scripts of Module Extension Example
 *
 * @since ??
 */
function cg_divi5_modules_enqueue_frontend_scripts() {
	$plugin_dir_url = plugin_dir_url( __FILE__ );
	$version = file_exists( CG_DIVI5_MODULES_PATH . 'styles/bundle.css' ) ? filemtime( CG_DIVI5_MODULES_PATH . 'styles/bundle.css' ) : '1.0.0';
	wp_enqueue_style( 'cg-divi5-modules-builder-bundle-style', "{$plugin_dir_url}styles/bundle.css", array(), $version );

	$js_version = file_exists( CG_DIVI5_MODULES_PATH . 'scripts/frontend.js' ) ? filemtime( CG_DIVI5_MODULES_PATH . 'scripts/frontend.js' ) : '1.0.0';
	wp_enqueue_script( 'cg-divi5-modules-frontend-script', "{$plugin_dir_url}scripts/frontend.js", array(), $js_version, true );
}
add_action( 'wp_enqueue_scripts', 'cg_divi5_modules_enqueue_frontend_scripts' );