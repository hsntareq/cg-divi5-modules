<?php
/**
 * CGDriveVideo::module_styles().
 *
 * @package CG\Divi5Modules\CGDriveVideo
 */

namespace CG\Divi5Modules\CGDriveVideo\CGDriveVideoTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\FrontEnd\Module\Style;

trait ModuleStylesTrait {

	/**
	 * CGDriveVideo style compiler.
	 *
	 * @param array $args
	 */
	public static function module_styles( $args ) {
		$attrs    = $args['attrs'] ?? [];
		$elements = $args['elements'];
		$settings = $args['settings'] ?? [];

		Style::add(
			[
				'id'            => $args['id'],
				'name'          => $args['name'],
				'orderIndex'    => $args['orderIndex'],
				'storeInstance' => $args['storeInstance'],
				'styles'        => [
					$elements->style(
						[
							'attrName'   => 'module',
							'styleProps' => [
								'disabledOn' => [
									'disabledModuleVisibility' => $settings['disabledModuleVisibility'] ?? null,
								],
							],
						]
					),
				],
			]
		);
	}
}
