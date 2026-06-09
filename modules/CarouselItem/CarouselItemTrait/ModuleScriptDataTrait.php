<?php
/**
 * CarouselItem::module_script_data()
 *
 * @package CG\Divi5Modules\CarouselItem
 */

namespace CG\Divi5Modules\CarouselItem\CarouselItemTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Packages\Module\Options\Element\ElementScriptData;
use ET\Builder\Packages\Module\Layout\Components\MultiView\MultiViewScriptData;

trait ModuleScriptDataTrait {

	/**
	 * Set script data of used module options.
	 *
	 * @param array $args
	 */
	public static function module_script_data( $args ) {
		$id             = $args['id'] ?? '';
		$name           = $args['name'] ?? '';
		$selector       = $args['selector'] ?? '';
		$attrs          = $args['attrs'] ?? [];
		$store_instance = $args['storeInstance'] ?? null;

		$module_decoration_attrs = $attrs['module']['decoration'] ?? [];

		ElementScriptData::set(
			[
				'id'            => $id,
				'selector'      => $selector,
				'attrs'         => array_merge(
					$module_decoration_attrs,
					[
						'link' => $args['attrs']['module']['advanced']['link'] ?? [],
					]
				),
				'storeInstance' => $store_instance,
			]
		);

		MultiViewScriptData::set(
			[
				'id'            => $id,
				'name'          => $name,
				'hoverSelector' => $selector,
				'setContent'    => [
					[
						'selector'      => $selector . ' .cg_carousel_item__title',
						'data'          => $attrs['title']['innerContent'] ?? [],
						'valueResolver' => function( $value ) {
							return $value ?? '';
						},
					],

				],
			]
		);
	}
}
