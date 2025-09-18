<?php

namespace SureCart\Tests\Models\Import;

use SureCart\Models\Import;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ImportTest extends SureCartUnitTestCase
{
    use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

    public function setUp() : void
    {
        parent::setUp();
        \SureCart::make()->bootstrap([
            'providers' => [
                \SureCart\WordPress\PluginServiceProvider::class,
                \SureCart\Sync\SyncServiceProvider::class,
            ]
        ], false);
    }

    public function test_imports_products()
    {
        // Create a mock for the RequestService
        $requests = \Mockery::mock(RequestService::class)->makePartial();

        // Set expectation that makeRequest should be called with specific arguments
        $requests->shouldReceive('makeRequest')
            ->once()
            ->withSomeOfArgs('imports/products')
            ->andReturn((object) [
                'id' => 'test_import',
            ]);

        // Mock the unAuthorizedRequest alias to use our mock
        \SureCart::alias('request', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        Import::queue('products', [
            'products' => [
                [
                    'name' => 'Product 1',
                ]
            ]
        ]);
    }

    public function test_queues_content_for_syncing() {
         // Create a mock for the RequestService
         $requests = \Mockery::mock(RequestService::class)->makePartial();

         // Set expectation that makeRequest should be called with specific arguments
         $requests->shouldReceive('makeRequest')
             ->once()
             ->withSomeOfArgs('imports/products')
             ->andReturn((object) [
                 'id' => 'test_import',
             ]);
 
         // Mock the unAuthorizedRequest alias to use our mock
         \SureCart::alias('request', function () use ($requests) {
             return call_user_func_array([$requests, 'makeRequest'], func_get_args());
         });
 
         Import::queue('products', [
             'products' => [
                 [
                     'name' => 'Product 1',
                 ]
             ]
         ]);
    }
}