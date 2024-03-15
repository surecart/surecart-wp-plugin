<?php
namespace Surecart\Tests\Migrations;

use SureCart\Database\UpdateMigrationServiceProvider;

class UpdateMigrationServiceProviderTest extends \WP_UnitTestCase {
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\WordPress\PostTypes\FormPostTypeServiceProvider::class,
			]
		], false);
	}

	public function test_has_default_template_cart(){
		$template = get_block_template( 'surecart/surecart//cart', 'wp_template_part' );
		$this->assertNotEmpty( $template->content );
		$this->assertEmpty($template->wp_id);
	}

	/**
	 * @group failing
	 */
	public function test_cart_post_content_copied_to_template_part(){
		self::factory()->post->create_and_get(array(
			'post_type' => 'sc_cart',
			'post_content' => 'test'
		));

		// call the handle cart migration function
		$update_migration_service_provider = new UpdateMigrationServiceProvider();
		$result = $update_migration_service_provider->handleCartMigration();

		// not an error.
		$this->assertNotWPError( $result );

		// this is needed for some reason on tests since admin is not loaded.
		wp_set_post_terms( $result, 'surecart/surecart', 'wp_theme' );

		// the template part should have the same content as the cart post.
		$template = get_block_template( 'surecart/surecart//cart', 'wp_template_part' );
		$this->assertEquals( 'test', $template->content );
		$this->assertNotEmpty($template->wp_id);

		// All cart posts deleted.
		$this->assertEmpty(\SureCart::cartPost()->get());
		$this->assertEmpty(get_posts(
			array(
				'post_type'   => 'sc_cart',
				'numberposts' => -1,
				'fields'      => 'ids',
			)
		));
	}
}
