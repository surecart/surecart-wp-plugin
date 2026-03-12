<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Integrations\NpsSurvey\NpsSurveyNotice;
use SureCart\Integrations\NpsSurvey\NpsSurveyServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for NpsSurveyServiceProvider.
 *
 * @group nps-survey
 */
class NpsSurveyServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	protected NpsSurveyServiceProvider $provider;

	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[ 'providers' => [ \SureCart\WordPress\PluginServiceProvider::class ] ],
			false
		);

		$this->provider = new NpsSurveyServiceProvider();
	}

	public function test_register_adds_nps_survey_notice_to_container(): void {
		$container = \SureCart::container();

		$this->provider->register( $container );

		$this->assertInstanceOf( NpsSurveyNotice::class, $container['surecart.nps.survey.notice'] );
	}

	public function test_bootstrap_skips_when_not_connected(): void {
		$container = \SureCart::container();
		$this->provider->register( $container );

		$container['surecart.account'] = (object) [ 'is_connected' => false ];

		$this->provider->bootstrap( $container );

		// Should not register the current_screen hook.
		$this->assertFalse( has_action( 'current_screen', [ $this->provider, 'maybeLoadNpsSurvey' ] ) );
	}

	public function test_bootstrap_registers_current_screen_hook_when_connected(): void {
		$container = \SureCart::container();
		$this->provider->register( $container );

		$container['surecart.account'] = (object) [ 'is_connected' => true ];

		$this->provider->bootstrap( $container );

		$this->assertNotFalse( has_action( 'current_screen', [ $this->provider, 'maybeLoadNpsSurvey' ] ) );
	}

	public function test_maybe_load_nps_survey_skips_non_surecart_screens(): void {
		$container = \SureCart::container();
		$this->provider->register( $container );

		// Mock the pages service to return SureCart screen IDs.
		$page_service = \Mockery::mock( \SureCart\WordPress\Pages\PageService::class );
		$page_service->shouldReceive( 'getSureCartPageScreenIds' )->andReturn( [ 'toplevel_page_sc-dashboard' ] );
		\SureCart::alias( 'pages', function () use ( $page_service ) {
			return $page_service;
		} );

		// Mock a non-SureCart screen.
		set_current_screen( 'dashboard' );

		$this->provider->maybeLoadNpsSurvey();

		// Notice hooks should not be registered.
		$notice = $container['surecart.nps.survey.notice'];
		$this->assertFalse( has_action( 'admin_footer', [ $notice, 'showNpsNotice' ] ) );
	}
}
