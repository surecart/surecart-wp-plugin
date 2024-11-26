<?php

namespace SureCart\Tests\Services;

use SureCart\Sync\StoreSyncService;
use SureCart\Tests\SureCartUnitTestCase;

class StoreSyncServiceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * The service instance.
	 *
	 * @var StoreSyncService
	 */
	protected $service;

	/**
     * Set up the test environment before each test.
     */
    protected function setUp(): void
    {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

        $this->service = \Mockery::mock( StoreSyncService::class )->makePartial();
    }

	/**
     * Provide test account mock data.
     *
     * @return void
     */
    public function accountData()
    {
        return [
            'No option set'   => [null, 'test-id', true],
            'Same id'   => ['test-id', 'test-id', false],
            'Differnt id'  => ['test-id', 'test-id-2', true],
			'Empty id' => ['test-id', '', false],
			'Empty everything' => ['', '', false],
        ];
    }

	/**
     * Tests if flush rewrite rules was successful on account change.
     *
     * @dataProvider accountData
     *
     * @return void
     */
	public function test_triggers_sync_on_store_change( $stored_account, $plugin_account, $should_sync) {
		update_option( 'surecart_current_account_id', $stored_account );
		\SureCart::alias('account', function () use ($plugin_account) {
			return (object) [
				'id' => $plugin_account,
			];
		});
		$this->service->shouldReceive('sync')->times($should_sync ? 1 : 0)->andReturn(true);
        $this->service->maybeStartSync();
		if ( $should_sync ) {
        	$this->assertTrue( get_option( 'surecart_current_account_id' ) === $plugin_account );
		}
	}
}
