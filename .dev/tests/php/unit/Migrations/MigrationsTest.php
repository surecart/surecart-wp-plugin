<?php
namespace SureCart\Tests\Migrations;


class MigrationsTest extends \WP_UnitTestCase {
	public function setUp() {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Database\MigrationsServiceProvider::class,
			]
		], false);
	}

	/**
	 * @group migrations
	 */
	public function test_createsIntegrationsTable() {
		$this->table_exists('surecart_integrations');
	}

	/**
	 * Check if table exists.
	 */
	function table_exists($name){
        global $wpdb;
        $table_name = $wpdb->prefix . $name;
        $query = $wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table_name));
		$result = $wpdb->get_var($query);
        $this->assertTrue($result == $table_name);
        $this->assertNotEmpty(get_option("{$name}_database_version"));
    }
}
