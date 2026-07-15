<?php

namespace SureCart\Tests\Services;

use SureCart\Database\CartLineItemDetailsMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group cart-line-item-details
 */
class CartLineItemDetailsMigrationServiceTest extends SureCartUnitTestCase {
	/**
	 * @var CartLineItemDetailsMigrationService
	 */
	public $service = null;

	/**
	 * Variant block markup as shipped (released).
	 */
	protected $variant_markup = '<!-- wp:surecart/cart-line-item-variant {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->';

	/**
	 * Note block markup as shipped (released).
	 */
	protected $note_markup = '<!-- wp:surecart/cart-line-item-note {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->';

	public function setUp(): void {
		\SureCart::make()->bootstrap( array( 'providers' => array() ), false );
		\SureCart::alias( 'account', fn() => (object) array( 'id' => 'test' ) );
		$this->service = new CartLineItemDetailsMigrationService();
		parent::setUp();
	}

	/**
	 * The canonical structure the migration produces — a details container
	 * wrapping ONLY the variant block. The note stays standalone.
	 */
	protected function detailsMarkup( ?string $variant_attrs = null ): string {
		$variant_attrs = $variant_attrs ?? CartLineItemDetailsMigrationService::DEFAULT_CHILD_ATTRS;

		return "<!-- wp:surecart/cart-line-item-details -->\n"
			. '<!-- wp:surecart/cart-line-item-variant ' . $variant_attrs . " /-->\n"
			. '<!-- /wp:surecart/cart-line-item-details -->';
	}

	/**
	 * Grab the details container markup (opener → closer) from content.
	 */
	protected function detailsRegion( string $content ): ?string {
		if ( preg_match( '/<!--\s*wp:surecart\/cart-line-item-details\b.*?<!--\s*\/wp:surecart\/cart-line-item-details\s*-->/s', $content, $m ) ) {
			return $m[0];
		}
		return null;
	}

	/**
	 * Build a cart post with the given content and return its ID.
	 */
	protected function createCart( string $content, array $args = array() ): int {
		$id = wp_insert_post(
			wp_parse_args(
				$args,
				array(
					'post_type'    => 'sc_cart',
					'post_status'  => 'publish',
					'post_title'   => 'Cart',
					'post_content' => $content,
				)
			)
		);

		$this->assertIsInt( $id );
		$this->assertGreaterThan( 0, $id );

		return $id;
	}

	protected function getContent( int $id ): string {
		return get_post( $id )->post_content;
	}

	/**
	 * Released layout: the standalone variant is wrapped in a details
	 * container at its position; the note stays standalone, after it.
	 */
	public function test_wraps_variant_and_keeps_note_standalone() {
		$id = $this->createCart(
			$this->variant_markup . "\n"
			. $this->note_markup . "\n"
			. '<!-- wp:surecart/cart-line-item-status /-->'
		);

		$this->service->run();
		$content = $this->getContent( $id );

		// Variant is wrapped in the details container.
		$this->assertStringContainsString( $this->detailsMarkup(), $content );

		// Exactly one of each block.
		$this->assertSame( 1, substr_count( $content, 'wp:surecart/cart-line-item-variant' ) );
		$this->assertSame( 1, substr_count( $content, 'wp:surecart/cart-line-item-note' ) );

		// The note is NOT inside the container.
		$region = $this->detailsRegion( $content );
		$this->assertNotNull( $region );
		$this->assertStringNotContainsString( 'cart-line-item-note', $region );

		// Order: details container → note → status.
		$this->assertLessThan(
			strpos( $content, 'cart-line-item-note' ),
			strpos( $content, '<!-- /wp:surecart/cart-line-item-details -->' )
		);
		$this->assertLessThan(
			strpos( $content, 'cart-line-item-status' ),
			strpos( $content, 'cart-line-item-note' )
		);
	}

	/**
	 * The note is never folded into the container — it must remain a
	 * standalone block after migration.
	 */
	public function test_does_not_wrap_note_inside_details() {
		$id = $this->createCart( $this->variant_markup . "\n" . $this->note_markup );

		$this->service->run();
		$content = $this->getContent( $id );

		$region = $this->detailsRegion( $content );
		$this->assertNotNull( $region );
		$this->assertStringContainsString( 'cart-line-item-variant', $region );
		$this->assertStringNotContainsString( 'cart-line-item-note', $region );
		$this->assertStringContainsString( $this->note_markup, $content );
	}

	public function test_is_idempotent_when_already_migrated() {
		$already = $this->detailsMarkup() . "\n"
			. $this->note_markup . "\n"
			. '<!-- wp:surecart/cart-line-item-status /-->';

		$id = $this->createCart( $already );

		$this->service->run();

		$this->assertSame( $already, $this->getContent( $id ) );
	}

	/**
	 * No variant block at all: inject the container before the first anchor
	 * (the note) so bundle items still show for older/customized carts.
	 */
	public function test_fallback_injects_details_before_anchor() {
		$id = $this->createCart(
			'<!-- wp:surecart/cart-line-item-title /-->' . "\n"
			. $this->note_markup . "\n"
			. '<!-- wp:surecart/cart-line-item-status /-->'
		);

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup(), $content );
		// Injected before the note anchor.
		$this->assertLessThan(
			strpos( $content, 'cart-line-item-note' ),
			strpos( $content, 'cart-line-item-details' )
		);
	}

	/**
	 * Merchant styling on the released variant (nested JSON attributes)
	 * survives the move into the container; the note is left untouched.
	 */
	public function test_preserves_nested_json_attributes() {
		$rich_attrs   = '{"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}}';
		$rich_variant = '<!-- wp:surecart/cart-line-item-variant ' . $rich_attrs . ' /-->';

		$id = $this->createCart( $rich_variant . "\n" . $this->note_markup );

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup( $rich_attrs ), $content );
		$this->assertStringContainsString( $this->note_markup, $content );
	}

	/**
	 * Newer installs store the cart as a `wp_template_part` named `cart` —
	 * the migration covers that storage location too.
	 */
	public function test_migrates_cart_template_part() {
		$id = $this->createCart(
			$this->variant_markup . "\n" . $this->note_markup,
			array(
				'post_type' => 'wp_template_part',
				'post_name' => 'cart',
			)
		);

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup(), $content );
		$this->assertStringContainsString( $this->note_markup, $content );
	}
}
