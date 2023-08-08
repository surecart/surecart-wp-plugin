<?php

namespace SureCart\Tests\Models;

use SureCart\Models\IncomingWebhook;
use SureCart\Tests\SureCartUnitTestCase;

class IncomingWebhookTest extends SureCartUnitTestCase {
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
	 * @group integration
	 */
	public function test_crud() {
		$not_found = IncomingWebhook::find(1);
		$this->assertWPError( $not_found );

		$created = IncomingWebhook::create([
			'webhook_id' => 'testid',
			'data' => [
				'foo' => 'bar'
			],
			'source' => 'surecart'
		]);

		$this->assertEquals( $created->webhook_id,'testid' );
		$this->assertEquals( $created->data,(object)['foo' => 'bar']);
		$this->assertEquals( $created->source,'surecart');
		$this->assertFalse($created->processed);
		$this->assertNotEmpty($created->id);
		$this->assertNotEmpty($created->created_at);

		$found = IncomingWebhook::find($created->id);
		$this->assertEquals($found->webhook_id,'testid');
		$this->assertEquals( $found->data,(object)['foo' => 'bar']);
		$this->assertFalse($found->processed);
		$this->assertNotEmpty($found->id);
		$this->assertNotEmpty($found->created_at);

		IncomingWebhook::create([
			'webhook_id' => 'testid2',
			'data' => [
				'foo' => 'bar2'
			],
			'processed' => true
		]);

		 // get and paginate.
		$get = IncomingWebhook::order_by('created_at')->get();
		$paginate = IncomingWebhook::order_by('created_at')->paginate(['per_page' => 1, 'page' => 1]);
		$this->assertCount(2,$get);
		$this->assertCount(1,$paginate);

		// find where.
		$find = IncomingWebhook::where('webhook_id','testid2')->first();
		$this->assertEquals($find->webhook_id,'testid2');
		$this->assertEquals($find->data->foo,'bar2');

		// find unprocessed
		$find_model = IncomingWebhook::whereNull('processed_at')->first();
		$this->assertEquals($find_model->webhook_id,'testid');

		$updated = IncomingWebhook::where('webhook_id', 'testid2')->update([
			'processed' => null
		]);
		$this->assertNotWPError($updated);
		$this->assertFalse($updated->processed);
	}

	/**
	 * @group failing
	 */
	public function test_can_fetch_older_than_30_days() {
		$date = new \DateTime();
		$date->modify('-31 days');
		$timestamp = $date->format('Y-m-d H:i:s');

		IncomingWebhook::create([
			'webhook_id' => 'testid2',
			'data' => [
				'foo' => 'bar2'
			],
			'created_at' => $timestamp
		]);

		$date = new \DateTime();
		$date->modify('-25 days');
		$timestamp = $date->format('Y-m-d H:i:s');

		IncomingWebhook::create([
			'webhook_id' => 'testid4',
			'data' => [
				'foo' => 'bar2'
			],
			'created_at' => $timestamp
		]);

		$date = new \DateTime();
		$older = IncomingWebhook::where('created_at', '<', $date->modify('-30 days')->format('Y-m-d H:i:s'))->get();
		$this->assertCount(1, $older);

		$deleted = IncomingWebhook::deleteExpired( '30 days' );
		$this->assertNotEmpty($deleted);
		$this->assertNotWPError($deleted);

		$all = IncomingWebhook::get();
		$this->assertCount(1, $all);
	}
}
