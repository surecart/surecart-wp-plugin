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
	 * The canonical structure the migration produces — details container
	 * wrapping the variant and note blocks.
	 */
	protected function detailsMarkup( ?string $variant_attrs = null, ?string $note_attrs = null ): string {
		$variant_attrs = $variant_attrs ?? CartLineItemDetailsMigrationService::DEFAULT_CHILD_ATTRS;
		$note_attrs    = $note_attrs ?? CartLineItemDetailsMigrationService::DEFAULT_CHILD_ATTRS;

		return "<!-- wp:surecart/cart-line-item-details -->\n"
			. '<!-- wp:surecart/cart-line-item-variant ' . $variant_attrs . " /-->\n\n"
			. '<!-- wp:surecart/cart-line-item-note ' . $note_attrs . " /-->\n"
			. '<!-- /wp:surecart/cart-line-item-details -->';
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
	 * Released layout: standalone variant + note move inside one details
	 * container at the variant's position.
	 */
	public function test_wraps_standalone_variant_and_note_in_details() {
		$id = $this->createCart(
			$this->variant_markup . "\n"
			. $this->note_markup . "\n"
			. '<!-- wp:surecart/cart-line-item-status /-->'
		);

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup(), $content );

		// Exactly one of each — nothing standalone left outside the container.
		$this->assertSame( 1, substr_count( $content, 'wp:surecart/cart-line-item-variant' ) );
		$this->assertSame( 1, substr_count( $content, 'wp:surecart/cart-line-item-note' ) );

		// Placed where the variant was — before the status block.
		$this->assertLessThan(
			strpos( $content, 'cart-line-item-status' ),
			strpos( $content, 'cart-line-item-details' )
		);
	}

	/**
	 * A details container already exists but the variant is still standalone
	 * outside it: the container is rebuilt with variant + note inside.
	 */
	public function test_rebuilds_container_when_variant_is_standalone_outside() {
		$id = $this->createCart(
			$this->variant_markup . "\n"
			. '<!-- wp:surecart/cart-line-item-details -->' . "\n"
			. $this->note_markup . "\n"
			. '<!-- /wp:surecart/cart-line-item-details -->'
		);

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup(), $content );
		$this->assertSame( 1, substr_count( $content, 'wp:surecart/cart-line-item-variant' ) );
		$this->assertSame( 1, substr_count( $content, '<!-- wp:surecart/cart-line-item-details -->' ) );
	}

	public function test_is_idempotent_when_already_migrated() {
		$already = $this->detailsMarkup() . "\n" . '<!-- wp:surecart/cart-line-item-status /-->';

		$id = $this->createCart( $already );

		$this->service->run();

		$this->assertSame( $already, $this->getContent( $id ) );
	}

	/**
	 * No detail blocks at all: inject the container before the first anchor
	 * so bundle items still show for older carts.
	 */
	public function test_fallback_injects_details_before_anchor() {
		$id = $this->createCart(
			'<!-- wp:surecart/cart-line-item-title /-->' . "\n"
			. '<!-- wp:surecart/cart-line-item-status /-->'
		);

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup(), $content );
		// Injected before the status anchor.
		$this->assertLessThan(
			strpos( $content, 'cart-line-item-status' ),
			strpos( $content, 'cart-line-item-details' )
		);
	}

	/**
	 * Merchant styling on the released blocks (nested JSON attributes)
	 * survives the move into the container.
	 */
	public function test_preserves_nested_json_attributes() {
		$rich_attrs   = '{"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}}';
		$rich_variant = '<!-- wp:surecart/cart-line-item-variant ' . $rich_attrs . ' /-->';
		$rich_note    = '<!-- wp:surecart/cart-line-item-note ' . $rich_attrs . ' /-->';

		$id = $this->createCart( $rich_variant . "\n" . $rich_note );

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( $this->detailsMarkup( $rich_attrs, $rich_attrs ), $content );
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

		$this->assertStringContainsString( $this->detailsMarkup(), $this->getContent( $id ) );
	}
}
