<?php

namespace SureCart\Database;

/**
 * Migrates saved cart templates: wraps the standalone `cart-line-item-variant`
 * block inside the new `cart-line-item-details` container so bundle line-items
 * get the collapsible "+N more" region on upgrade.
 *
 * The `cart-line-item-note` block is intentionally left standalone — in
 * released carts it already sits right after the variant, so once the variant
 * is wrapped the note naturally ends up after the details container.
 */
class CartLineItemDetailsMigrationService extends VersionMigration {
	/**
	 * The key for the migration.
	 *
	 * @var string
	 */
	protected $migration_key = 'surecart_cart_line_item_details_migration_version';

	/**
	 * Whether any post update failed during the run. When true we skip marking
	 * the migration complete so it retries on the next admin_init.
	 *
	 * @var bool
	 */
	protected $failed = false;

	/**
	 * Default variant attributes — matches the default cart template.
	 *
	 * @var string
	 */
	const DEFAULT_CHILD_ATTRS = '{"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}}';

	/**
	 * Matches the details container form: opener (with or without attrs),
	 * inner blocks, closer. Its presence means the cart is already migrated.
	 *
	 * @var string
	 */
	const DETAILS_WRAPPER_PATTERN = '/<!--\s*wp:surecart\/cart-line-item-details\b.*?-->.*?<!--\s*\/wp:surecart\/cart-line-item-details\s*-->/s';

	/**
	 * Matches the standalone self-closing variant block the container now owns.
	 *
	 * @var string
	 */
	const VARIANT_BLOCK_PATTERN = '/[ \t]*<!--\s*wp:surecart\/cart-line-item-variant\b.*?\/-->\n?/s';

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run(): void {
		foreach ( $this->getCartPosts() as $cart_post ) {
			$content = $cart_post->post_content ?? '';
			if ( empty( $content ) ) {
				continue;
			}

			$migrated = $this->consolidateDetails( $content );
			if ( $migrated === $content ) {
				continue;
			}

			$result = wp_update_post(
				array(
					'ID'           => $cart_post->ID,
					'post_content' => $migrated,
				),
				true
			);

			// Leave the migration unmarked (see complete()) so a failed update
			// retries next admin_init instead of being stranded on the old markup.
			if ( is_wp_error( $result ) || empty( $result ) ) {
				$this->failed = true;
			}
		}
	}

	/**
	 * Only mark the migration complete when every cart updated cleanly.
	 *
	 * @return void
	 */
	public function complete() {
		if ( $this->failed ) {
			return;
		}
		parent::complete();
	}

	/**
	 * Collect the cart posts to migrate.
	 *
	 * Covers both storage locations:
	 *   - wp_template_part with post_name 'cart' (newer installs).
	 *   - sc_cart post type (legacy installs whose cart hasn't been moved yet).
	 *
	 * @return array
	 */
	protected function getCartPosts(): array {
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

		return array_merge( $cart_part_query->posts ?? array(), $sc_cart_query->posts ?? array() );
	}

	/**
	 * Wrap the standalone variant block in a details container, preserving the
	 * merchant's variant styling. The note is left untouched.
	 *
	 * Deterministic, so re-running on migrated content is a no-op.
	 *
	 * @param string $content Post content.
	 * @return string Migrated content (unchanged if nothing matched).
	 */
	protected function consolidateDetails( string $content ): string {
		// Idempotent: a details container already present means the cart is in
		// the target shape (container owns the variant; note stays standalone).
		if ( preg_match( self::DETAILS_WRAPPER_PATTERN, $content ) ) {
			return $content;
		}

		// Preserve the existing variant attributes (merchant styling).
		$variant_attrs = $this->blockAttrs( $content, 'cart-line-item-variant' ) ?? self::DEFAULT_CHILD_ATTRS;

		$details = "<!-- wp:surecart/cart-line-item-details -->\n"
			. '<!-- wp:surecart/cart-line-item-variant ' . $variant_attrs . " /-->\n"
			. '<!-- /wp:surecart/cart-line-item-details -->';

		// Wrap the first standalone variant in place. The note (a separate
		// standalone block) is deliberately not matched, so it stays exactly
		// where it is — after the variant, hence after the new container.
		if ( preg_match( self::VARIANT_BLOCK_PATTERN, $content ) ) {
			$migrated = preg_replace( self::VARIANT_BLOCK_PATTERN, $details . "\n", $content, 1 );
			return is_string( $migrated ) ? $migrated : $content;
		}

		// No variant block at all: inject the container before the first
		// sensible anchor so bundle items still show for older carts. Prefer
		// the note so the container lands before it (details, then note).
		$anchor = $this->firstExistingAnchor(
			$content,
			array(
				'surecart/cart-line-item-note',
				'surecart/cart-line-item-status',
				'surecart/cart-line-item-quantity',
				'surecart/cart-line-item-remove',
			)
		);

		if ( ! $anchor ) {
			return $content;
		}

		return str_replace(
			'<!-- wp:' . $anchor,
			$details . "\n" . '<!-- wp:' . $anchor,
			$content
		);
	}

	/**
	 * Get the attribute JSON of the first occurrence of a self-closing block.
	 *
	 * @param string $content Post content to scan.
	 * @param string $block   Block name without the `surecart/` prefix.
	 * @return string|null Attribute JSON, or null when absent/attribute-less.
	 */
	protected function blockAttrs( string $content, string $block ): ?string {
		if ( preg_match( '/<!--\s*wp:surecart\/' . preg_quote( $block, '/' ) . '\s+(\{.*?\})\s*\/-->/s', $content, $matches ) ) {
			return $matches[1];
		}
		return null;
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
