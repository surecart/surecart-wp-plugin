<?php

namespace SureCart\Tests\Models\ProvisionalAccount;

use SureCart\Models\ProvisionalAccount;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ProvisionalAccountTest extends SureCartUnitTestCase
{
    use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

    public function setUp() : void
    {
        parent::setUp();
        \SureCart::make()->bootstrap([
            'providers' => [
                \SureCart\WordPress\PluginServiceProvider::class,
            ]
        ], false);
    }

    public function test_makes_unauthorized_request()
    {
        // Create a mock for the RequestService
        $requests = \Mockery::mock(RequestService::class)->makePartial();

        // Set expectation that makeRequest should be called with specific arguments
        $requests->shouldReceive('makeRequest')
            ->once()
            ->andReturn((object) [
                'id' => 'test_provisional_account',
                'account_name' => 'Test Account',
            ]);

        // Mock the unAuthorizedRequest alias to use our mock
        \SureCart::alias('unAuthorizedRequest', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        // This should trigger the unAuthorizedRequest alias
        $result = ProvisionalAccount::create();

        // Assert the result is what we expect
        $this->assertEquals('test_provisional_account', $result->id);
        $this->assertEquals('Test Account', $result->account_name);
    }

    public function test_does_not_make_request_if_setup_is_complete()
    {
        $provisional_account = \Mockery::mock(ProvisionalAccount::class)->shouldAllowMockingProtectedMethods()->makePartial();
        $provisional_account->shouldReceive('hasApiToken')->once()->andReturn(true);
        $provisional_account->shouldReceive('isTesting')->once()->andReturn(false);

        $account = $provisional_account->create();
        $this->assertWPError($account);
        $this->assertEquals('setup_complete', $account->get_error_code());
    }

    public function test_seeds_account_products() {
        $provisional_account = \Mockery::mock(ProvisionalAccount::class)->shouldAllowMockingProtectedMethods()->makePartial();

        // Create a mock for the RequestService
        $requests = \Mockery::mock(RequestService::class)->makePartial();

        // Set expectation that makeRequest should be called with specific arguments
        $requests->shouldReceive('makeRequest')
          ->once()
          ->andReturn((object) [
              'id' => 'test_provisional_account',
              'account_name' => 'Test Account',
          ]);

        // Mock the unAuthorizedRequest alias to use our mock
        \SureCart::alias('unAuthorizedRequest', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        $provisional_account->shouldReceive('seed')->once()->andReturn(true);

       $provisional_account::create(
            [
                'products' => [
                    [
                        'name' => 'Product 1',
                    ]
                ]
            ]
        );
    }
}