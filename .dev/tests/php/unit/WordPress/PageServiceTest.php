<?php
namespace SureCart\Tests\WordPress\Admin;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\Pages\PageService;

class PageServiceTest extends SureCartUnitTestCase {
	public $service;


	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();
		$this->service = new PageService();
	}

	public function test_getOptionName()
	{
		$this->assertEquals('surecart_test_name_post_type_name_id', $this->service->getOptionName('test_name', 'post_type_name'));
	}

	public function test_find() {
		$post = self::factory()->post->create_and_get( array(
			'post_type' => 'sc_form',
		) );

		$found = $this->service->find( $post->ID, 'sc_form' );
		$this->assertSame( $post->ID, $found->ID );

		$post = self::factory()->post->create_and_get( array(
			'post_type' => 'sc_form',
			'post_status' => 'pending'
		) );

		$found = $this->service->find( $post->ID, 'sc_form' );
		$this->assertNull( $found );
	}

	public function test_findOrCreate() {
		// default post type
		$created = $this->service->findOrCreate( 'test_slug', 'test_option', 'test_title', 'test_content');
		$this->assertEquals( 'page', $created->post_type );

		// another post type
		$created = $this->service->findOrCreate( 'test_slug', 'test_option', 'test_title', 'test_content', null, null, 'sc_form');
		$this->assertEquals( 'sc_form', $created->post_type );

		// does not create twice.
		$another = $this->service->findOrCreate( 'test_slug', 'test_option', 'test_title', 'test_content', null, null, 'sc_form');
		$this->assertSame( $created->ID, $another->ID );
	}

	public function test_displayDefaultPageStatuses()
	{
		global $post;
		// checkout page.
		$created = $this->service->findOrCreate( 'test_slug', 'checkout', 'test_title', 'test_content');
		$post = $created;
		$this->assertSame($this->service->displayDefaultPageStatuses([]), ['Checkout Page']);

		// dashboard.
		$created = $this->service->findOrCreate( 'test_slug', 'dashboard', 'test_title', 'test_content');
		$post = $created;
		$this->assertSame($this->service->displayDefaultPageStatuses([]), ['Customer Dashboard']);

		// dashboard.
		$created = $this->service->findOrCreate( 'test_slug', 'order-confirmation', 'test_title', 'test_content');
		$post = $created;
		$this->assertSame($this->service->displayDefaultPageStatuses([]), ['Order Confirmation']);
	}
}
