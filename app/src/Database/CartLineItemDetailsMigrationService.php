<?php

namespace SureCart\Database;

/**
 * Migrates saved cart templates: wraps the standalone variant and note blocks
 * inside the line item details container.
 */
class CartLineItemDetailsMigrationService extends VersionMigration {
	/**
	 * The key for the migration.
	 *
	 * @var string
	 */
	protected $migration_key = 'surecart_cart_line_item_details_migration_version';

	/**
	 * Default child attributes — matches the default cart template.
	 *
	 * @var string
	 */
	const DEFAULT_CHILD_ATTRS = '{"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}}';

	/**
	 * Matches the details container form: opener (with or without attrs),
	 * inner blocks, closer.
	 *
	 * @var string
	 */
	const DETAILS_WRAPPER_PATTERN = '/<!--\s*wp:surecart\/cart-line-item-details\b.*?-->.*?<!--\s*\/wp:surecart\/cart-line-item-details\s*-->/s';

	/**
	 * Matches the standalone self-closing detail blocks the container now owns (variant, note).
	 *
	 * @var string
	 */
	const DETAIL_BLOCKS_PATTERN = '/[ \t]*<!--\s*wp:surecart\/cart-line-item-(?:variant|note)\b.*?\/-->\n?/s';

	/**
	 * Placeholder marking where the rebuilt details container goes.
	 *
	 * @var string
	 */
	const PLACEHOLDER = '<!-- sc:line-item-details-placeholder -->';

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

			wp_update_post(
				array(
					'ID'           => $cart_post->ID,
					'post_content' => $migrated,
				)
			);
		}
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
	 * Rebuild the line item details region: one details container wrapping
	 * the variant and note blocks (attributes preserved from the existing
	 * blocks when present).
	 *
	 * Deterministic, so re-running on migrated content is a no-op.
	 *
	 * @param string $content Post content.
	 * @return string Migrated content (unchanged if nothing matched).
	 */
	protected function consolidateDetails( string $content ): string {
		// Preserve the existing variant/note attributes (merchant styling).
		$variant_attrs = $this->blockAttrs( $content, 'cart-line-item-variant' ) ?? self::DEFAULT_CHILD_ATTRS;
		$note_attrs    = $this->blockAttrs( $content, 'cart-line-item-note' ) ?? self::DEFAULT_CHILD_ATTRS;

		$details = "<!-- wp:surecart/cart-line-item-details -->\n"
			. '<!-- wp:surecart/cart-line-item-variant ' . $variant_attrs . " /-->\n\n"
			. '<!-- wp:surecart/cart-line-item-note ' . $note_attrs . " /-->\n"
			. '<!-- /wp:surecart/cart-line-item-details -->';

		// Mark where the rebuilt container goes: the existing container's
		// position, or the first standalone detail block's position.
		if ( preg_match( self::DETAILS_WRAPPER_PATTERN, $content, $wrapper_match ) ) {
			$marked = preg_replace( self::DETAILS_WRAPPER_PATTERN, self::PLACEHOLDER, $content, 1 );

			// Already in the target shape — the container holds the variant
			// and nothing detail-related is left standalone outside it.
			if (
				is_string( $marked )
				&& false !== strpos( $wrapper_match[0], 'wp:surecart/cart-line-item-variant' )
				&& ! preg_match( self::DETAIL_BLOCKS_PATTERN, $marked )
			) {
				return $content;
			}
		} elseif ( preg_match( self::DETAIL_BLOCKS_PATTERN, $content ) ) {
			$marked = preg_replace( self::DETAIL_BLOCKS_PATTERN, self::PLACEHOLDER . "\n", $content, 1 );
		} else {
			// Nothing to consolidate — inject before the first sensible
			// anchor so bundle items still show for older carts.
			$anchor = $this->firstExistingAnchor(
				$content,
				array(
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

		if ( ! is_string( $marked ) ) {
			return $content;
		}

		// Strip the leftover standalone blocks, then drop the rebuilt
		// container into place.
		$stripped = preg_replace( self::DETAIL_BLOCKS_PATTERN, '', $marked );
		if ( ! is_string( $stripped ) ) {
			$stripped = $marked;
		}

		return str_replace( self::PLACEHOLDER, $details, $stripped );
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
