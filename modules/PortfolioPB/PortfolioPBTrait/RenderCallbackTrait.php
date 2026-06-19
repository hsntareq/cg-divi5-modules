<?php
/**
 * PortfolioPB::render_callback()
 *
 * @package CG\Divi5Modules\PortfolioPB
 */

namespace CG\Divi5Modules\PortfolioPB\PortfolioPBTrait;

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

use ET\Builder\Packages\Module\Module;
use ET\Builder\Framework\Utility\HTMLUtility;
use ET\Builder\FrontEnd\BlockParser\BlockParserStore;
use ET\Builder\Packages\Module\Options\Element\ElementComponents;
use CG\Divi5Modules\PortfolioPB\PortfolioPB;

trait RenderCallbackTrait {

	/**
	 * Helper function to resolve attribute values robustly across all potential structures.
	 *
	 * @param mixed $attr         Attribute value.
	 * @param mixed $default_value Default value.
	 *
	 * @return string
	 */
	public static function get_attr_value( $attr, $default_value ) {
		if ( empty( $attr ) ) {
			return $default_value;
		}
		if ( is_string( $attr ) || is_numeric( $attr ) ) {
			return strval( $attr );
		}
		if ( is_array( $attr ) ) {
			if ( isset( $attr['innerContent']['desktop']['value'] ) ) {
				return strval( $attr['innerContent']['desktop']['value'] );
			}
			if ( isset( $attr['desktop']['value'] ) ) {
				return strval( $attr['desktop']['value'] );
			}
			if ( isset( $attr['value'] ) ) {
				return strval( $attr['value'] );
			}
		}
		return $default_value;
	}

