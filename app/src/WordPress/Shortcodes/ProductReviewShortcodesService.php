<?php

namespace SureCart\WordPress\Shortcodes;

/**
 * Handles product review shortcode rendering with product context.
 */
class ProductReviewShortcodesService {

	/**
	 * The shortcodes service.
	 *
	 * @var ShortcodesService
	 */
	protected $shortcodes_service;

	/**
	 * Constructor.
	 *
	 * @param ShortcodesService $shortcodes_service The shortcodes service.
	 */
	public function __construct( ShortcodesService $shortcodes_service ) {
		$this->shortcodes_service = $shortcodes_service;
	}

	/**
	 * Render a block with product context.
	 *
	 * Sets up the product query var so that sc_get_product() works
	 * in block controllers, then renders the block and restores context.
	 *
	 * @param string $block_name The block name.
	 * @param array  $attrs      Shortcode attributes.
	 * @param string $content    Shortcode content.
	 *
	 * @return string
	 */
	public function renderWithProductContext( $block_name, $attrs, $content = '' ) {
		$id = $attrs['id'] ?? null;
		unset( $attrs['id'] );

		$original_product = $this->setupProductContext( $id );

		add_filter( 'should_load_separate_core_block_assets', '__return_false', 11 );
		wp_enqueue_global_styles();
		add_filter( 'doing_it_wrong_trigger_error', [ $this->shortcodes_service, 'removeInteractivityDoingItWrong' ], 10, 2 );

		$output = $this->shortcodes_service->processBlock( $block_name, $attrs, $content );

		remove_filter( 'doing_it_wrong_trigger_error', [ $this->shortcodes_service, 'removeInteractivityDoingItWrong' ], 10 );

		$this->restoreProductContext( $original_product );

		// Strip insignificant whitespace between HTML tags to prevent wpautop from injecting <br> tags.
		return preg_replace( '/>\s+</', '><', $output );
	}

	/**
	 * Render the review list shortcode.
	 *
	 * Builds full inner block markup since the review list block
	 * requires nested blocks to render properly.
	 *
	 * @param array  $attrs   Shortcode attributes.
	 * @param string $content Shortcode content.
	 *
	 * @return string
	 */
	public function renderReviewList( $attrs, $content = '' ) {
		$id = $attrs['id'] ?? null;
		unset( $attrs['id'] );

		$original_product = $this->setupProductContext( $id );

		add_filter( 'should_load_separate_core_block_assets', '__return_false', 11 );
		wp_enqueue_global_styles();
		add_filter( 'doing_it_wrong_trigger_error', [ $this->shortcodes_service, 'removeInteractivityDoingItWrong' ], 10, 2 );

		$block_html = $this->buildReviewListBlockHtml( $attrs );
		$output     = wp_interactivity_process_directives( do_blocks( $block_html ) );

		remove_filter( 'doing_it_wrong_trigger_error', [ $this->shortcodes_service, 'removeInteractivityDoingItWrong' ], 10 );

		$this->restoreProductContext( $original_product );

		// Strip insignificant whitespace between HTML tags to prevent wpautop from injecting <br> tags.
		return preg_replace( '/>\s+</', '><', $output );
	}

	/**
	 * Set up the product context for block rendering.
	 *
	 * Resolves the product from an explicit ID, existing query var, or current post context.
	 * Guards against WP_Error from sc_get_product().
	 *
	 * @param int|string|null $id The product post ID, or null to auto-detect.
	 *
	 * @return mixed The original product query var value (for restoration).
	 */
	protected function setupProductContext( $id ) {
		$original_product = get_query_var( 'surecart_current_product' );
		$product          = null;

		// Resolve product: from explicit id, existing query var, or current post context.
		if ( ! empty( $id ) ) {
			$product = sc_get_product( absint( $id ) );
		} elseif ( empty( $original_product ) ) {
			$product = sc_get_product();
		}

		// Guard against WP_Error and set query var only for valid products.
		if ( ! empty( $product ) && ! is_wp_error( $product ) ) {
			set_query_var( 'surecart_current_product', $product );
		}

		return $original_product;
	}

	/**
	 * Restore the original product context after block rendering.
	 *
	 * @param mixed $original_product The original product query var value.
	 *
	 * @return void
	 */
	protected function restoreProductContext( $original_product ) {
		set_query_var( 'surecart_current_product', $original_product );
	}

