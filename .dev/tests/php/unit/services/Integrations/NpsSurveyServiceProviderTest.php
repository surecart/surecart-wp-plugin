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

		// Reset the static flag between tests.
		$ref = new \ReflectionProperty( NpsSurveyServiceProvider::class, 'library_loaded' );
		$ref->setAccessible( true );
		$ref->setValue( null, false );
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

		// Should not throw or call bootstrap on the notice.
		$this->provider->bootstrap( $container );

		// Verify no hooks were added by the notice.
		$this->assertFalse( has_action( 'admin_footer', [ $container['surecart.nps.survey.notice'], 'showNpsNotice' ] ) );
	}

	public function test_bootstrap_registers_hooks_when_connected(): void {
		$container = \SureCart::container();
		$this->provider->register( $container );

		$container['surecart.account'] = (object) [ 'is_connected' => true ];

		$this->provider->bootstrap( $container );

		$this->assertNotFalse( has_action( 'admin_footer', [ $container['surecart.nps.survey.notice'], 'showNpsNotice' ] ) );
		$this->assertNotFalse( has_filter( 'nps_survey_post_data', [ $container['surecart.nps.survey.notice'], 'getNpsSurveyPostData' ] ) );
		$this->assertNotFalse( has_filter( 'nps_survey_api_endpoint', [ $container['surecart.nps.survey.notice'], 'getNpsSurveyApiEndpoint' ] ) );
		$this->assertNotFalse( has_filter( 'nps_survey_should_skip_status_update', [ $container['surecart.nps.survey.notice'], 'handleStatusUpdate' ] ) );
	}

	public function test_load_nps_survey_library_only_runs_once(): void {
		$container = \SureCart::container();
		$this->provider->register( $container );

		$container['surecart.account'] = (object) [ 'is_connected' => true ];

		// Call bootstrap twice.
		$this->provider->bootstrap( $container );
		$this->provider->bootstrap( $container );

		// The admin_init action from loadNpsSurveyLibrary should only be registered once.
		// Count the admin_footer registrations from notice->bootstrap() — called twice.
		// But the static flag in loadNpsSurveyLibrary prevents duplicate admin_init actions.
		$ref = new \ReflectionProperty( NpsSurveyServiceProvider::class, 'library_loaded' );
		$ref->setAccessible( true );
		$this->assertTrue( $ref->getValue() );
	}
}
