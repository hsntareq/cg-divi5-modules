<?php
/**
 * Carousel::render_callback()
 *
 * @package CG\Divi5Modules\Carousel
 */

namespace CG\Divi5Modules\Carousel\CarouselTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Packages\Module\Module;
use ET\Builder\Framework\Utility\HTMLUtility;
use ET\Builder\FrontEnd\BlockParser\BlockParserStore;
use ET\Builder\Packages\Module\Options\Element\ElementComponents;
use CG\Divi5Modules\Carousel\Carousel;

trait RenderCallbackTrait {

	/**
	 * Carousel render callback outputs HTML on front-end.
	 *
	 * @param array          $attrs    Block attributes saved by VB.
	 * @param string         $content  Block content.
	 * @param \WP_Block      $block    Parsed block object.
	 * @param ModuleElements $elements ModuleElements instance.
	 *
	 * @return string HTML rendered of Carousel module.
	 */
	public static function render_callback( $attrs, $content, $block, $elements ) {
		$children_ids = $block->parsed_block['innerBlocks'] ? array_map(
			function( $inner_block ) {
				return $inner_block['id'];
			},
			$block->parsed_block['innerBlocks']
		) : [];

		$parent       = BlockParserStore::get_parent( $block->parsed_block['id'], $block->parsed_block['storeInstance'] );
		$parent_attrs = $parent ? ( $parent->attrs ?? [] ) : [];

		// Read slider settings.
		$autoplay         = self::get_attribute_value( $attrs, 'autoplay', 'off' );
		$speed            = self::get_attribute_value( $attrs, 'speed', '3000' );
		$transition_speed = self::get_attribute_value( $attrs, 'transitionSpeed', '500' );
		$loop             = self::get_attribute_value( $attrs, 'loop', 'on' );
		$arrows           = self::get_attribute_value( $attrs, 'arrows', 'on' );
		$dots             = self::get_attribute_value( $attrs, 'dots', 'on' );
		$slides_to_show   = self::get_attribute_value( $attrs, 'slidesToShow', '4' );
		$marquee          = self::get_attribute_value( $attrs, 'marquee', 'off' );


		// Clean numerical string inputs from database (e.g. "4px" or "3000px")
		$slides_to_show_num   = (int) $slides_to_show;
		$speed_num            = (int) $speed;
		$transition_speed_num = (int) $transition_speed;

		// Default fallbacks if casting resulted in 0 or invalid values
		if ( $slides_to_show_num <= 0 ) {
			$slides_to_show_num = 4;
		}
		if ( $speed_num <= 0 ) {
			$speed_num = 3000;
		}
		if ( $transition_speed_num <= 0 ) {
			$transition_speed_num = 500;
		}

		$settings = [
			'autoplay'        => $autoplay,
			'speed'           => $speed_num,
			'transitionSpeed' => $transition_speed_num,
			'loop'            => $loop,
			'arrows'          => $arrows,
			'dots'            => $dots,
			'slidesToShow'    => $slides_to_show_num,
			'marquee'         => $marquee,
		];
		$data_settings = json_encode( $settings );

		$inner_html = HTMLUtility::render(
			[
				'tag'               => 'div',
				'attributes'        => [
					'class'         => 'cg_carousel__inner',
					'data-settings' => $data_settings,
					'style'         => "--slides-to-show: {$slides_to_show_num};",
				],
				'childrenSanitizer' => 'et_core_esc_previously',
				'children'          => HTMLUtility::render(
					[
						'tag'               => 'div',
						'attributes'        => [
							'class' => 'cg_carousel__track-wrapper',
						],
						'childrenSanitizer' => 'et_core_esc_previously',
						'children'          => HTMLUtility::render(
							[
								'tag'               => 'div',
								'attributes'        => [
									'class' => 'cg_carousel__track',
								],
								'childrenSanitizer' => 'et_core_esc_previously',
								'children'          => $content,
							]
						),
					]
				),
			]
		);

		return Module::render(
			[
				// FE only.
				'orderIndex'          => $block->parsed_block['orderIndex'],
				'storeInstance'       => $block->parsed_block['storeInstance'],

				// VB equivalent.
				'attrs'               => $attrs,
				'elements'            => $elements,
				'id'                  => $block->parsed_block['id'],
				'name'                => $block->block_type->name,
				'moduleCategory'      => $block->block_type->category,
				'classnamesFunction'  => [ Carousel::class, 'module_classnames' ],
				'stylesComponent'     => [ Carousel::class, 'module_styles' ],
				'scriptDataComponent' => [ Carousel::class, 'module_script_data' ],
				'parentAttrs'         => $parent_attrs,
				'parentId'            => $parent ? ( $parent->id ?? '' ) : '',
				'parentName'          => $parent ? ( $parent->blockName ?? '' ) : '',
				'children'            => [
					ElementComponents::component(
						[
							'attrs'         => $attrs['module']['decoration'] ?? [],
							'id'            => $block->parsed_block['id'],

							// FE only.
							'orderIndex'    => $block->parsed_block['orderIndex'],
							'storeInstance' => $block->parsed_block['storeInstance'],
						]
					),
					$inner_html,
				],
				'childrenIds'         => $children_ids,
			]
		);
	}

	/**
	 * Helper function to safely extract attribute values.
	 *
	 * @param array  $attrs   Attributes.
	 * @param string $name    Attribute name.
	 * @param mixed  $default Default value.
	 *
	 * @return mixed
	 */
	public static function get_attribute_value( $attrs, $name, $default ) {
		if ( ! isset( $attrs[ $name ] ) ) {
			return $default;
		}
		$attr = $attrs[ $name ];
		if ( is_array( $attr ) ) {
			if ( isset( $attr['innerContent'] ) && is_array( $attr['innerContent'] ) ) {
				return $attr['innerContent']['desktop']['value'] ?? $default;
			}
			return $attr['desktop']['value'] ?? $default;
		}
		if ( is_string( $attr ) ) {
			return $attr;
		}
		return $default;
	}
}
