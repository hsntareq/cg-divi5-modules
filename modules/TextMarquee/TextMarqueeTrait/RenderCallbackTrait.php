<?php
/**
 * TextMarquee::render_callback()
 *
 * @package CG\Divi5Modules\TextMarquee
 */

namespace CG\Divi5Modules\TextMarquee\TextMarqueeTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Packages\Module\Module;
use ET\Builder\Framework\Utility\HTMLUtility;
use ET\Builder\Packages\Module\Options\Element\ElementComponents;
use CG\Divi5Modules\TextMarquee\TextMarquee;

trait RenderCallbackTrait {

	/**
	 * TextMarquee render callback outputs HTML on front-end.
	 *
	 * @param array          $attrs    Block attributes saved by VB.
	 * @param string         $content  Block content.
	 * @param \WP_Block      $block    Parsed block object.
	 * @param ModuleElements $elements ModuleElements instance.
	 *
	 * @return string HTML rendered of TextMarquee module.
	 */
	public static function render_callback( $attrs, $content, $block, $elements ) {
		$text = self::get_attribute_value( $attrs, 'text', 'This is a seamless text marquee slider! • ' );
		$speed = self::get_attribute_value( $attrs, 'speed', '15' );
		$direction = self::get_attribute_value( $attrs, 'direction', 'left' );
		$pause_on_hover = self::get_attribute_value( $attrs, 'pauseOnHover', 'on' );

		// Render main text component
		$text_html = $elements->render(
			[
				'attrName' => 'text',
			]
		);

		// Style variables for CSS marquee control
		$duration = "{$speed}s";
		$anim_direction = ( $direction === 'left' ) ? 'normal' : 'reverse';
		$pause_state = ( $pause_on_hover === 'on' ) ? 'paused' : 'running';

		$style_attr = "--marquee-duration: {$duration}; --marquee-direction: {$anim_direction}; --marquee-pause-state: {$pause_state};";

		$repeat_count = 6;

		$group_a_children = '';
		for ( $i = 0; $i < $repeat_count; $i++ ) {
			$group_a_children .= HTMLUtility::render(
				[
					'tag'               => 'span',
					'attributes'        => [
						'class' => 'cg_text_marquee__item',
					],
					'childrenSanitizer' => 'et_core_esc_previously',
					'children'          => $text_html,
				]
			);
		}

		$group_b_children = '';
		for ( $i = 0; $i < $repeat_count; $i++ ) {
			$group_b_children .= HTMLUtility::render(
				[
					'tag'               => 'span',
					'attributes'        => [
						'class' => 'cg_text_marquee__item',
					],
					'childrenSanitizer' => 'et_core_esc_previously',
					'children'          => $text_html,
				]
			);
		}

		$group_a = HTMLUtility::render(
			[
				'tag'               => 'div',
				'attributes'        => [
					'class' => 'cg_text_marquee__group cg_text_marquee__group--a',
				],
				'childrenSanitizer' => 'et_core_esc_previously',
				'children'          => $group_a_children,
			]
		);

		$group_b = HTMLUtility::render(
			[
				'tag'               => 'div',
				'attributes'        => [
					'class' => 'cg_text_marquee__group cg_text_marquee__group--b',
				],
				'childrenSanitizer' => 'et_core_esc_previously',
				'children'          => $group_b_children,
			]
		);

		$inner_html = HTMLUtility::render(
			[
				'tag'               => 'div',
				'attributes'        => [
					'class' => 'cg_text_marquee__inner',
					'style' => $style_attr,
				],
				'childrenSanitizer' => 'et_core_esc_previously',
				'children'          => HTMLUtility::render(
					[
						'tag'               => 'div',
						'attributes'        => [
							'class' => 'cg_text_marquee__track',
						],
						'childrenSanitizer' => 'et_core_esc_previously',
						'children'          => $group_a . $group_b,
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
				'classnamesFunction'  => [ TextMarquee::class, 'module_classnames' ],
				'stylesComponent'     => [ TextMarquee::class, 'module_styles' ],
				'scriptDataComponent' => [ TextMarquee::class, 'module_script_data' ],
				'parentAttrs'         => [],
				'parentId'            => '',
				'parentName'          => '',
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
