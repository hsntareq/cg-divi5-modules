<?php
/**
 * CarouselItem::render_callback()
 *
 * @package CG\Divi5Modules\CarouselItem
 */

namespace CG\Divi5Modules\CarouselItem\CarouselItemTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Packages\Module\Module;
use ET\Builder\Framework\Utility\HTMLUtility;
use ET\Builder\FrontEnd\BlockParser\BlockParserStore;
use ET\Builder\Packages\Module\Options\Element\ElementComponents;
use CG\Divi5Modules\CarouselItem\CarouselItem;

trait RenderCallbackTrait {

	/**
	 * CarouselItem render callback outputs HTML on front-end.
	 *
	 * @param array          $attrs    Block attributes saved by VB.
	 * @param string         $content  Block content.
	 * @param \WP_Block      $block    Parsed block object.
	 * @param ModuleElements $elements ModuleElements instance.
	 *
	 * @return string HTML rendered of CarouselItem module.
	 */
	public static function render_callback( $attrs, $content, $block, $elements ) {
		$parent = BlockParserStore::get_parent( $block->parsed_block['id'], $block->parsed_block['storeInstance'] );
		$parent_attrs = $parent ? ( $parent->attrs ?? [] ) : [];

		// Read elements settings from parent.
		$parent_show_title = 'on';
		if ( isset( $parent_attrs['showTitle'] ) ) {
			$attr = $parent_attrs['showTitle'];
			if ( is_array( $attr ) ) {
				$parent_show_title = $attr['innerContent']['desktop']['value'] ?? 'on';
			} elseif ( is_string( $attr ) ) {
				$parent_show_title = $attr;
			}
		}

		$parent_show_image = 'on';
		if ( isset( $parent_attrs['showImage'] ) ) {
			$attr = $parent_attrs['showImage'];
			if ( is_array( $attr ) ) {
				$parent_show_image = $attr['innerContent']['desktop']['value'] ?? 'on';
			} elseif ( is_string( $attr ) ) {
				$parent_show_image = $attr;
			}
		}

		// Render slide image
		$image = '';
		if ( $parent_show_image === 'on' ) {
			$image_html = $elements->render(
				[
					'attrName' => 'image',
				]
			);

			if ( ! empty( $image_html ) ) {
				$image = HTMLUtility::render(
					[
						'tag'               => 'div',
						'attributes'        => [
							'class' => 'cg_carousel_item__image',
						],
						'childrenSanitizer' => 'et_core_esc_previously',
						'children'          => $image_html,
					]
				);
			}
		}

		// Render Title
		$content_container = '';
		if ( $parent_show_title === 'on' ) {
			$title = $elements->render(
				[
					'attrName' => 'title',
				]
			);

			if ( ! empty( $title ) ) {
				$content_container = HTMLUtility::render(
					[
						'tag'               => 'div',
						'attributes'        => [
							'class' => 'cg_carousel_item__content-container',
						],
						'childrenSanitizer' => 'et_core_esc_previously',
						'children'          => $title,
					]
				);
			}
		}

		$inner_html = HTMLUtility::render(
			[
				'tag'               => 'div',
				'attributes'        => [
					'class' => 'cg_carousel_item__inner',
				],
				'childrenSanitizer' => 'et_core_esc_previously',
				'children'          => $image . $content_container,
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
				'classnamesFunction'  => [ CarouselItem::class, 'module_classnames' ],
				'stylesComponent'     => [ CarouselItem::class, 'module_styles' ],
				'scriptDataComponent' => [ CarouselItem::class, 'module_script_data' ],
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
			]
		);
	}
}
