<?php

namespace SureCart\Database;

/**
 * Wraps the released `surecart/cart-line-item-note` block in the new
 * `surecart/cart-line-item-details` container so the note (and bundle items)
 * share a single collapsible region instead of stacking two chevrons.
 */
class CartLineItemDetailsMigrationService extends VersionMigration {
	/**
	 * The key for the migration.
	 *
	 * @var string
	 */
	protected $migration_key = 'surecart_cart_line_item_details_migration_version';

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

			// Already migrated.
			if ( has_block( 'surecart/cart-line-item-details', $content ) ) {
				continue;
			}

			$migrated = $this->wrapDetails( $content );
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
	 * Wrap the line item note (and bundle components) into the details container.
	 *
	 * @param string $content Post content.
	 * @return string Migrated content (unchanged if nothing matched).
	 */
	protected function wrapDetails( string $content ): string {
		// Preferred path: wrap the existing note block, preserving its attributes.
		if ( has_block( 'surecart/cart-line-item-note', $content ) ) {
			$has_bundle = has_block( 'surecart/cart-line-item-bundle-components', $content );

			// Match the self-closing note block comment and capture its attrs.
			// Non-greedy up to the closing `/-->` keeps nested JSON braces intact.
			$pattern = '/<!--\s*wp:surecart\/cart-line-item-note\b(.*?)\/-->/s';

			$migrated = preg_replace_callback(
				$pattern,
				function ( $matches ) use ( $has_bundle ) {
					$note_comment = $matches[0];
					$attrs        = $matches[1]; // Leading + trailing spaces preserved.

					$bundle_comment = $has_bundle
						? '' // A bundle-components block already exists — don't duplicate it.
						: '<!-- wp:surecart/cart-line-item-bundle-components' . $attrs . '/-->' . "\n\n";

					return "<!-- wp:surecart/cart-line-item-details -->\n"
						. $bundle_comment
						. $note_comment . "\n"
						. '<!-- /wp:surecart/cart-line-item-details -->';
				},
				$content,
				1
			);

			return is_string( $migrated ) ? $migrated : $content;
		}

		// Fallback: no note block. Inject a details container with just the
		// bundle-components block before the first sensible anchor.
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

		$details = "<!-- wp:surecart/cart-line-item-details -->\n"
			. '<!-- wp:surecart/cart-line-item-bundle-components {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->' . "\n"
			. '<!-- /wp:surecart/cart-line-item-details -->';

		return str_replace(
			'<!-- wp:' . $anchor,
			$details . PHP_EOL . '<!-- wp:' . $anchor,
			$content
		);
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