	public static function is_direct_video( $url ) {
		if ( empty( $url ) ) {
			return false;
		}
		if ( preg_match( '/\.(mp4|webm|ogg|ogv)(\?|$)/i', $url ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Get direct stream URL for Google Drive or returns the original URL.
	 *
	 * @param string $url Video URL.
	 *
	 * @return string
	 */
	public static function get_video_stream_url( $url ) {
		if ( empty( $url ) ) {
			return '';
		}
		if ( preg_match( '/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|uc\?id=)([a-zA-Z0-9_-]{25,})/', $url, $matches ) ) {
			return 'https://drive.google.com/uc?export=download&id=' . $matches[1];
		}
		return $url;
	}

	/**
	 * Get preview/embed URL for Google Drive or returns the original URL.
	 *
	 * @param string $url Video URL.
	 *
	 * @return string
	 */
	public static function get_google_drive_preview_url( $url ) {
		if ( empty( $url ) ) {
			return '';
		}
		if ( preg_match( '/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|uc\?id=)([a-zA-Z0-9_-]{25,})/', $url, $matches ) ) {
			return 'https://drive.google.com/file/d/' . $matches[1] . '/preview';
		}
		return $url;
	}

	/**
	 * Get Google Drive file ID from URL or returns empty string.
	 *
	 * @param string $url Video URL.
	 *
	 * @return string
	 */
	public static function get_google_drive_file_id( $url ) {
		if ( empty( $url ) ) {
			return '';
		}
		if ( preg_match( '/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|uc\?id=)([a-zA-Z0-9_-]{25,})/', $url, $matches ) ) {
			return $matches[1];
		}
		return '';
	}

	/**
	 * Render callback for Portfolio PB module.
	 *
	 * @param array    $attrs    Block attributes saved by Visual Builder.
	 * @param string   $content  Block content.
	 * @param WP_Block $block    Parsed block object.
	 * @param object   $elements ModuleElements instance.
	 *
	 * @return string HTML rendered output.
	 */
	public static function render_callback( $attrs, $content, $block, $elements ) {
		// Extract attributes robustly
		$post_type          = self::get_attr_value( $attrs['postType'] ?? null, 'post' );
		$grid_columns       = self::get_attr_value( $attrs['gridColumns'] ?? null, '3' );
		$grid_columns_int   = intval( $grid_columns );
		if ( $grid_columns_int < 1 ) {
			$grid_columns_int = 3;
		}

		$rows_number_attr   = self::get_attr_value( $attrs['rowsNumber'] ?? null, '' );
		$posts_number_attr  = self::get_attr_value( $attrs['postsNumber'] ?? null, '' );

		if ( ! empty( $posts_number_attr ) ) {
			$posts_number = intval( $posts_number_attr );
		} elseif ( ! empty( $rows_number_attr ) ) {
			$posts_number = intval( $rows_number_attr ) * $grid_columns_int;
		} else {
			$posts_number = 12;
		}
		$hide_empty_subcats = self::get_attr_value( $attrs['hideEmptySubcats'] ?? null, 'off' );
		$direct_subcat_label = self::get_attr_value( $attrs['directSubcatLabel'] ?? null, 'parent' );
		$show_load_more     = self::get_attr_value( $attrs['showLoadMore'] ?? null, 'on' );
		$load_more_text     = self::get_attr_value( $attrs['loadMoreText'] ?? null, 'Load More' );
		$active_color       = self::get_attr_value( $attrs['activeColor'] ?? null, '#7e22ce' );
		$open_in_new_tab    = self::get_attr_value( $attrs['openInNewTab'] ?? null, 'off' );
		$pause_on_tab_switch = self::get_attr_value( $attrs['pauseOnTabSwitch'] ?? null, 'on' );
		$fill_row           = self::get_attr_value( $attrs['fillRow'] ?? null, 'off' );
		$module_id          = $block->parsed_block['id'] ?? uniqid();

		// Determine taxonomy
		$taxonomy = ( 'project' === $post_type ) ? 'project_category' : 'category';

		// Get all terms of the taxonomy
		$all_terms = get_terms(
			[
				'taxonomy'   => $taxonomy,
				'hide_empty' => true,
			]
		);

		$top_categories = [];
		$sub_categories = [];

		if ( ! is_wp_error( $all_terms ) && ! empty( $all_terms ) ) {
			foreach ( $all_terms as $term ) {
				if ( 0 === $term->parent ) {
					$top_categories[] = $term;
				} else {
					$sub_categories[ $term->parent ][] = $term;
				}
			}
		}

		// Query posts for all, plus for each category to ensure client-side filter works when posts_number is low
		$post_ids = [];

		// 1. Get latest posts overall
		$default_query = new \WP_Query( [
			'post_type'      => $post_type,
			'posts_per_page' => $posts_number,
			'post_status'    => 'publish',
			'fields'         => 'ids',
		] );
		if ( ! is_wp_error( $default_query->posts ) && ! empty( $default_query->posts ) ) {
			$post_ids = array_merge( $post_ids, $default_query->posts );
		}

		// 2. Get latest posts per top category and subcategory to ensure client-side filter works when posts_number is low
		if ( ! empty( $top_categories ) ) {
			foreach ( $top_categories as $cat ) {
				$cat_query = new \WP_Query( [
					'post_type'      => $post_type,
					'posts_per_page' => 100,
					'post_status'    => 'publish',
					'fields'         => 'ids',
					'tax_query'      => [
						[
							'taxonomy' => $taxonomy,
							'field'    => 'term_id',
							'terms'    => $cat->term_id,
						],
					],
				] );
				if ( ! is_wp_error( $cat_query->posts ) && ! empty( $cat_query->posts ) ) {
					$post_ids = array_merge( $post_ids, $cat_query->posts );
				}

				// Get latest posts per subcategory
				if ( ! empty( $sub_categories[ $cat->term_id ] ) ) {
					foreach ( $sub_categories[ $cat->term_id ] as $subcat ) {
						$subcat_query = new \WP_Query( [
							'post_type'      => $post_type,
							'posts_per_page' => 100,
							'post_status'    => 'publish',
							'fields'         => 'ids',
							'tax_query'      => [
								[
									'taxonomy' => $taxonomy,
									'field'    => 'term_id',
									'terms'    => $subcat->term_id,
								],
							],
						] );
						if ( ! is_wp_error( $subcat_query->posts ) && ! empty( $subcat_query->posts ) ) {
							$post_ids = array_merge( $post_ids, $subcat_query->posts );
						}
					}
				}

				// Also query posts directly assigned to this top category (not in any child category)
				$child_term_ids = [];
				if ( ! empty( $sub_categories[ $cat->term_id ] ) ) {
					foreach ( $sub_categories[ $cat->term_id ] as $subcat ) {
						$child_term_ids[] = $subcat->term_id;
					}
				}

				$direct_tax_query = [
					[
						'taxonomy' => $taxonomy,
						'field'    => 'term_id',
						'terms'    => $cat->term_id,
					]
				];

				if ( ! empty( $child_term_ids ) ) {
					$direct_tax_query['relation'] = 'AND';
					$direct_tax_query[] = [
						'taxonomy' => $taxonomy,
						'field'    => 'term_id',
						'terms'    => $child_term_ids,
						'operator' => 'NOT IN',
					];
				}

				$direct_query = new \WP_Query( [
					'post_type'      => $post_type,
					'posts_per_page' => 100,
					'post_status'    => 'publish',
					'fields'         => 'ids',
					'tax_query'      => $direct_tax_query,
				] );
				if ( ! is_wp_error( $direct_query->posts ) && ! empty( $direct_query->posts ) ) {
					$post_ids = array_merge( $post_ids, $direct_query->posts );
				}
			}
		}

		$post_ids = array_unique( $post_ids );

		if ( ! empty( $post_ids ) ) {
			$query_args = [
				'post_type'      => $post_type,
				'post__in'       => $post_ids,
				'posts_per_page' => -1,
				'post_status'    => 'publish',
				'orderby'        => 'date',
				'order'          => 'DESC',
			];
			$query = new \WP_Query( $query_args );
		} else {
			$query = new \WP_Query();
		}

		// Calculate the exact number of posts to display to fill the row gaps with actual posts
		$posts_to_show = 0;
		$post_spans = [];
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$size = get_post_meta( get_the_ID(), 'portfolio_pb_size', true );
				$span = ( '2x1' === $size || '2x2' === $size ) ? 2 : 1;
				$post_spans[] = $span;
			}
			$query->rewind_posts();
		}

		$total_queried = count( $post_spans );
		if ( $total_queried > 0 ) {
			$current_span_sum = 0;
			$found_fill = false;
			for ( $i = 0; $i < $total_queried; $i++ ) {
				$current_span_sum += $post_spans[$i];
				if ( ($i + 1) >= $posts_number ) {
					if ( $current_span_sum % $grid_columns_int === 0 ) {
						$posts_to_show = $i + 1;
						$found_fill = true;
						break;
					}
				}
			}
			if ( ! $found_fill ) {
				$posts_to_show = min( $total_queried, $posts_number );
			}
		} else {
			$posts_to_show = $posts_number;
		}

		$posts_html = '';
		$post_categories_map = [];
		$post_count = 0;

		// Pre-scan to identify the first video post ID visible in the default "All" tab (within the first posts_to_show)
		$first_video_id = 0;


		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id    = get_the_ID();
				$post_title = get_the_title();
				$post_link  = get_permalink();

				$post_count++;
				$display_style = ( $post_count <= $posts_to_show ) ? '' : ' style="display: none;"';

				// Get category IDs for the post
				$post_terms     = get_the_terms( $post_id, $taxonomy );
				$post_term_ids  = [];
				if ( ! is_wp_error( $post_terms ) && ! empty( $post_terms ) ) {
					foreach ( $post_terms as $t ) {
						$post_term_ids[] = $t->term_id;
						$ancestors = get_ancestors( $t->term_id, $taxonomy );
						if ( ! empty( $ancestors ) ) {
							$post_term_ids = array_merge( $post_term_ids, $ancestors );
						}
					}
				}
				$post_term_ids = array_unique( $post_term_ids );
				$post_categories_map[] = $post_term_ids;
				$categories_attr = implode( ',', $post_term_ids );

				// Thumbnail image
				if ( has_post_thumbnail( $post_id ) ) {
					$thumbnail = get_the_post_thumbnail(
						$post_id,
						'medium',
						[
							'class' => 'cg_portfolio_pb__thumbnail',
						]
					);
				} else {
					$thumbnail = sprintf(
						'<div class="cg_portfolio_pb__thumbnail-placeholder"><span class="placeholder-icon">🖼️</span></div>'
					);
				}

				$original_size = get_post_meta( $post_id, 'portfolio_pb_size', true );
				if ( empty( $original_size ) ) {
					$original_size = 'regular';
				}

				// Click Action View Pattern
				$view_type = get_post_meta( $post_id, 'portfolio_pb_view_type', true );
				if ( empty( $view_type ) ) {
					$view_type = 'lightbox';
				}

				$is_video_card = ( 'video' === $view_type );
				$is_first_video = ( $post_id === $first_video_id );
				$size = $original_size;

				$card_classes = [ 'cg_portfolio_pb__card' ];
				if ( '2x1' === $size ) {
					$card_classes[] = 'cg_portfolio_pb__card--2x1';
				} elseif ( '2x2' === $size ) {
					$card_classes[] = 'cg_portfolio_pb__card--2x2';
				} elseif ( '1x2' === $size ) {
					$card_classes[] = 'cg_portfolio_pb__card--1x2';
				} else {
					$card_classes[] = 'cg_portfolio_pb__card--regular';
				}

				if ( $is_video_card ) {
					$card_classes[] = 'cg_portfolio_pb__card--video-active';
				}

				$new_tab_attr = ( 'on' === $open_in_new_tab ) ? ' target="_blank" rel="noopener noreferrer"' : '';
				$extra_attrs = '';
				$btn_class = 'cg_portfolio_pb__card-view-btn cg_portfolio_pb__card-view-btn--icon';

				$image_svg = '<svg class="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
				$video_svg = '<svg class="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>';
				$link_svg  = '<svg class="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';

				if ( 'lightbox' === $view_type ) {
					$full_img_url = wp_get_attachment_image_url( get_post_thumbnail_id( $post_id ), 'full' );
					$post_link = ! empty( $full_img_url ) ? $full_img_url : '#';
					$card_classes[] = 'cg_portfolio_pb__card--lightbox';
					$btn_content = $image_svg;
				} elseif ( 'video' === $view_type ) {
					$video_url = get_post_meta( $post_id, 'portfolio_pb_video_url', true );
					$post_link = ! empty( $video_url ) ? $video_url : '#';
					$card_classes[] = 'cg_portfolio_pb__card--video';
					$btn_content = $video_svg;
				} elseif ( 'external' === $view_type ) {
					$ext_url = get_post_meta( $post_id, 'portfolio_pb_external_url', true );
					$post_link = ! empty( $ext_url ) ? $ext_url : '#';
					$extra_attrs = $new_tab_attr;
					$btn_content = $link_svg;
				} elseif ( 'custom' === $view_type ) {
					$custom_id = get_post_meta( $post_id, 'portfolio_pb_custom_post_id', true );
					if ( ! empty( $custom_id ) ) {
						$post_link = get_permalink( $custom_id );
					}
					$extra_attrs = $new_tab_attr;
					$btn_content = $link_svg;
				} else {
					$extra_attrs = $new_tab_attr;
					$btn_content = $link_svg;
				}

				$iframe_html = '';
				$thumbnail_html = $thumbnail;

				// Hover Overlay
				$overlay = sprintf(
					'<div class="cg_portfolio_pb__overlay">
						<button type="button" class="cg_portfolio_pb__overlay-close" aria-label="Hide overlay">&times;</button>
						<div class="cg_portfolio_pb__overlay-content">
							<h4 class="cg_portfolio_pb__card-title">%s</h4>
							<span class="%s">%s</span>
						</div>
					</div>',
					esc_html( $post_title ),
					esc_attr( $btn_class ),
					$btn_content
				);

				$show_modal_btn = '';
				if ( 'video' === $view_type || 'lightbox' === $view_type ) {
					$show_modal_btn = sprintf(
						'<button type="button" class="cg_portfolio_pb__show-modal-trigger" aria-label="Open gallery modal">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
						</button>'
					);
				}

				$classes_attr = implode( ' ', $card_classes );

				$posts_html .= sprintf(
					'<a href="%s" class="%s" data-categories="%s" data-original-size="%s"%s%s>
						<div class="cg_portfolio_pb__thumbnail-wrapper">
							%s
							%s
							%s
							%s
						</div>
					</a>',
					esc_url( $post_link ),
					esc_attr( $classes_attr ),
					esc_attr( $categories_attr ),
					esc_attr( $original_size ),
					$display_style,
					$extra_attrs,
					$thumbnail_html,
					$overlay,
					$iframe_html,
					$show_modal_btn
				);

			}
			wp_reset_postdata();
		} else {
			$posts_html = sprintf(
				'<div class="cg_portfolio_pb__empty">%s</div>',
				esc_html__( 'No items found.', 'cg-divi5-modules' )
			);
		}

