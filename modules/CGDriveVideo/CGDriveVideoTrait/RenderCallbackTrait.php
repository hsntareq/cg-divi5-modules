<?php
/**
 * CGDriveVideo::render_callback()
 *
 * @package CG\Divi5Modules\CGDriveVideo
 */

namespace CG\Divi5Modules\CGDriveVideo\CGDriveVideoTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Packages\Module\Module;
use ET\Builder\Framework\Utility\HTMLUtility;
use ET\Builder\Packages\Module\Options\Element\ElementComponents;
use CG\Divi5Modules\CGDriveVideo\CGDriveVideo;

trait RenderCallbackTrait {

	/**
	 * CGDriveVideo render callback outputs HTML on front-end.
	 *
	 * @param array          $attrs    Block attributes saved by VB.
	 * @param string         $content  Block content.
	 * @param \WP_Block      $block    Parsed block object.
	 * @param ModuleElements $elements ModuleElements instance.
	 *
	 * @return string HTML rendered of CGDriveVideo module.
	 */
	public static function render_callback( $attrs, $content, $block, $elements ) {
		$video_source_type   = self::get_attribute_value( $attrs, 'videoSourceType', 'youtube' );
		$video_url           = self::get_attribute_value( $attrs, 'videoUrl', '' );
		$youtube_url         = self::get_attribute_value( $attrs, 'youtubeUrl', '' );
		$youtube_controls    = self::get_attribute_value( $attrs, 'youtubeControls', 'off' );
		$seamless_mode       = self::get_attribute_value( $attrs, 'seamlessMode', 'off' );
		$render_mode         = self::get_attribute_value( $attrs, 'renderMode', 'video_tag' );
		$video_muted         = self::get_attribute_value( $attrs, 'videoMuted', 'off' );
		$video_controls      = self::get_attribute_value( $attrs, 'videoControls', 'on' );
		$video_code          = self::get_attribute_value( $attrs, 'videoCode', '' );
		$aspect_ratio        = self::get_attribute_value( $attrs, 'aspectRatio', '16/9' );
		$custom_aspect_ratio = self::get_attribute_value( $attrs, 'customAspectRatio', '16/9' );
		$play_offscreen      = self::get_attribute_value( $attrs, 'playOffscreen', 'off' );

		// Parse IDs
		$file_id    = self::get_google_drive_file_id( $video_url );
		$youtube_id = self::get_youtube_video_id( $youtube_url );

		// Set sizing / dimensions
		$ratio           = ( $aspect_ratio === 'custom' ) ? $custom_aspect_ratio : $aspect_ratio;
		$ratio           = str_replace( ':', '/', $ratio );
		$container_style = "aspect-ratio: {$ratio}; width: 100%; height: auto;";

		$player_html = '';

		if ( $video_source_type === 'url' ) {
			if ( ! empty( $file_id ) ) {
				if ( $render_mode === 'video_tag' ) {
					$stream_url    = add_query_arg( 'cg_drive_video_stream', $file_id, home_url( '/' ) );
					$muted_attr    = ( $video_muted === 'on' ) ? ' muted="muted"' : '';
					$controls_attr = ( $video_controls === 'on' ) ? ' controls="controls"' : '';
					$player_html   = "<video class=\"cg_drive_video__element\" src=\"{$stream_url}\"{$muted_attr}{$controls_attr} loop=\"loop\" playsinline=\"playsinline\" data-play-offscreen=\"{$play_offscreen}\"></video>";
				} else {
					$iframe_url  = "https://drive.google.com/file/d/{$file_id}/preview";
					$player_html = HTMLUtility::render(
						array(
							'tag'        => 'iframe',
							'attributes' => array(
								'class'               => 'cg_drive_video__iframe',
								'src'                 => $iframe_url,
								'frameborder'         => '0',
								'allow'               => 'autoplay; fullscreen',
								'allowfullscreen'     => 'allowfullscreen',
								'data-play-offscreen' => $play_offscreen,
								'data-muted'          => $video_muted,
							),
						)
					);
				}
			} elseif ( ! empty( $video_url ) && ( strpos( $video_url, 'http://' ) === 0 || strpos( $video_url, 'https://' ) === 0 ) ) {
				// Fallback to standard direct video URL support
				$muted_attr    = ( $video_muted === 'on' ) ? ' muted="muted"' : '';
				$controls_attr = ( $video_controls === 'on' ) ? ' controls="controls"' : '';
				$player_html   = "<video class=\"cg_drive_video__element\" src=\"{$video_url}\"{$muted_attr}{$controls_attr} loop=\"loop\" playsinline=\"playsinline\" data-play-offscreen=\"{$play_offscreen}\"></video>";
			} else {
				$player_html = HTMLUtility::render(
					array(
						'tag'        => 'div',
						'attributes' => array(
							'class' => 'cg_drive_video__placeholder',
						),
						'children'   => 'Please enter a valid Google Drive URL or direct video link.',
					)
				);
			}
		} elseif ( $video_source_type === 'youtube' ) {
			if ( empty( $youtube_id ) ) {
				$player_html = HTMLUtility::render(
					array(
						'tag'        => 'div',
						'attributes' => array(
							'class' => 'cg_drive_video__placeholder',
						),
						'children'   => 'Please enter a valid YouTube or YouTube Shorts URL',
					)
				);
			} else {
				$mute_val    = ( $video_muted === 'on' ) ? '1' : '0';
				$iframe_url  = "https://www.youtube.com/embed/{$youtube_id}?autoplay=1&loop=1&playlist={$youtube_id}&mute={$mute_val}&controls=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1";
				$player_html = HTMLUtility::render(
					array(
						'tag'        => 'iframe',
						'attributes' => array(
							'class'               => 'cg_drive_video__iframe',
							'src'                 => $iframe_url,
							'frameborder'         => '0',
							'allow'               => 'autoplay; encrypted-media',
							'allowfullscreen'     => 'allowfullscreen',
							'data-play-offscreen' => $play_offscreen,
							'data-muted'          => $video_muted,
						),
					)
				);
			}
		} elseif ( empty( $video_code ) ) {
				$player_html = HTMLUtility::render(
					array(
						'tag'        => 'div',
						'attributes' => array(
							'class' => 'cg_drive_video__placeholder',
						),
						'children'   => 'Please enter your iframe or video embed code',
					)
				);
		} else {
			$player_html = HTMLUtility::render(
				array(
					'tag'               => 'div',
					'attributes'        => array(
						'class' => 'cg_drive_video__embed-wrapper',
					),
					'childrenSanitizer' => 'et_core_esc_previously',
					'children'          => $video_code,
				)
			);
		}

		$container_class = 'cg_drive_video__container';
		if ( $seamless_mode === 'on' && $video_source_type !== 'youtube' ) {
			$container_class .= ' cg_drive_video__container--seamless';
		}
		if ( $video_source_type === 'youtube' ) {
			$container_class .= ' cg_drive_video__container--youtube-hide-controls';
		}

		$container_html = HTMLUtility::render(
			array(
				'tag'               => 'div',
				'attributes'        => array(
					'class' => $container_class,
					'style' => $container_style,
				),
				'childrenSanitizer' => 'et_core_esc_previously',
				'children'          => $player_html,
			)
		);

		return Module::render(
			array(
				// FE only.
				'orderIndex'          => $block->parsed_block['orderIndex'],
				'storeInstance'       => $block->parsed_block['storeInstance'],

				// VB equivalent.
				'attrs'               => $attrs,
				'elements'            => $elements,
				'id'                  => $block->parsed_block['id'],
				'name'                => $block->block_type->name,
				'moduleCategory'      => $block->block_type->category,
				'classnamesFunction'  => array( CGDriveVideo::class, 'module_classnames' ),
				'stylesComponent'     => array( CGDriveVideo::class, 'module_styles' ),
				'scriptDataComponent' => array( CGDriveVideo::class, 'module_script_data' ),
				'parentAttrs'         => array(),
				'parentId'            => '',
				'parentName'          => '',
				'children'            => array(
					ElementComponents::component(
						array(
							'attrs'         => $attrs['module']['decoration'] ?? array(),
							'id'            => $block->parsed_block['id'],

							// FE only.
							'orderIndex'    => $block->parsed_block['orderIndex'],
							'storeInstance' => $block->parsed_block['storeInstance'],
						)
					),
					$container_html,
				),
			)
		);
	}

	/**
	 * Extracts Google Drive ID from sharing or preview URLs.
	 *
	 * @param string $url
	 * @return string|null
	 */
	public static function get_google_drive_file_id( $url ) {
		if ( empty( $url ) ) {
			return null;
		}
		// Match standard view/preview links
		if ( preg_match( '/\/file\/d\/([a-zA-Z0-9_-]+)/', $url, $matches ) ) {
			return $matches[1];
		}
		// Match open id query links
		if ( preg_match( '/[?&]id=([a-zA-Z0-9_-]+)/', $url, $matches ) ) {
			return $matches[1];
		}
		return null;
	}

	/**
	 * Extracts YouTube Video ID from sharing, embed, or Shorts URLs.
	 *
	 * @param string $url
	 * @return string|null
	 */
	public static function get_youtube_video_id( $url ) {
		if ( empty( $url ) ) {
			return null;
		}
		$pattern = '/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/';
		if ( preg_match( $pattern, $url, $matches ) ) {
			return $matches[1];
		}
		return null;
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
