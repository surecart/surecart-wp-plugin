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

	public function test_cart_post_content_copied_to_template_part(){
		$test_cart = self::factory()->post->create_and_get(array(
			'post_type' => 'sc_cart',
			'post_content' => 'This is the test cart post content <div>hello</div>'
		));

		// call the handle cart migration function
		$update_migration_service_provider = new UpdateMigrationServiceProvider();
		$update_migration_service_provider->handleCartMigration();

		// get the created template part
		$created_template_part = get_posts([
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
		])[0] ?? null;

		$this->assertNotEmpty( $created_template_part );
		$this->assertEquals( $test_cart->post_content, $created_template_part->post_content );
	}

	public function test_existing_template_part_not_updated(){
		$existing_template_part = self::factory()->post->create_and_get(array(
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
			'post_content' => 'This is the existing template part content <div>hello</div>'
		));

		$test_cart = self::factory()->post->create_and_get(array(
			'post_type' => 'sc_cart',
			'post_content' => 'This is the test cart post content <div>hello</div>'
		));

		// call the handle cart migration function
		$update_migration_service_provider = new UpdateMigrationServiceProvider();
		$update_migration_service_provider->handleCartMigration();

		// get the created template part
		$updated_template_part = get_posts([
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
		])[0] ?? null;

		$this->assertNotEmpty( $updated_template_part );
		$this->assertNotEquals( $test_cart->post_content, $updated_template_part->post_content );
		$this->assertEquals( $existing_template_part->ID, $updated_template_part->ID );
	}

	public function test_prevent_duplicate_template_parts(){
		self::factory()->post->create(array(
			'post_type' => 'sc_cart',
			'post_content' => 'This is the test cart post content <div>hello</div>'
		));

		self::factory()->post->create(array(
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
			'post_content' => 'This is the existing template part content <div>hello</div>'
		));

		// call the handle cart migration function
		$update_migration_service_provider = new UpdateMigrationServiceProvider();
		$update_migration_service_provider->handleCartMigration();

		// get the created template part
		$posts = get_posts([
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
		]);

		$this->assertCount( 1, $posts );
	}

	public function test_prevent_replace_existing_template_parts(){
		self::factory()->post->create(array(
			'post_type' => 'sc_cart',
			'post_content' => 'This is the test cart post content <div>hello</div>'
		));

		self::factory()->post->create(array(
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Test', 'Test title', 'surecart' ),
			'post_content' => 'This is a test template part.'
		));

		// call the handle cart migration function
		$update_migration_service_provider = new UpdateMigrationServiceProvider();
		$update_migration_service_provider->handleCartMigration();

		// get the created template part
		$posts = get_posts([
			'post_type' => 'wp_template_part',
			'post_title' => _x( 'Test', 'Test title', 'surecart' ),
		]);

		$this->assertCount( 1, $posts );
		$this->assertEquals( 'This is a test template part.', $posts[0]->post_content );
	}
}
