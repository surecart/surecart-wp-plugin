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
	 * Note block markup as shipped (released) — sits next to other line item blocks.
	 */
	protected $note_markup = '<!-- wp:surecart/cart-line-item-note {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->';

	public function setUp(): void {
		\SureCart::make()->bootstrap( array( 'providers' => array() ), false );
		$this->service = new CartLineItemDetailsMigrationService();
		parent::setUp();
	}

	/**
	 * Build a cart post with the given content and return its ID.
	 */
	protected function createCart( string $content ): int {
		return wp_insert_post(
			array(
				'post_type'    => 'sc_cart',
				'post_status'  => 'publish',
				'post_title'   => 'Cart',
				'post_content' => $content,
			)
		);
	}

	protected function getContent( int $id ): string {
		return get_post( $id )->post_content;
	}

	/**
	 * @group cart-line-item-details
	 */
	public function test_wraps_note_in_details_and_injects_bundle_components() {
		$id = $this->createCart(
			'<!-- wp:surecart/cart-line-item-variant /-->' . "\n" . $this->note_markup
		);

		$this->service->run();
		$content = $this->getContent( $id );

		// Wrapped in the new parent container.
		$this->assertStringContainsString( '<!-- wp:surecart/cart-line-item-details -->', $content );
		$this->assertStringContainsString( '<!-- /wp:surecart/cart-line-item-details -->', $content );

		// Bundle components injected, reusing the note's style attributes.
		$this->assertStringContainsString(
			'<!-- wp:surecart/cart-line-item-bundle-components {"style":{"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->',
			$content
		);

		// Original note block preserved verbatim.
		$this->assertStringContainsString( $this->note_markup, $content );

		// Order: bundle-components before the note, both inside the container.
		$this->assertTrue(
			strpos( $content, 'cart-line-item-bundle-components' ) < strpos( $content, 'cart-line-item-note' )
		);
	}

	/**
	 * @group cart-line-item-details
	 */
	public function test_is_idempotent_when_already_migrated() {
		$already = '<!-- wp:surecart/cart-line-item-details -->' . "\n"
			. '<!-- wp:surecart/cart-line-item-bundle-components /-->' . "\n"
			. $this->note_markup . "\n"
			. '<!-- /wp:surecart/cart-line-item-details -->';

		$id = $this->createCart( $already );

		$this->service->run();

		$this->assertSame( $already, $this->getContent( $id ) );
	}

	/**
	 * @group cart-line-item-details
	 */
	public function test_does_not_duplicate_existing_bundle_components() {
		$id = $this->createCart(
			'<!-- wp:surecart/cart-line-item-bundle-components /-->' . "\n" . $this->note_markup
		);

		$this->service->run();
		$content = $this->getContent( $id );

		// Wrapped, but exactly one bundle-components block (no duplicate injected).
		$this->assertStringContainsString( '<!-- wp:surecart/cart-line-item-details -->', $content );
		$this->assertSame( 1, substr_count( $content, 'wp:surecart/cart-line-item-bundle-components' ) );
	}

	/**
	 * @group cart-line-item-details
	 */
	public function test_fallback_injects_details_when_no_note() {
		$id = $this->createCart(
			'<!-- wp:surecart/cart-line-item-variant /-->' . "\n"
			. '<!-- wp:surecart/cart-line-item-status /-->'
		);

		$this->service->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( '<!-- wp:surecart/cart-line-item-details -->', $content );
		$this->assertStringContainsString( 'wp:surecart/cart-line-item-bundle-components', $content );
		// Injected before the status anchor.
		$this->assertTrue(
			strpos( $content, 'cart-line-item-details' ) < strpos( $content, 'cart-line-item-status' )
		);
	}

	/**
	 * @group cart-line-item-details
	 */
	public function test_preserves_nested_json_attributes() {
		$rich_note = '<!-- wp:surecart/cart-line-item-note {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->';
		$id        = $this->createCart( $rich_note );

		$this->service->run();
		$content = $this->getContent( $id );

		// Full nested-brace attribute JSON survives on both blocks.
		$this->assertStringContainsString( $rich_note, $content );
		$this->assertStringContainsString(
			'<!-- wp:surecart/cart-line-item-bundle-components {"style":{"color":{"text":"#828c99"},"elements":{"link":{"color":{"text":"#828c99"}}},"typography":{"fontSize":"14px","lineHeight":"1.4"}}} /-->',
			$content
		);
	}
}
