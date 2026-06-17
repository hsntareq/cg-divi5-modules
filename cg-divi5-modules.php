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

/**
 * Register post meta for Portfolio PB Module layout sizing and custom click action.
 */
function cg_portfolio_register_post_meta() {
	$screens = [ 'post', 'project' ];
	foreach ( $screens as $screen ) {
		register_post_meta(
			$screen,
			'portfolio_pb_size',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			]
		);
		register_post_meta(
			$screen,
			'portfolio_pb_view_type',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			]
		);
		register_post_meta(
			$screen,
			'portfolio_pb_external_url',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			]
		);
		register_post_meta(
			$screen,
			'portfolio_pb_custom_post_id',
			[
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			]
		);
	}
}
add_action( 'init', 'cg_portfolio_register_post_meta' );

/**
 * Add meta box to post and project edit screens.
 */
function cg_portfolio_pb_add_meta_box() {
	$screens = [ 'post', 'project' ];
	foreach ( $screens as $screen ) {
		add_meta_box(
			'cg_portfolio_pb_size_box',
			'Portfolio Item Settings',
			'cg_portfolio_pb_size_box_callback',
			$screen,
			'side',
			'default'
		);
	}
}
add_action( 'add_meta_boxes', 'cg_portfolio_pb_add_meta_box' );

/**
 * Render metabox dropdown and view type options.
 */
function cg_portfolio_pb_size_box_callback( $post ) {
	wp_nonce_field( 'cg_portfolio_pb_save_size', 'cg_portfolio_pb_size_nonce' );
	
	$size = get_post_meta( $post->ID, 'portfolio_pb_size', true );
	if ( empty( $size ) ) {
		$size = 'regular';
	}
	
	$view_type = get_post_meta( $post->ID, 'portfolio_pb_view_type', true );
	if ( empty( $view_type ) ) {
		$view_type = 'default';
	}
	
	$external_url = get_post_meta( $post->ID, 'portfolio_pb_external_url', true );
	$custom_post_id = get_post_meta( $post->ID, 'portfolio_pb_custom_post_id', true );

	// Fetch database posts, pages, and projects for custom link dropdown
	$db_posts = get_posts( [
		'post_type'      => [ 'post', 'page', 'project' ],
		'posts_per_page' => -1,
		'post_status'    => 'publish',
		'orderby'        => 'title',
		'order'          => 'ASC',
	] );
	?>
	<div style="margin-bottom: 15px;">
		<label style="display: block; font-weight: bold; margin-bottom: 5px;">Portfolio Grid Size</label>
		<select name="portfolio_pb_size_field" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
			<option value="regular" <?php selected( $size, 'regular' ); ?>>Regular (1x1)</option>
			<option value="2x1" <?php selected( $size, '2x1' ); ?>>2x Width (2x1)</option>
			<option value="2x2" <?php selected( $size, '2x2' ); ?>>2x Width & Height (2x2)</option>
			<option value="1x2" <?php selected( $size, '1x2' ); ?>>2x Height (1x2)</option>
		</select>
	</div>

	<div style="margin-bottom: 15px;">
		<label style="display: block; font-weight: bold; margin-bottom: 5px;">Click Action (View Pattern)</label>
		<select id="portfolio_pb_view_type_select" name="portfolio_pb_view_type_field" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
			<option value="default" <?php selected( $view_type, 'default' ); ?>>Default Post Link</option>
			<option value="lightbox" <?php selected( $view_type, 'lightbox' ); ?>>Image Lightbox</option>
			<option value="external" <?php selected( $view_type, 'external' ); ?>>External Link</option>
			<option value="custom" <?php selected( $view_type, 'custom' ); ?>>Custom Site Page/Post/Project</option>
		</select>
	</div>

	<div id="portfolio_pb_external_url_container" style="margin-bottom: 15px; display: <?php echo ( 'external' === $view_type ) ? 'block' : 'none'; ?>;">
		<label style="display: block; font-weight: bold; margin-bottom: 5px;">External Link URL</label>
		<input type="url" name="portfolio_pb_external_url_field" value="<?php echo esc_url( $external_url ); ?>" placeholder="https://example.com" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
	</div>

	<div id="portfolio_pb_custom_post_container" style="margin-bottom: 15px; display: <?php echo ( 'custom' === $view_type ) ? 'block' : 'none'; ?>;">
		<label style="display: block; font-weight: bold; margin-bottom: 5px;">Select Site Page/Post/Project</label>
		<select name="portfolio_pb_custom_post_id_field" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
			<option value="">-- Choose Page --</option>
			<?php foreach ( $db_posts as $db_post ) : ?>
				<option value="<?php echo esc_attr( $db_post->ID ); ?>" <?php selected( $custom_post_id, $db_post->ID ); ?>>
					<?php echo esc_html( $db_post->post_title ); ?> (<?php echo esc_html( $db_post->post_type ); ?>)
				</option>
			<?php endforeach; ?>
		</select>
	</div>

	<script>
		document.addEventListener('DOMContentLoaded', function() {
			var select = document.getElementById('portfolio_pb_view_type_select');
			var externalContainer = document.getElementById('portfolio_pb_external_url_container');
			var customContainer = document.getElementById('portfolio_pb_custom_post_container');

			if (select) {
				select.addEventListener('change', function() {
					if (this.value === 'external') {
						externalContainer.style.display = 'block';
						customContainer.style.display = 'none';
					} else if (this.value === 'custom') {
						externalContainer.style.display = 'none';
						customContainer.style.display = 'block';
					} else {
						externalContainer.style.display = 'none';
						customContainer.style.display = 'none';
					}
				});
			}
		});
	</script>
	<?php
}

/**
 * Save metabox selection.
 */
function cg_portfolio_pb_save_size_data( $post_id ) {
	if ( ! isset( $_POST['cg_portfolio_pb_size_nonce'] ) ) {
		return;
	}
	if ( ! wp_verify_nonce( $_POST['cg_portfolio_pb_size_nonce'], 'cg_portfolio_pb_save_size' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	
	if ( isset( $_POST['portfolio_pb_size_field'] ) ) {
		update_post_meta( $post_id, 'portfolio_pb_size', sanitize_text_field( $_POST['portfolio_pb_size_field'] ) );
	}
	
	if ( isset( $_POST['portfolio_pb_view_type_field'] ) ) {
		update_post_meta( $post_id, 'portfolio_pb_view_type', sanitize_text_field( $_POST['portfolio_pb_view_type_field'] ) );
	}
	
	if ( isset( $_POST['portfolio_pb_external_url_field'] ) ) {
		update_post_meta( $post_id, 'portfolio_pb_external_url', esc_url_raw( $_POST['portfolio_pb_external_url_field'] ) );
	}
	
	if ( isset( $_POST['portfolio_pb_custom_post_id_field'] ) ) {
		update_post_meta( $post_id, 'portfolio_pb_custom_post_id', sanitize_text_field( $_POST['portfolio_pb_custom_post_id_field'] ) );
	}
}
add_action( 'save_post', 'cg_portfolio_pb_save_size_data' );