	/**
	 * Build the full review list block HTML with all nested inner blocks.
	 *
	 * IMPORTANT: This structure must stay in sync with the block.json `example` field in
	 * packages/blocks-next/src/blocks/product-review-list/block.json.
	 * If the block's inner block structure changes, update this method accordingly.
	 *
	 * @param array $attrs Shortcode attributes.
	 *
	 * @return string
	 */
	protected function buildReviewListBlockHtml( $attrs ) {
		$list_attrs = wp_json_encode(
			array_merge(
				[
					'query' => [
						'perPage' => 15,
						'pages'   => 0,
						'offset'  => 0,
					],
				],
				$attrs
			),
			JSON_FORCE_OBJECT
		);

		$html = '<!-- wp:surecart/product-review-list ' . $list_attrs . ' -->';

		// Heading.
		$html .= '<!-- wp:heading {"level":2,"style":{"spacing":{"margin":{"top":"32px","bottom":"32px"}},"typography":{"lineHeight":"1"}}} -->';
		$html .= '<h2 class="wp-block-heading" style="margin-top:32px;margin-bottom:32px;line-height:1">' . esc_html__( 'Customer Reviews', 'surecart' ) . '</h2>';
		$html .= '<!-- /wp:heading -->';

		// Product Reviews wrapper.
		$html .= '<!-- wp:surecart/product-reviews -->';

		// Summary section.
		$html .= $this->buildSummaryHtml();

		// Header with filter toggle and add button.
		$html .= $this->buildHeaderHtml();

		// Main content area with sidebar and review template.
		$html .= $this->buildMainContentHtml();

		$html .= '<!-- /wp:surecart/product-reviews -->';

		// No reviews section.
		$html .= $this->buildNoReviewsHtml();

		$html .= '<!-- /wp:surecart/product-review-list -->';

		return $html;
	}

	/**
	 * Build the summary section HTML (avg value + stars + total count + breakdown).
	 *
	 * @return string
	 */
	protected function buildSummaryHtml() {
		$html = '<!-- wp:surecart/product-review-summary {"style":{"spacing":{"margin":{"bottom":"15px"}}}} -->';

		// Columns layout.
		$html .= '<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"20px"}}}} -->';
		$html .= '<div class="wp-block-columns">';

		// Left column: avg value + stars + total.
		$html .= '<!-- wp:column {"verticalAlignment":"center","width":"280px"} -->';
		$html .= '<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:280px">';

		$html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"14px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","flexWrap":"nowrap","orientation":"vertical","verticalAlignment":"center"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';

		// Rating value row.
		$html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"5px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"bottom"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';
		$html .= '<!-- wp:surecart/product-review-average-rating-value {"className":"is-style-none","style":{"typography":{"fontStyle":"normal","fontWeight":"600","lineHeight":"1","fontSize":"24px"}}} /-->';
		$html .= '<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.5","fontSize":"14px"},"color":{"text":"#4b5563"},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}}}} -->';
		$html .= '<p class="has-text-color" style="color:#4b5563;margin-top:0;margin-bottom:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;font-size:14px;line-height:1.5">/ 5.0</p>';
		$html .= '<!-- /wp:paragraph -->';
		$html .= '</div><!-- /wp:group -->';

		// Stars.
		$html .= '<!-- wp:surecart/product-review-average-rating-stars /-->';

		// Total count row.
		$html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"5px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';
		$html .= '<!-- wp:paragraph {"style":{"typography":{"fontSize":"14px"},"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"},"margin":{"top":"0","bottom":"0"}}}} -->';
		$html .= '<p style="margin-top:0;margin-bottom:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;font-size:14px">' . esc_html__( 'Based on', 'surecart' ) . '</p>';
		$html .= '<!-- /wp:paragraph -->';
		$html .= '<!-- wp:surecart/product-review-total-rating {"link_to_reviews":false,"className":"is-style-default","style":{"spacing":{"blockGap":"4px","margin":{"right":"0","left":"0"},"padding":{"right":"0","left":"0"}}}} /-->';
		$html .= '</div><!-- /wp:group -->';

		$html .= '</div><!-- /wp:group -->';
		$html .= '</div><!-- /wp:column -->';

		// Right column: breakdown.
		$html .= '<!-- wp:column {"verticalAlignment":"center"} -->';
		$html .= '<div class="wp-block-column is-vertically-aligned-center">';
		$html .= '<!-- wp:surecart/product-review-breakdown {"columns":2,"className":"is-style-default","layout":{"type":"flex","justifyContent":"left","orientation":"horizontal","verticalAlignment":"center"}} /-->';
		$html .= '</div><!-- /wp:column -->';

		$html .= '</div><!-- /wp:columns -->';

		$html .= '<!-- /wp:surecart/product-review-summary -->';

		return $html;
	}