		// Compile tabs
		$tabs_html = sprintf(
			'<button type="button" class="cg_portfolio_pb__tab active" data-cat-id="all">%s</button>',
			esc_html__( 'All', 'cg-divi5-modules' )
		);
		foreach ( $top_categories as $cat ) {
			$tabs_html .= sprintf(
				'<button type="button" class="cg_portfolio_pb__tab" data-cat-id="%d">%s</button>',
				$cat->term_id,
				esc_html( $cat->name )
			);
		}

		// Compile subcategory radio filters
		$radios_html = '';
		foreach ( $top_categories as $parent_cat ) {
			$parent_id = $parent_cat->term_id;
			if ( ! empty( $sub_categories[ $parent_id ] ) ) {
				$radios_group_html = '';
				$visible_subcats_count = 0;

				// Check if there are posts directly assigned to this parent category (and not in any child category)
				$child_ids = [];
				foreach ( $sub_categories[ $parent_id ] as $subcat ) {
					$child_ids[] = $subcat->term_id;
				}

				$has_direct_post = false;
				foreach ( $post_categories_map as $post_cats ) {
					if ( in_array( $parent_id, $post_cats ) ) {
						$belongs_to_child = false;
						foreach ( $child_ids as $child_id ) {
							if ( in_array( $child_id, $post_cats ) ) {
								$belongs_to_child = true;
								break;
							}
						}
						if ( ! $belongs_to_child ) {
							$has_direct_post = true;
							break;
						}
					}
				}

				// If hide empty is off OR we have at least one direct post, add the direct parent category pill
				if ( 'off' === $hide_empty_subcats || $has_direct_post ) {
					$visible_subcats_count++;
					$label_text = $parent_cat->name;
					if ( 'direct' === $direct_subcat_label ) {
						$label_text = esc_html__( 'Direct', 'cg-divi5-modules' );
					} elseif ( 'other' === $direct_subcat_label ) {
						$label_text = esc_html__( 'Other', 'cg-divi5-modules' );
					}

					$radios_group_html .= sprintf(
						'<label class="cg_portfolio_pb__radio-pill">
							<input type="radio" name="cg_portfolio_pb_subcat_%s_%d" value="direct" />
							<span>%s</span>
						</label>',
						esc_attr( $module_id ),
						$parent_id,
						esc_html( $label_text )
					);
				}

				foreach ( $sub_categories[ $parent_id ] as $subcat ) {
					if ( 'on' === $hide_empty_subcats ) {
						$has_post = false;
						foreach ( $post_categories_map as $post_cats ) {
							if ( in_array( $parent_id, $post_cats ) && in_array( $subcat->term_id, $post_cats ) ) {
								$has_post = true;
								break;
							}
						}
						if ( ! $has_post ) {
							continue; // Skip empty subcategory for this parent tab
						}
					}

					$visible_subcats_count++;
					$radios_group_html .= sprintf(
						'<label class="cg_portfolio_pb__radio-pill">
							<input type="radio" name="cg_portfolio_pb_subcat_%s_%d" value="%d" />
							<span>%s</span>
						</label>',
						esc_attr( $module_id ),
						$parent_id,
						$subcat->term_id,
						esc_html( $subcat->name )
					);
				}

				if ( $visible_subcats_count > 0 ) {
					$all_pill_html = sprintf(
						'<label class="cg_portfolio_pb__radio-pill checked">
							<input type="radio" name="cg_portfolio_pb_subcat_%s_%d" value="all" checked />
							<span>%s</span>
						</label>',
						esc_attr( $module_id ),
						$parent_id,
						esc_html__( 'All', 'cg-divi5-modules' )
					);

					$radios_html .= sprintf(
						'<div class="cg_portfolio_pb__radios-container" data-parent-cat-id="%d" style="display: none;">
							%s%s
						</div>',
						$parent_id,
						$all_pill_html,
						$radios_group_html
					);
				}
			}
		}

