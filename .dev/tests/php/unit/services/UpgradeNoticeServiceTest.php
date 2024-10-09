<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\UpgradeNoticeService;

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
        $this->assertTrue($this->service->shouldShowUpdateNotice('3.0.0'));
	}

    /**
	 * @group upgrade-notice
	 *
	 * @return void
	 */
    public function test_should_not_show_update_notice_for_lower_version() {
        $this->assertFalse($this->service->shouldShowUpdateNotice('1.9.9'));
    }

    /**
	 * @group upgrade-notice
	 *
	 * @return void
	 */
    public function test_should_not_show_update_notice_for_non_numeric_version() {
        $this->assertFalse($this->service->shouldShowUpdateNotice('3.0-beta'));
    }
}