	/**
	 * Build the header section HTML (filter toggle + add button).
	 *
	 * @return string
	 */
	protected function buildHeaderHtml() {
		$html  = '<!-- wp:group {"metadata":{"name":"Header"},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
		$html .= '<div class="wp-block-group">';

		// translators: Sidebar toggle label for review filters.
		$html .= '<!-- wp:surecart/product-review-list-sidebar-toggle {"label":"' . esc_attr__( 'Filters', 'surecart' ) . '"} /-->';

		$html .= '<!-- wp:surecart/product-review-add-button {"width":100,"className":"is-style-fill","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}},"spacing":{"blockGap":"4px"}},"backgroundColor":"surecart","textColor":"white"} /-->';

		$html .= '</div><!-- /wp:group -->';

		return $html;
	}

	/**
	 * Build the main content area HTML (sidebar + review template + pagination).
	 *
	 * @return string
	 */
	protected function buildMainContentHtml() {
		$html  = '<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';

		// Sidebar.
		$html .= $this->buildSidebarHtml();

		// Review content area.
		$html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"0px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"layout":{"selfStretch":"fill","flexSize":null}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';

		// Review template.
		$html .= $this->buildReviewTemplateHtml();

		// Pagination.
		$html .= $this->buildPaginationHtml();

		$html .= '</div><!-- /wp:group -->';

		$html .= '</div><!-- /wp:group -->';

		return $html;
	}

	/**
	 * Build the sidebar HTML (filter tags + checkboxes).
	 *
	 * @return string
	 */
	protected function buildSidebarHtml() {
		$html = '<!-- wp:surecart/product-review-list-sidebar {"style":{"layout":{"selfStretch":"fixed","flexSize":"280px"},"position":{"type":"sticky","top":"0px"},"spacing":{"blockGap":"30px"}},"layout":{"type":"flex","orientation":"vertical"}} -->';

		// Filter tags.
		$html .= '<!-- wp:surecart/product-review-list-filter-tags {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->';
		$html .= '<!-- wp:surecart/product-review-list-filter-tags-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->';
		$html .= '<!-- wp:surecart/product-review-list-filter-tags-template {"layout":{"type":"flex","orientation":"horizontal"}} -->';
		$html .= '<!-- wp:surecart/product-review-list-filter-tag /-->';
		$html .= '<!-- /wp:surecart/product-review-list-filter-tags-template -->';
		$html .= '<!-- wp:surecart/product-review-list-filter-tags-clear-all {"style":{"typography":{"textDecoration":"underline"}}} /-->';
		$html .= '<!-- /wp:surecart/product-review-list-filter-tags -->';

		// Filter checkboxes.
		$html .= '<!-- wp:surecart/product-review-list-filter-checkboxes {"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"top","flexWrap":"nowrap"}} -->';
		$html .= '<!-- wp:surecart/product-review-list-filter-checkboxes-label {"style":{"typography":{"fontWeight":"600","fontStyle":"normal"}}} /-->';
		$html .= '<!-- wp:surecart/product-review-list-filter-checkboxes-template {"style":{"spacing":{"blockGap":"4px"}}} -->';
		$html .= '<!-- wp:surecart/product-review-list-filter-checkbox /-->';
		$html .= '<!-- /wp:surecart/product-review-list-filter-checkboxes-template -->';
		$html .= '<!-- /wp:surecart/product-review-list-filter-checkboxes -->';

		$html .= '<!-- /wp:surecart/product-review-list-sidebar -->';

		return $html;
	}

