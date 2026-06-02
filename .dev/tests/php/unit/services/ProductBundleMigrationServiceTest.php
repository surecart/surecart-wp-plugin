<?php

namespace SureCart\Tests\Services;

use SureCart\Database\ProductBundleMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group product-bundle-migration
 */
class ProductBundleMigrationServiceTest extends SureCartUnitTestCase {
	public function setUp(): void {
		\SureCart::make()->bootstrap( array( 'providers' => array() ), false );
		parent::setUp();
		\SureCart::alias( 'account', fn() => (object) array( 'id' => null ) );
	}

	/**
	 * Create a block template with the given slug + markup.
	 */
	private function createTemplate( string $name, string $content ): int {
		return wp_insert_post(
			array(
				'post_type'    => 'wp_template',
				'post_status'  => 'publish',
				'post_name'    => $name,
				'post_title'   => $name,
				'post_content' => $content,
			)
		);
	}

	private function getContent( int $id ): string {
		return get_post( $id )->post_content;
	}

	/**
	 * @group product-bundle-migration
	 */
	public function test_injects_bundle_items_into_customized_single_product_template() {
		$id = $this->createTemplate(
			'single-product',
			'<!-- wp:surecart/product-title /-->' . "\n" . '<!-- wp:surecart/product-buy-buttons /-->'
		);

		( new ProductBundleMigrationService() )->run();
		$content = $this->getContent( $id );

		$this->assertStringContainsString( '<!-- wp:surecart/product-bundle-items', $content );
		// Injected before the buy-buttons anchor.
		$this->assertTrue(
			strpos( $content, 'surecart/product-bundle-items' ) < strpos( $content, 'surecart/product-buy-buttons' )
		);
	}

	/**
	 * @group product-bundle-migration
	 */
	public function test_is_idempotent_when_bundle_items_present() {
		$existing = '<!-- wp:surecart/product-bundle-items /-->' . "\n" . '<!-- wp:surecart/product-buy-buttons /-->';
		$id       = $this->createTemplate( 'single-product', $existing );

		( new ProductBundleMigrationService() )->run();

		$this->assertSame( $existing, $this->getContent( $id ) );
	}

	/**
	 * @group product-bundle-migration
	 */
	public function test_skips_non_product_templates() {
		$content = '<!-- wp:surecart/product-buy-buttons /-->';
		$id      = $this->createTemplate( 'home', $content );

		( new ProductBundleMigrationService() )->run();

		$this->assertSame( $content, $this->getContent( $id ) );
	}

	/**
	 * @group product-bundle-migration
	 */
	public function test_skips_product_template_without_anchor() {
		$content = '<!-- wp:surecart/product-title /-->';
		$id      = $this->createTemplate( 'single-product', $content );

		( new ProductBundleMigrationService() )->run();

		// No price-chooser / buy-button anchor → nothing injected.
		$this->assertSame( $content, $this->getContent( $id ) );
	}
}
