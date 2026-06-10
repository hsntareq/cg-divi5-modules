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
		$parent_attrs = $parent->attrs ?? [];

		// Read slider settings.
		$autoplay         = $attrs['autoplay']['desktop']['value'] ?? 'off';
		$speed            = $attrs['speed']['desktop']['value'] ?? '3000';
		$transition_speed = $attrs['transitionSpeed']['desktop']['value'] ?? '500';
		$loop             = $attrs['loop']['desktop']['value'] ?? 'on';
		$arrows           = $attrs['arrows']['desktop']['value'] ?? 'on';
		$dots             = $attrs['dots']['desktop']['value'] ?? 'on';
		$slides_to_show   = $attrs['slidesToShow']['desktop']['value'] ?? '4';

		$settings = [
			'autoplay'        => $autoplay,
			'speed'           => (int) $speed,
			'transitionSpeed' => (int) $transition_speed,
			'loop'            => $loop,
			'arrows'          => $arrows,
			'dots'            => $dots,
			'slidesToShow'    => (int) $slides_to_show,
		];
		$data_settings = json_encode( $settings );

		$inner_html = HTMLUtility::render(
			[
				'tag'               => 'div',
				'attributes'        => [
					'class'         => 'cg_carousel__inner',
					'data-settings' => $data_settings,
					'style'         => "--slides-to-show: {$slides_to_show};",
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
				'parentId'            => $parent->id ?? '',
				'parentName'          => $parent->blockName ?? '',
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
}
