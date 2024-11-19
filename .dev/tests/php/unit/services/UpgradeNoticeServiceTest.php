<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\UpgradeNoticeService;
use SureCart\WordPress\PluginService;

class UpgradeNoticeServiceTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @var UpgradeNoticeService
	 */
	protected $service;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		parent::setUp();

        $this->service = new UpgradeNoticeService(\SureCart::app());

        $this->service->show_update_notice_versions = [
            '3.0.0',
            '1.9.9'
        ];
	}

   /**
	 * @group upgrade-notice
	 *
	 * @return void
	 */
	public function test_should_show_update_notice_for_available_higher_version() {
		\SureCart::alias('plugin', function () {
			return new class {
				public function version() {
					return '2.0.0';
				}
			};
		});
        $this->assertTrue($this->service->shouldShowUpdateNotice());
	}

    /**
	 * @group upgrade-notice
	 *
	 * @return void
	 */
    public function test_should_not_show_update_notice_for_higher_current_version() {
		\SureCart::alias('plugin', function () {
			return new class {
				public function version() {
					return '3.0.1';
				}
			};
		});
        $this->assertFalse($this->service->shouldShowUpdateNotice());
    }

    /**
	 * @group upgrade-notice
	 *
	 * @return void
	 */
    public function test_should_show_update_notice_for_non_numeric_version() {
		\SureCart::alias('plugin', function () {
			return new class {
				public function version() {
					return '3.0-beta';
				}
			};
		});
        $this->assertTrue($this->service->shouldShowUpdateNotice());
    }
}