		// Setup inline styles
		$inline_styles = sprintf(
			'--portfolio-accent-color: %s;',
			esc_attr( $active_color )
		);

		// Combine parts
		$load_more_btn_html = '';
		if ( 'on' === $show_load_more ) {
			$btn_style = ( $post_count > $posts_to_show ) ? '' : ' style="display: none;"';
			$load_more_btn_html = sprintf(
				'<div class="cg_portfolio_pb__load-more-container"%s>
					<button type="button" class="cg_portfolio_pb__load-more-btn">%s</button>
				</div>',
				$btn_style,
				esc_html( $load_more_text )
			);
		}

		$grid_class_extra = '';

		$content_html = sprintf(
			'<div class="cg_portfolio_pb__wrapper" style="%s" data-pause-on-tab-switch="%s">
				<div class="cg_portfolio_pb__tabs-container">
					%s
				</div>
				%s
				<div class="cg_portfolio_pb__grid cg_portfolio_pb__grid--cols-%s%s" data-posts-limit="%d">
					%s
				</div>
				%s
			</div>',
			$inline_styles,
			esc_attr( $pause_on_tab_switch ),
			$tabs_html,
			$radios_html,
			esc_attr( $grid_columns ),
			$grid_class_extra,
			$posts_to_show,
			$posts_html,
			$load_more_btn_html
		);