	/**
	 * Build the review template HTML (individual review items).
	 *
	 * @return string
	 */
	protected function buildReviewTemplateHtml() {
		// translators: Verified buyer badge label.
		$verified_label = esc_attr__( 'Verified Buyer', 'surecart' );

		$html = '<!-- wp:surecart/product-review-template {"style":{"spacing":{"blockGap":"0px","margin":{"top":"0","bottom":"0"},"padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":1}} -->';

		// Individual review item.
		$html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"8px","padding":{"top":"24px","bottom":"24px","right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}}},"layout":{"type":"constrained","contentSize":"100%"}} -->';
		$html .= '<div class="wp-block-group" style="border-bottom-color:#e5e7eb;border-bottom-width:1px;margin-top:0;margin-bottom:0;padding-top:24px;padding-right:0px;padding-bottom:24px;padding-left:0px">';

		// Header row: reviewer name + verified badge | date.
		$html .= '<!-- wp:group {"className":"sc-review-header-group","style":{"spacing":{"margin":{"top":"0","bottom":"16px"},"padding":{"right":"0px","left":"0px"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->';
		$html .= '<div class="wp-block-group sc-review-header-group" style="margin-top:0;margin-bottom:16px;padding-right:0px;padding-left:0px">';

		// Name + badge.
		$html .= '<!-- wp:group {"style":{"spacing":{"blockGap":"4px","padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';
		$html .= '<!-- wp:surecart/product-review-reviewer-name {"style":{"spacing":{"padding":{"top":"0","bottom":"0"},"margin":{"right":"8px"}},"typography":{"fontStyle":"normal","fontWeight":"500","fontSize":"16px"}}} /-->';
		$html .= '<!-- wp:surecart/product-review-verified-badge {"label":"' . $verified_label . '","style":{"typography":{"fontStyle":"normal","fontWeight":"400","fontSize":"16px"},"spacing":{"blockGap":"4px","layout":{"selfStretch":"fit","flexSize":null}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center","orientation":"horizontal"}}} /-->';
		$html .= '</div><!-- /wp:group -->';

		// Date.
		$html .= '<!-- wp:surecart/product-review-date {"format":"human-diff","style":{"typography":{"fontSize":"14px"}}} /-->';

		$html .= '</div><!-- /wp:group -->';

		// Stars.
		$html .= '<!-- wp:surecart/product-review-rating-stars {"style":{"spacing":{"margin":{"bottom":"16px"}}}} /-->';

		// Title.
		$html .= '<!-- wp:surecart/product-review-title {"style":{"typography":{"fontStyle":"normal","fontWeight":"700","fontSize":"18px"},"spacing":{"margin":{"bottom":"8px"}}}} /-->';

		// Content.
		$html .= '<!-- wp:surecart/product-review-content {"style":{"typography":{"fontSize":"16px"}}} /-->';

		$html .= '</div><!-- /wp:group -->';

		$html .= '<!-- /wp:surecart/product-review-template -->';

		return $html;
	}

	/**
	 * Build the pagination HTML.
	 *
	 * @return string
	 */
	protected function buildPaginationHtml() {
		$html  = '<!-- wp:surecart/product-review-pagination {"style":{"spacing":{"margin":{"top":"30px","bottom":"30px"}}}} -->';
		$html .= '<!-- wp:surecart/product-review-pagination-previous /-->';
		$html .= '<!-- wp:surecart/product-review-pagination-numbers /-->';
		$html .= '<!-- wp:surecart/product-review-pagination-next /-->';
		$html .= '<!-- /wp:surecart/product-review-pagination -->';

		return $html;
	}

	/**
	 * Build the no reviews section HTML.
	 *
	 * @return string
	 */
	protected function buildNoReviewsHtml() {
		$html = '<!-- wp:surecart/product-review-list-no-reviews -->';

		$html .= '<!-- wp:paragraph {"align":"left"} -->';
		$html .= '<p class="has-text-align-left">' . esc_html__( 'No reviews yet.', 'surecart' ) . '</p>';
		$html .= '<!-- /wp:paragraph -->';

		$html .= '<!-- wp:group {"style":{"spacing":{"padding":{"right":"0px","left":"0px"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->';
		$html .= '<div class="wp-block-group" style="margin-top:0;margin-bottom:0;padding-right:0px;padding-left:0px">';
		$html .= '<!-- wp:surecart/product-review-add-button {"width":100,"className":"is-style-fill","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}},"spacing":{"blockGap":"4px"}},"backgroundColor":"surecart","textColor":"white"} /-->';
		$html .= '</div><!-- /wp:group -->';

		$html .= '<!-- /wp:surecart/product-review-list-no-reviews -->';

		return $html;
	}
}
