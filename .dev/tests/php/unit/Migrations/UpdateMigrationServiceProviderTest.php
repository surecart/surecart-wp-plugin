<?php
namespace Surecart\Tests\Migrations;

use SureCart\Database\UpdateMigrationServiceProvider;

class UpdateMigrationServiceProviderTest extends \WP_UnitTestCase {
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Database\UpdateMigrationServiceProvider::class,
			]
		], false);
	}

	/**
	 * When the version changes, the content of the cart post should be copied to
	 * the template part with title 'Cart' and post_type 'wp_template_part'.
	 */
	// public function test_cart_post_content_copied_to_template_part() {
	// 	$query = new \WP_Query([
	// 		'post_type' => 'wp_template_part',
	// 		'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
	// 	]);
	// 	// delete the existing template part if it exists.
	// 	$existing_template_part = $query->posts[0] ?? null;
	// 	if ( !empty($existing_template_part) ) {
	// 		wp_delete_post( $existing_template_part->ID, true );
	// 	}

	// 	// get the cart post
	// 	$existing_cart_post = \SureCart::cartPost()->get();

	// 	// update the migration version
	// 	update_option( 'surecart_migration_version', '0.0.0' );


	// 	// call the run method on the UpdateMigrationServiceProvider
	// 	$update_migration_service_provider = new UpdateMigrationServiceProvider();
	// 	$update_migration_service_provider->run();

	// 	// get the created template part
	// 	$query = new \WP_Query([
	// 		'post_type' => 'wp_template_part',
	// 		'post_title' => _x( 'Cart', 'Cart title', 'surecart' ),
	// 	]);
	// 	$created_template_part = $query->posts[0] ?? null;

	// 	// check if the template part exists
	// 	$this->assertNotEmpty( $created_template_part );

	// 	// confirm the content of the template part is the same as the cart post.
	// 	$this->assertEquals( $existing_cart_post->post_content, $created_template_part->post_content );
	// }

	public function test_cart_post_content_copied_to_template_part(){
		$root_class = \Mockery::mock(\SureCart::class)->makePartial();

		$root_class->shouldReceive('cartPost')->andReturn(((object)[
			'get' =>function (){
				return (object)[
					'post_content' => 'test content',
					'post_author' => 1,
					'post_status' => 'publish',
					'post_excerpt' => 'test excerpt'
				];
			}
		]));

		// call the handle cart migration function
		$update_migration_service_provider = new UpdateMigrationServiceProvider();
		$update_migration_service_provider->handleCartMigration();
	}
}
