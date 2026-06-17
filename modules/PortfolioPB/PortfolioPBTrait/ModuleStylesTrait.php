<?php
/**
 * PortfolioPB::module_styles().
 *
 * @package CG\Divi5Modules\PortfolioPB
 */

namespace CG\Divi5Modules\PortfolioPB\PortfolioPBTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\FrontEnd\Module\Style;
use ET\Builder\Packages\Module\Options\Css\CssStyle;
use CG\Divi5Modules\PortfolioPB\PortfolioPB;

trait ModuleStylesTrait {

	use CustomCssTrait;

	/**
	 * Portfolio PB Module's style components.
	 */
	public static function module_styles( $args ) {
		$attrs    = $args['attrs'] ?? [];
		$elements = $args['elements'];

		Style::add(
			[
				'id'            => $args['id'],
				'name'          => $args['name'],
				'orderIndex'    => $args['orderIndex'],
				'storeInstance' => $args['storeInstance'],
				'styles'        => [
					$elements->style(
						[
							'attrName' => 'module',
						]
					),
					$elements->style(
						[
							'attrName' => 'titleText',
						]
					),
					$elements->style(
						[
							'attrName' => 'tabText',
						]
					),
					$elements->style(
						[
							'attrName' => 'radioPillText',
						]
					),
					$elements->style(
						[
							'attrName' => 'loadMoreBtn',
						]
					),
					$elements->style(
						[
							'attrName' => 'item',
						]
					),
					CssStyle::style(
						[
							'selector'  => $args['orderClass'],
							'attr'      => $attrs['css'] ?? [],
							'cssFields' => PortfolioPB::custom_css(),
						]
					),
				],
			]
		);
	}
}
