<?php

namespace SureCart\Database;

/**
 * Backfills the new Product Bundle blocks, Cart bundle item blocks.
 */
class ProductBundleMigrationService extends VersionMigration {
	/**
	 * The key for the migration.
	 *
	 * @var string
	 */
	protected $migration_key = 'surecart_product_bundle_migration_version';

	/**
	 * Product page bundle block markup.
	 *
	 * @var string
	 */
	protected $product_bundle_markup = '<!-- wp:surecart/product-bundle-items -->
<!-- wp:surecart/bundle-item-template {"layout":{"type":"flex","orientation":"vertical"}} -->
<!-- wp:group {"style":{"spacing":{"blockGap":"4px"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left"}} -->
<div class="wp-block-group">
<!-- wp:surecart/bundle-product-name /-->
<!-- wp:surecart/bundle-variant-name /-->
<!-- wp:surecart/bundle-item-quantity /-->
</div>
<!-- /wp:group -->

<!-- wp:surecart/bundle-item-variant -->
<!-- wp:surecart/bundle-item-variant-pill /-->
<!-- /wp:surecart/bundle-item-variant -->
<!-- /wp:surecart/bundle-item-template -->
<!-- /wp:surecart/product-bundle-items -->';

	/**
	 * Cart line-item bundle components markup.
	 *
	 * @var string
	 */
	protected $cart_bundle_markup = '<!-- wp:surecart/cart-line-item-bundle-components {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->';

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run(): void {
		$this->migrateProductTemplates();
		$this->migrateCartTemplates();
	}

	/**
	 * Inject the bundle items block into customized product templates.
	 *
	 * @return void
	 */
	protected function migrateProductTemplates(): void {
		$query = new \WP_Query(
			array(
				'post_type'           => array( 'wp_template_part', 'wp_template' ),
				'post_status'         => array( 'auto-draft', 'draft', 'publish' ),
				'posts_per_page'      => -1,
				'lazy_load_term_meta' => false,
			)
		);

		$templates = $query->posts ?? array();
		if ( empty( $templates ) ) {
			return;
		}

		$product_templates = array_filter(
			$templates,
			function ( $template ) {
				return in_array( $template->post_name, array( 'product-info', 'single-product' ), true ) ||
					strpos( $template->post_name, 'sc-part-products-info-' ) !== false ||
					strpos( $template->post_name, 'sc-products-' ) !== false;
			}
		);

		if ( empty( $product_templates ) ) {
			return;
		}

		foreach ( $product_templates as $template ) {
			if ( has_block( 'surecart/product-bundle-items', $template->post_content ) ) {
				continue;
			}

			$anchor = $this->firstExistingAnchor(
				$template->post_content,
				array(
					'surecart/product-price-chooser',
					'surecart/product-buy-buttons',
					'surecart/product-buy-button',
				)
			);

			if ( ! $anchor ) {
				continue;
			}

			$new_content = str_replace(
				'<!-- wp:' . $anchor,
				$this->product_bundle_markup . PHP_EOL . '<!-- wp:' . $anchor,
				$template->post_content
			);

			wp_update_post(
				array(
					'ID'           => $template->ID,
					'post_content' => $new_content,
				)
			);
		}
	}

	/**
	 * Inject the cart line-item bundle components block into customized cart templates.
	 *
	 * Covers two storage locations:
	 *   - wp_template_part with post_name 'cart' (newer installs).
	 *   - sc_cart post type (legacy installs whose cart hasn't been moved yet).
	 *
	 * @return void
	 */
	protected function migrateCartTemplates(): void {
		$cart_part_query = new \WP_Query(
			array(
				'post_type'           => 'wp_template_part',
				'post_status'         => array( 'auto-draft', 'draft', 'publish' ),
				'posts_per_page'      => -1,
				'name'                => 'cart',
				'lazy_load_term_meta' => false,
			)
		);

		$sc_cart_query = new \WP_Query(
			array(
				'post_type'           => 'sc_cart',
				'post_status'         => array( 'auto-draft', 'draft', 'publish' ),
				'posts_per_page'      => -1,
				'lazy_load_term_meta' => false,
			)
		);

		$cart_posts = array_merge( $cart_part_query->posts ?? array(), $sc_cart_query->posts ?? array() );
		if ( empty( $cart_posts ) ) {
			return;
		}

		foreach ( $cart_posts as $cart_post ) {
			if ( has_block( 'surecart/cart-line-item-bundle-components', $cart_post->post_content ) ) {
				continue;
			}

			$anchor = $this->firstExistingAnchor(
				$cart_post->post_content,
				array(
					'surecart/cart-line-item-note',
					'surecart/cart-line-item-status',
					'surecart/cart-line-item-quantity',
					'surecart/cart-line-item-remove',
				)
			);

			if ( ! $anchor ) {
				continue;
			}

			$new_content = str_replace(
				'<!-- wp:' . $anchor,
				$this->cart_bundle_markup . PHP_EOL . '<!-- wp:' . $anchor,
				$cart_post->post_content
			);

			wp_update_post(
				array(
					'ID'           => $cart_post->ID,
					'post_content' => $new_content,
				)
			);
		}
	}

	/**
	 * Pick the first anchor block from a preferred list that exists in the content.
	 *
	 * @param string $content    Post content to scan.
	 * @param array  $candidates Block names, in order of preference.
	 * @return string|null Block name to anchor against, or null if none match.
	 */
	protected function firstExistingAnchor( string $content, array $candidates ): ?string {
		foreach ( $candidates as $block_name ) {
			if ( has_block( $block_name, $content ) ) {
				return $block_name;
			}
		}
		return null;
	}
}
