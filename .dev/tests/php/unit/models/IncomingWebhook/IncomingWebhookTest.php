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
	 * @group failing
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

		$this->assertSame($created->webhook_id,'testid');
		$this->assertSame( $created->data,['foo' => 'bar']);
		$this->assertSame( $created->source,'surecart');
		$this->assertFalse($created->processed);
		$this->assertNotEmpty($created->id);
		$this->assertNotEmpty($created->created_at);

		$found = IncomingWebhook::find($created->id);
		$this->assertSame($found->webhook_id,'testid');
		$this->assertSame( $found->data,['foo' => 'bar']);
		$this->assertFalse($found->processed);
		$this->assertNotEmpty($found->id);
		$this->assertNotEmpty($found->created_at);

		IncomingWebhook::create([
			'webhook_id' => 'testid2',
			'data' => [
				'foo' => 'bar2'
			],
			'processed' => current_time( 'mysql' )
		]);

		 // get and paginate.
		$get = IncomingWebhook::order_by('created_at')->get();
		$paginate = IncomingWebhook::order_by('created_at')->paginate(['per_page' => 1, 'page' => 1]);
		$this->assertCount(2,$get);
		$this->assertCount(1,$paginate);

		// find where.
		$find = IncomingWebhook::where('webhook_id','testid2')->first();
		$this->assertSame($find->webhook_id,'testid2');
		$this->assertSame($find->data['foo'],'bar2');

		// find unprocessed
		$find_model = IncomingWebhook::whereNull('processed')->first();
		$this->assertSame($find_model->webhook_id,'testid');

		$updated = IncomingWebhook::where('webhook_id', 'testid2')->update([
			'processed' => null
		]);
		$this->assertNotWPError($updated);
		$this->assertFalse($updated->processed);
	}
}
