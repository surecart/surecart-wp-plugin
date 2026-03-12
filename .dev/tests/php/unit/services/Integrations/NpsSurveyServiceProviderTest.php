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

		// Should not register any hooks.
		$notice = $container['surecart.nps.survey.notice'];
		$this->assertFalse( has_action( 'admin_footer', [ $notice, 'showNpsNotice' ] ) );
		$this->assertFalse( has_filter( 'nps_survey_post_data', [ $notice, 'getNpsSurveyPostData' ] ) );
	}

	public function test_bootstrap_registers_hooks_when_connected(): void {
		$container = \SureCart::container();
		$this->provider->register( $container );

		$container['surecart.account'] = (object) [ 'is_connected' => true ];

		$this->provider->bootstrap( $container );

		$notice = $container['surecart.nps.survey.notice'];
		$this->assertNotFalse( has_action( 'admin_footer', [ $notice, 'showNpsNotice' ] ) );
		$this->assertNotFalse( has_filter( 'nps_survey_post_data', [ $notice, 'getNpsSurveyPostData' ] ) );
		$this->assertNotFalse( has_filter( 'nps_survey_api_endpoint', [ $notice, 'getNpsSurveyApiEndpoint' ] ) );
		$this->assertNotFalse( has_filter( 'nps_survey_should_skip_status_update', [ $notice, 'handleStatusUpdate' ] ) );
	}
}
