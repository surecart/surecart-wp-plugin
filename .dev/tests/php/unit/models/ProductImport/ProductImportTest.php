<?php

namespace SureCart\Tests\Models\Import;

use SureCart\Models\Import;
use SureCart\Models\ProductImport;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ProductImportTest extends SureCartUnitTestCase
{
    use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

    public function setUp() : void
    {
        parent::setUp();
        \SureCart::make()->bootstrap([
            'providers' => [
                \SureCartAppCore\AppCore\AppCoreServiceProvider::class,
				\SureCartAppCore\Config\ConfigServiceProvider::class,
				\SureCartAppCore\Assets\AssetsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Sync\SyncServiceProvider::class,
				\SureCart\WordPress\Posts\PostServiceProvider::class,
				\SureCart\WordPress\PostTypes\PostTypeServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
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

        ProductImport::create([
            'data' => [
                [
                    'name' => 'Product 1',
                    'content' => 'Product 1 content',
                ]
            ]
        ]);

        // assert the transient is set that checks the batch.
        $this->assertSame(array('surecart_import_content_synctest_import' => 'test_import'), get_transient('surecart_batches_check'));

        // get the patterns.
        $posts = get_posts([
            'post_type' => 'wp_block',
            'posts_per_page' => -1,
        ]);

        // assert the pattern
        $this->assertCount(1, $posts);
        $this->assertSame('Product 1 content', $posts[0]->post_content);
    }
}