		$parent       = BlockParserStore::get_parent( $block->parsed_block['id'], $block->parsed_block['storeInstance'] );
		$parent_attrs = $parent ? ( $parent->attrs ?? [] ) : [];

		return Module::render(
			[
				'orderIndex'          => $block->parsed_block['orderIndex'],
				'storeInstance'       => $block->parsed_block['storeInstance'],
				'attrs'               => $attrs,
				'elements'            => $elements,
				'id'                  => $block->parsed_block['id'],
				'name'                => $block->block_type->name,
				'moduleCategory'      => $block->block_type->category,
				'classnamesFunction'  => [ PortfolioPB::class, 'module_classnames' ],
				'stylesComponent'     => [ PortfolioPB::class, 'module_styles' ],
				'scriptDataComponent' => [ PortfolioPB::class, 'module_script_data' ],
				'parentAttrs'         => $parent_attrs,
				'parentId'            => $parent ? ( $parent->id ?? '' ) : '',
				'parentName'          => $parent ? ( $parent->blockName ?? '' ) : '',
				'children'            => [
					ElementComponents::component(
						[
							'attrs'         => $attrs['module']['decoration'] ?? [],
							'id'            => $block->parsed_block['id'],
							'orderIndex'    => $block->parsed_block['orderIndex'],
							'storeInstance' => $block->parsed_block['storeInstance'],
						]
					),
					$content_html,
				],
			]
		);
	}
}
