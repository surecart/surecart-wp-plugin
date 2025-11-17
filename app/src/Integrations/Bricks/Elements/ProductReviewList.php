<?php

namespace SureCart\Integrations\Bricks\Elements;

use SureCart\Integrations\Bricks\Concerns\ConvertsBlocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Product Review List element.
 */
class ProductReviewList extends \Bricks\Element {
	use ConvertsBlocks;

	/**
	 * Element category.
	 *
	 * @var string
	 */
	public $category = 'SureCart Elements';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'surecart-product-review-list';

	/**
	 * Element block name.
	 *
	 * @var string
	 */
	public $block_name = 'surecart/product-review-list';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-list';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Product Review List', 'surecart' );
	}

	/**
	 * Set control groups.
	 *
	 * @return void
	 */
	public function set_control_groups() {
		$this->control_groups['review_header'] = [
			'title' => esc_html__( 'Review Header', 'surecart' ),
			'tab'   => 'content',
		];

		$this->control_groups['review_button'] = [
			'title'    => esc_html__( 'Review Button', 'surecart' ),
			'tab'      => 'content',
			'required' => [ 'show_add_button', '=', true ],
		];

		$this->control_groups['review_content'] = [
			'title' => esc_html__( 'Review Content', 'surecart' ),
			'tab'   => 'content',
		];

		$this->control_groups['pagination'] = [
			'title' => esc_html__( 'Pagination', 'surecart' ),
			'tab'   => 'content',
		];
	}

	/**
	 * Set controls.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['show_header'] = [
			'tab'     => 'content',
			'group'   => 'review_header',
			'label'   => esc_html__( 'Show Header', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_sidebar'] = [
			'tab'     => 'content',
			'group'   => 'review_header',
			'label'   => esc_html__( 'Show Filter & Sidebar', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_add_button'] = [
			'tab'     => 'content',
			'group'   => 'review_header',
			'label'   => esc_html__( 'Show Add Review Button', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['add_button_label'] = [
			'tab'      => 'content',
			'group'    => 'review_button',
			'label'    => esc_html__( 'Button Text', 'surecart' ),
			'type'     => 'text',
			'default'  => esc_html__( 'Write a Review', 'surecart' ),
			'required' => [ 'show_add_button', '=', true ],
		];

		$this->controls['add_button_icon_size'] = [
			'tab'         => 'content',
			'group'       => 'review_button',
			'label'       => esc_html__( 'Icon Size', 'surecart' ),
			'type'        => 'number',
			'default'     => 15,
			'min'         => 10,
			'max'         => 100,
			'step'        => 1,
			'required'    => [ 'show_add_button', '=', true ],
			'description' => esc_html__( 'Size of the icon in pixels.', 'surecart' ),
		];

		$this->controls['add_button_text_color'] = [
			'tab'      => 'content',
			'group'    => 'review_button',
			'label'    => esc_html__( 'Button Text Color', 'surecart' ),
			'type'     => 'color',
			'reset'    => true,
			'required' => [ 'show_add_button', '=', true ],
		];

		$this->controls['add_button_background_color'] = [
			'tab'      => 'content',
			'group'    => 'review_button',
			'label'    => esc_html__( 'Button Background Color', 'surecart' ),
			'type'     => 'color',
			'reset'    => true,
			'required' => [ 'show_add_button', '=', true ],
		];

		$this->controls['show_review_date'] = [
			'tab'     => 'content',
			'group'   => 'review_content',
			'label'   => esc_html__( 'Show Review Date', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		$this->controls['show_content'] = [
			'tab'     => 'content',
			'group'   => 'review_content',
			'label'   => esc_html__( 'Show Review Content', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];

		// Rating stars fill color for content stars.
		$this->controls['rating_fill_color'] = [
			'tab'      => 'content',
			'group'    => 'review_content',
			'label'    => esc_html__( 'Star Color', 'surecart' ),
			'type'     => 'color',
			'rerender' => true,
			'default'  => [
				'hex' => 'var(--bricks-color-primary)',
			],
			'reset'    => true,
		];

		$this->controls['no_reviews_text'] = [
			'tab'         => 'content',
			'group'       => 'review_content',
			'label'       => esc_html__( 'No Reviews Text', 'surecart' ),
			'type'        => 'text',
			'default'     => esc_html__( 'No reviews yet, write one now?', 'surecart' ),
			'placeholder' => esc_html__( 'Enter text for when no reviews exist', 'surecart' ),
		];

		$this->controls['show_pagination'] = [
			'tab'     => 'content',
			'group'   => 'pagination',
			'label'   => esc_html__( 'Show Pagination', 'surecart' ),
			'type'    => 'checkbox',
			'default' => true,
		];
	}

	/**
	 * Render element.
	 *
	 * @return void
	 */
	public function render() {
		$show_header     = ! empty( $this->settings['show_header'] );
		$show_sidebar    = ! empty( $this->settings['show_sidebar'] );
		$show_add_button = ! empty( $this->settings['show_add_button'] );
		$show_pagination = ! empty( $this->settings['show_pagination'] );
		$show_date       = ! empty( $this->settings['show_review_date'] );
		$show_content    = ! empty( $this->settings['show_content'] );
		$no_reviews_text = ! empty( $this->settings['no_reviews_text'] ) ? $this->settings['no_reviews_text'] : esc_html__( 'No reviews yet, write one now?', 'surecart' );

		if ( $this->is_admin_editor() ) {
			$this->render_preview( $show_header, $show_sidebar, $show_add_button, $show_date, $show_content, $show_pagination );
			return;
		}

		echo do_blocks( $this->get_review_list_content( $show_header, $show_sidebar, $show_add_button, $show_pagination, $show_date, $show_content, $no_reviews_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Get the review list block content.
	 *
	 * @param bool   $show_header     Show header.
	 * @param bool   $show_sidebar    Show sidebar.
	 * @param bool   $show_add_button Show add button.
	 * @param bool   $show_pagination Show pagination.
	 * @param bool   $show_date       Show date.
	 * @param bool   $show_content    Show content.
	 * @param string $no_reviews_text No reviews text.
	 *
	 * @return string
	 */
	private function get_review_list_content( $show_header, $show_sidebar, $show_add_button, $show_pagination, $show_date, $show_content, $no_reviews_text ) {
		$fill_color = $this->get_raw_color( 'rating_fill_color' );
		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}
		$product = sc_get_product();
		if ( empty( $product ) || empty( $product->total_reviews ) ) {
			$fill_color = 'none';
		}

		$rendered_attributes = $this->get_block_rendered_attributes();

		$content = '<!-- wp:surecart/product-review-list {"metadata":{"categories":["surecart_review_list"],"patternName":"surecart-product-review-standard","name":"Default Review List"},"className":"' . esc_attr( $rendered_attributes['class'] ) . '","anchor":"' . esc_attr( $rendered_attributes['id'] ) . '"} -->';

		// Header.
		if ( $show_header ) {
			$content .= '<!-- wp:surecart/product-review-list-content-header {"style":{"border":{"bottom":{"color":"#eeeeee","width":"1px"}},"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","orientation":"horizontal","verticalAlignment":"top","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
			$content .= $show_sidebar ? '<!-- wp:surecart/product-review-list-sidebar-toggle {"label":"Filters","style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->' : '&nbsp;';

			if ( $show_add_button ) {
				$btn_label      = ! empty( $this->settings['add_button_label'] ) ? $this->settings['add_button_label'] : esc_html__( 'Write a Review', 'surecart' );
				$btn_icon_size  = ! empty( $this->settings['add_button_icon_size'] ) ? absint( $this->settings['add_button_icon_size'] ) : 15;
				$btn_text_color = ! empty( $this->settings['add_button_text_color'] ) ? $this->get_raw_color( 'add_button_text_color' ) : '#000000';
				$btn_bg_color   = ! empty( $this->settings['add_button_background_color'] ) ? $this->get_raw_color( 'add_button_background_color' ) : 'var(--bricks-color-primary)';

				$btn_attrs = [
					'width'     => 100,
					'className' => 'is-style-fill',
					'label'     => $btn_label,
					'icon_size' => $btn_icon_size,
				];

				// spacing default.
				$style = [ 'spacing' => [ 'blockGap' => 'var:preset|spacing|30' ] ];

				if ( $btn_text_color || $btn_bg_color ) {
					$style['color'] = [];
					if ( $btn_text_color ) {
						$style['color']['text'] = $btn_text_color;
					}
					if ( $btn_bg_color ) {
						$style['color']['background'] = $btn_bg_color;
					}
				} else {
					// default (theme preset).
					$style                        = [
						'elements' => [ 'link' => [ 'color' => [ 'text' => 'var:preset|color|white' ] ] ],
						'spacing'  => [ 'blockGap' => 'var:preset|spacing|30' ],
					];
					$btn_attrs['backgroundColor'] = 'surecart';
					$btn_attrs['textColor']       = 'white';
				}

				$btn_attrs['style'] = $style;

				$content .= '<!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /--></div><!-- /wp:group -->';
			}

			$content .= '<!-- /wp:surecart/product-review-list-content-header -->';
		}

		// Content with Sidebar.
		$content .= '<!-- wp:surecart/product-review-list-content {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}}} -->';

		// Sidebar.
		if ( $show_sidebar ) {
			$content .= '<!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"300px","type":"flex","orientation":"vertical"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"var:preset|spacing|60"}},"layout":{"type":"flex","orientation":"vertical"}} -->';
			$content .= '<div class="wp-block-surecart-product-review-list-sidebar"><!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags-template {"layout":{"type":"flex","orientation":"horizontal"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tag /-->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-tags-template -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline"}}} /-->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-tags -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->';
			$content .= '<!-- wp:surecart/product-review-list-filter-checkbox /-->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->';
			$content .= '<!-- /wp:surecart/product-review-list-filter-checkboxes --></div>';
			$content .= '<!-- /wp:surecart/product-review-list-sidebar -->';
		}

		// Review Template.
		$date_block    = $show_date ? '<!-- wp:surecart/product-review-date {"format":"human-diff"} /-->' : '';
		$content_block = $show_content ? '<!-- wp:surecart/product-review-content /-->' : '';

		$content .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0px"},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical"}} -->';
		$content .= '<div class="wp-block-group"><!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->';
		$content .= '<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20","margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"constrained"}} -->';
		$content .= '<div class="wp-block-group" style="border-bottom-color:#e5e7eb;border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
		$content .= '<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$content .= '<div class="wp-block-group"><!-- wp:surecart/product-review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"},"blockGap":"var:preset|spacing|20"},"typography":{"fontStyle":"normal","fontWeight":"500"}}} /-->';
		$content .= '<!-- wp:surecart/product-review-verified-badge {"icon_size":16,"style":{"typography":{"fontStyle":"normal","fontWeight":"400"},"spacing":{"blockGap":"var:preset|spacing|30"},"layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center","orientation":"horizontal"}} /--></div>';
		$content .= '<!-- /wp:group -->' . $date_block . '</div>';
		$content .= '<!-- /wp:group -->';
		$content .= '<!-- wp:surecart/product-review-rating-stars {"fill_color":"' . esc_attr( $fill_color ) . '"}  /-->';
		$content .= '<!-- wp:surecart/product-review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->';
		$content .= $content_block . '</div>';
		$content .= '<!-- /wp:group -->';
		$content .= '<!-- /wp:surecart/product-review-template --></div>';
		$content .= '<!-- /wp:group -->';
		$content .= '<!-- /wp:surecart/product-review-list-content -->';

		$content .= '<!-- wp:surecart/product-review-list-no-reviews -->';
		$content .= '<!-- wp:paragraph {"align":"left","placeholder":"Add text or blocks that will display when a query returns no reviews."} -->';
		$content .= '<p class="has-text-align-left">' . esc_html( $no_reviews_text ) . '</p><!-- /wp:paragraph -->';
		$content .= '<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->';

		// no-reviews button with configured attributes.
		$btn_label      = ! empty( $this->settings['add_button_label'] ) ? $this->settings['add_button_label'] : esc_html__( 'Write a Review', 'surecart' );
		$btn_icon_size  = ! empty( $this->settings['add_button_icon_size'] ) ? absint( $this->settings['add_button_icon_size'] ) : 15;
		$btn_text_color = ! empty( $this->settings['add_button_text_color'] ) ? $this->get_raw_color( 'add_button_text_color' ) : '#000000';
		$btn_bg_color   = ! empty( $this->settings['add_button_background_color'] ) ? $this->get_raw_color( 'add_button_background_color' ) : 'var(--bricks-color-primary)';

		$btn_attrs = [
			'width'     => 100,
			'className' => 'is-style-fill',
			'label'     => $btn_label,
			'icon_size' => $btn_icon_size,
		];

		$style = [ 'spacing' => [ 'blockGap' => 'var:preset|spacing|30' ] ];
		if ( $btn_text_color || $btn_bg_color ) {
			$style['color'] = [];
			if ( $btn_text_color ) {
				$style['color']['text'] = $btn_text_color;
			}
			if ( $btn_bg_color ) {
				$style['color']['background'] = $btn_bg_color;
			}
		} else {
			$style                        = [
				'elements' => [ 'link' => [ 'color' => [ 'text' => 'var:preset|color|white' ] ] ],
				'spacing'  => [ 'blockGap' => 'var:preset|spacing|30' ],
			];
			$btn_attrs['backgroundColor'] = 'surecart';
			$btn_attrs['textColor']       = 'white';
		}

		$btn_attrs['style'] = $style;

		$content .= '<div class="wp-block-group"><!-- wp:surecart/product-review-add-button ' . wp_json_encode( $btn_attrs ) . ' /--></div>';
		$content .= '<!-- /wp:group -->';
		$content .= '<!-- /wp:surecart/product-review-list-no-reviews -->';

		// Pagination.
		if ( $show_pagination ) {
			$content .= '<!-- wp:surecart/product-review-pagination -->
			<!-- wp:surecart/product-review-pagination-previous /-->
			<!-- wp:surecart/product-review-pagination-numbers /-->
			<!-- wp:surecart/product-review-pagination-next /-->
			<!-- /wp:surecart/product-review-pagination -->';
		}

		$content .= '<!-- /wp:surecart/product-review-list -->';

		return $content;
	}

	/**
	 * Render preview in editor.
	 *
	 * @param bool $show_header     Show header.
	 * @param bool $show_sidebar    Show sidebar.
	 * @param bool $show_add_button Show add button.
	 * @param bool $show_date       Show date.
	 * @param bool $show_content    Show content.
	 * @param bool $show_pagination Show pagination.
	 *
	 * @return void
	 */
	private function render_preview( $show_header, $show_sidebar, $show_add_button, $show_date, $show_content, $show_pagination ) {
		$content    = '<div class="wp-block-surecart-product-review-list" style="padding: 20px;">';
		$fill_color = $this->get_raw_color( 'rating_fill_color' );
		if ( empty( $fill_color ) ) {
			$fill_color = 'var(--bricks-color-primary)';
		}

		// Header.
		if ( $show_header ) {
			$content .= '<div style="border-bottom: 1px solid #eeeeee; padding: 20px 0; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">';

			if ( $show_sidebar ) {
				$content .= '<div style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">';
				$content .= wp_kses(
					\SureCart::svg()->get(
						'sliders',
						[
							'aria-label' => __( 'Open sidebar', 'surecart' ),
							'width'      => 16,
							'height'     => 16,
							'class'      => 'sc-sidebar-toggle__icon',
						]
					),
					sc_allowed_svg_html()
				);
				$content .= '<span>' . esc_html__( 'Filters', 'surecart' ) . '</span>';
				$content .= '</div>';
			} else {
				// Ensure left side still has something when no sidebar is shown.
				$content .= '&nbsp;';
			}

			if ( $show_add_button ) {
				$btn_label      = ! empty( $this->settings['add_button_label'] ) ? $this->settings['add_button_label'] : esc_html__( 'Write a Review', 'surecart' );
				$btn_text_color = ! empty( $this->settings['add_button_text_color'] ) ? $this->get_raw_color( 'add_button_text_color' ) : '#000000';
				$btn_bg_color   = ! empty( $this->settings['add_button_background_color'] ) ? $this->get_raw_color( 'add_button_background_color' ) : 'var(--bricks-color-primary)';

				$content .= '<div style="padding: 10px 20px; background: ' . esc_attr( $btn_bg_color ) . '; color: ' . esc_attr( $btn_text_color ) . '; border-radius: 50px; display: inline-flex; align-items: center; gap: 8px;">';
				$content .= wp_kses(
					\SureCart::svg()->get(
						'edit-2',
						[
							'aria-label' => __( 'Add Review', 'surecart' ),
							'width'      => 16,
							'height'     => 16,
						]
					),
					sc_allowed_svg_html()
				);
				$content .= '<span>' . esc_html( $btn_label ) . '</span>';
				$content .= '</div>';
			}

			$content .= '</div>';
		}

		// Main content area.
		$content .= '<div style="display: flex; gap: 30px; margin-bottom: 20px;">';

		// Sidebar.
		if ( $show_sidebar ) {
			$content .= '<div style="width: 250px; min-width: 250px;">';
			$content .= '<div style="margin-bottom: 20px;"><div style="font-weight: 600; margin-bottom: 10px;">' . esc_html__( 'Active Filters', 'surecart' ) . '</div>';
			$content .= '<div style="display: flex; gap: 8px; flex-wrap: wrap;">';
			$content .= '<span style="padding: 6px 12px; background: #f3f4f6; border-radius: 16px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;">5 Stars';
			$content .= wp_kses(
				\SureCart::svg()->get(
					'x',
					[
						'class'      => 'sc-tag__clear',
						'aria-label' => __( 'Remove tag', 'surecart' ),
						'width'      => 12,
					]
				),
				sc_allowed_svg_html()
			);
			$content .= '</span></div>';
			$content .= '<div style="margin-top: 10px; text-decoration: underline; font-size: 14px; cursor: pointer; color: var(--bricks-color-primary, #6c63ff);">' . esc_html__( 'Clear All', 'surecart' ) . '</div>';
			$content .= '</div>';
			$content .= '<div><div style="font-weight: 600; margin-bottom: 12px;">' . esc_html__( 'Filter by', 'surecart' ) . '</div>';
			$content .= '<div style="display: flex; flex-direction: column; gap: 10px;">';
			for ( $i = 5; $i >= 1; $i-- ) {
				$content .= '<label style="display: flex; align-items: center; gap: 8px;"><input type="checkbox" style="width: 16px; height: 16px;"/><span>' . esc_html( $i . ' Stars' ) . '</span></label>';
			}
			$content .= '</div></div>';
			$content .= '</div>';
		}

		// Reviews.
		$content .= '<div style="flex: 1;">';
		for ( $i = 0; $i < 2; $i++ ) {
			$content .= '<div style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">';
			$content .= '<div style="display: flex; justify-content: space-between; margin-bottom: 12px;">';
			$content .= '<div style="display: flex; gap: 10px; align-items: center;">';
			$content .= '<span style="font-weight: 500;">' . esc_html__( 'John Doe', 'surecart' ) . '</span>';
			$content .= '<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 14px;">';
			$content .= esc_html__( 'Verified Buyer', 'surecart' );
			$content .= wp_kses(
				\SureCart::svg()->get(
					'verified',
					[
						'width'  => 16,
						'height' => 16,
					]
				),
				sc_allowed_svg_html()
			);
			$content .= '</span></div>';
			if ( $show_date ) {
				$content .= '<span style="color: #6b7280; font-size: 14px;">' . esc_html__( '2 days ago', 'surecart' ) . '</span>';
			}
			$content .= '</div>';

			// Stars.
			$content .= '<div style="display: inline-flex; gap: 2px; margin-bottom: 8px;">';
			for ( $s = 1; $s <= 5; $s++ ) {
				$content .= wp_kses(
					\SureCart::svg()->get(
						'star',
						[
							'width'  => 16,
							'height' => 16,
							'fill'   => ( $s <= 4 ) ? $fill_color : 'none',
							'stroke' => $fill_color,
						]
					),
					sc_allowed_svg_html()
				);
			}
			$content .= '</div>';

			$content .= '<div style="font-weight: 700; margin-bottom: 8px;">' . esc_html__( 'Great Product!', 'surecart' ) . '</div>';
			if ( $show_content ) {
				$content .= '<p style="color: #4b5563; margin: 0; line-height: 1.6;">' . esc_html__( 'This is an excellent product. I highly recommend it to anyone looking for quality and reliability.', 'surecart' ) . '</p>';
			}
			$content .= '</div>';
		}
		$content .= '</div>';

		$content .= '</div>';

		// Pagination.
		if ( $show_pagination ) {
			$content .= '<nav style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 20px;">';
			$content .= '<div style="padding: 10px 16px; background: #f9fafb; border-radius: 4px;">' . esc_html__( 'Previous', 'surecart' ) . '</div>';
			$content .= '<div style="display: flex; gap: 4px;"><span style="padding: 8px 12px;">1</span><span style="padding: 8px 12px; opacity: 0.5;">2</span><span style="padding: 8px 12px; opacity: 0.5;">3</span></div>';
			$content .= '<div style="padding: 10px 16px; background: #f9fafb; border-radius: 4px;">' . esc_html__( 'Next', 'surecart' ) . '</div>';
			$content .= '</nav>';
		}
		$content .= '</div>';

		echo $this->preview( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$content,
			'',
			'div'
		);
	}
}
