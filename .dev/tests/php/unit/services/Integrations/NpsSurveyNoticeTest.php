<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Integrations\NpsSurvey\NpsSurveyNotice;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Tests for NpsSurveyNotice's trigger logics.
 *
 * @group nps-survey
 */
class NpsSurveyNoticeTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	protected NpsSurveyNotice $notice;

	public function setUp(): void {
		parent::setUp();

		\SureCart::make()->bootstrap(
			[ 'providers' => [ \SureCart\WordPress\PluginServiceProvider::class ] ],
			false
		);

		$this->notice = new NpsSurveyNotice();

		delete_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION );
		delete_option( NpsSurveyNotice::NPS_SURVEY_ID );
	}

	protected function callProtected( string $method ) {
		$ref = new \ReflectionMethod( NpsSurveyNotice::class, $method );
		$ref->setAccessible( true );
		return $ref->invoke( $this->notice );
	}

	protected function setLastSubmitted( int $days_ago ): void {
		update_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION, time() - $days_ago * DAY_IN_SECONDS );
	}

	public function test_is_ready_to_show_returns_true_when_never_submitted(): void {
		$this->assertTrue( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_false_when_submitted_recently(): void {
		$this->setLastSubmitted( 30 );

		$this->assertFalse( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_false_one_day_inside_90_day_window(): void {
		$this->setLastSubmitted( NpsSurveyNotice::DAYS_BETWEEN_SURVEYS - 1 );

		$this->assertFalse( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_true_when_90_days_have_passed_since_submission(): void {
		$this->setLastSubmitted( NpsSurveyNotice::DAYS_BETWEEN_SURVEYS );

		$this->assertTrue( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_true_when_submitted_long_ago(): void {
		$this->setLastSubmitted( 120 );

		$this->assertTrue( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_handle_status_update_skips_dismiss_and_records_timestamp_on_submit(): void {
		$before = time();

		$result = $this->notice->handleStatusUpdate(
			false,
			[ 'plugin_slug' => 'surecart', 'action_type' => 'submit', 'nps_id' => NpsSurveyNotice::NPS_SURVEY_ID ]
		);

		$after  = time();
		$stored = (int) get_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION );

		$this->assertTrue( $result );
		$this->assertGreaterThanOrEqual( $before, $stored );
		$this->assertLessThanOrEqual( $after, $stored );
	}

	public function test_handle_status_update_matches_by_nps_id_when_plugin_slug_is_absent(): void {
		$result = $this->notice->handleStatusUpdate(
			false,
			[ 'nps_id' => NpsSurveyNotice::NPS_SURVEY_ID, 'action_type' => 'submit' ]
		);

		$this->assertTrue( $result );
		$this->assertNotFalse( get_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION ) );
	}

	public function test_handle_status_update_does_not_skip_dismiss_action(): void {
		$result = $this->notice->handleStatusUpdate(
			false,
			[ 'plugin_slug' => 'surecart', 'action_type' => 'dismiss', 'nps_id' => NpsSurveyNotice::NPS_SURVEY_ID ]
		);

		$this->assertFalse( $result );
		$this->assertFalse( get_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION ) );
	}

	public function test_handle_status_update_passes_through_for_other_plugins(): void {
		$result = $this->notice->handleStatusUpdate(
			false,
			[ 'plugin_slug' => 'some-other-plugin', 'action_type' => 'submit', 'nps_id' => 'nps-survey-some-other-plugin' ]
		);

		$this->assertFalse( $result );
		$this->assertFalse( get_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION ) );
	}

	public function test_handle_status_update_preserves_pre_skipped_state_for_other_plugins(): void {
		$result = $this->notice->handleStatusUpdate(
			true,
			[ 'plugin_slug' => 'another-plugin', 'action_type' => 'submit' ]
		);

		$this->assertTrue( $result );
	}

	public function test_show_nps_notice_outputs_nothing_for_non_admin(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'subscriber' ] ) );

		ob_start();
		$this->notice->showNpsNotice();
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	public function test_show_nps_notice_outputs_nothing_when_library_not_available(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );

		ob_start();
		$this->notice->showNpsNotice();
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	public function test_show_nps_notice_outputs_nothing_when_submitted_recently(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );
		$this->setLastSubmitted( 45 );

		ob_start();
		$this->notice->showNpsNotice();
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	public function test_get_nps_survey_post_data_passes_through_for_other_plugins(): void {
		$input = [ 'plugin_slug' => 'another-plugin', 'rating' => 9 ];

		$this->assertSame( $input, $this->notice->getNpsSurveyPostData( $input ) );
	}

	public function test_get_nps_survey_post_data_adds_plan_info_for_surecart(): void {
		\SureCart::make()->bootstrap(
			[ 'providers' => [ \SureCart\WordPress\PluginServiceProvider::class ] ],
			false
		);

		\SureCart::alias( 'account', function () {
			return (object) [ 'plan' => (object) [ 'free' => true, 'name' => 'starter' ] ];
		} );

		$result = $this->notice->getNpsSurveyPostData( [ 'plugin_slug' => 'surecart', 'rating' => 7 ] );

		$this->assertTrue( $result['is_free_plan'] );
		$this->assertSame( 'starter', $result['plan_slug'] );
	}

	public function test_get_nps_survey_api_endpoint_passes_through_for_other_plugins(): void {
		$default = 'https://metrics.brainstormforce.com/wp-json/bsf-metrics-server/v1/nps-survey/';

		$this->assertSame( $default, $this->notice->getNpsSurveyApiEndpoint( $default, [ 'plugin_slug' => 'another-plugin' ] ) );
	}

	public function test_get_nps_survey_api_endpoint_returns_surecart_webhook_for_surecart(): void {
		$result = $this->notice->getNpsSurveyApiEndpoint( 'https://metrics.brainstormforce.com/...', [ 'plugin_slug' => 'surecart' ] );

		$this->assertSame( NpsSurveyNotice::OTTOKIT_WEBHOOK_URL, $result );
	}

	public function test_ensure_nps_survey_vars_fills_missing_nonce_for_admin(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->notice->ensureNpsSurveyVars( [ 'ajaxurl' => '/wp-admin/admin-ajax.php', 'rest_api_nonce' => '' ] );

		$this->assertNotEmpty( $result['rest_api_nonce'] );
	}

	public function test_ensure_nps_survey_vars_preserves_existing_nonce(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );

		$result = $this->notice->ensureNpsSurveyVars( [ 'rest_api_nonce' => 'existing_nonce' ] );

		$this->assertSame( 'existing_nonce', $result['rest_api_nonce'] );
	}

	public function test_ensure_nps_survey_vars_does_not_set_nonce_for_non_admin(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'subscriber' ] ) );

		$result = $this->notice->ensureNpsSurveyVars( [ 'rest_api_nonce' => '' ] );

		$this->assertEmpty( $result['rest_api_nonce'] );
	}

	private function setUpSureCartScreen(): void {
		\SureCart::alias( 'pages', function () {
			return new class {
				public function getSureCartPageScreenIds() {
					return [ 'toplevel_page_sc-dashboard' ];
				}
			};
		} );

		set_current_screen( 'toplevel_page_sc-dashboard' );
	}

	public function test_force_nps_asset_src_overrides_script_on_surecart_screens(): void {
		$this->setUpSureCartScreen();

		$astra_src = 'https://example.com/wp-content/themes/astra/inc/lib/nps-survey/dist/main.js?ver=1.0.0';
		$result    = $this->notice->forceNpsAssetSrc( $astra_src, 'nps-survey-script' );

		$this->assertStringContainsString( 'vendor/brainstormforce/nps-survey/dist/main.js', $result );
		$this->assertStringNotContainsString( 'astra', $result );
	}

	public function test_force_nps_asset_src_overrides_style_on_surecart_screens(): void {
		$this->setUpSureCartScreen();

		$astra_src = 'https://example.com/wp-content/themes/astra/inc/lib/nps-survey/dist/style-main.css?ver=1.0.0';
		$result    = $this->notice->forceNpsAssetSrc( $astra_src, 'nps-survey-style' );

		$this->assertStringContainsString( 'vendor/brainstormforce/nps-survey/dist/style-main.css', $result );
		$this->assertStringNotContainsString( 'astra', $result );
	}

	public function test_force_nps_asset_src_preserves_query_string(): void {
		$this->setUpSureCartScreen();

		$src    = 'https://example.com/nps-survey/dist/main.js?ver=1.2.3';
		$result = $this->notice->forceNpsAssetSrc( $src, 'nps-survey-script' );

		$this->assertStringEndsWith( '?ver=1.2.3', $result );
	}

	public function test_force_nps_asset_src_handles_src_without_query_string(): void {
		$this->setUpSureCartScreen();

		$src    = 'https://example.com/nps-survey/dist/main.js';
		$result = $this->notice->forceNpsAssetSrc( $src, 'nps-survey-script' );

		$this->assertStringContainsString( 'vendor/brainstormforce/nps-survey/dist/main.js', $result );
		$this->assertStringNotContainsString( '?', $result );
	}

	public function test_force_nps_asset_src_passes_through_for_unrelated_handles(): void {
		$src    = 'https://example.com/some-other-script.js?ver=1.0.0';
		$result = $this->notice->forceNpsAssetSrc( $src, 'some-other-script' );

		$this->assertSame( $src, $result );
	}

	public function test_force_nps_asset_src_passes_through_on_non_surecart_screens(): void {
		\SureCart::alias( 'pages', function () {
			return new class {
				public function getSureCartPageScreenIds() {
					return [ 'toplevel_page_sc-dashboard' ];
				}
			};
		} );

		set_current_screen( 'dashboard' );

		$astra_src = 'https://example.com/wp-content/themes/astra/inc/lib/nps-survey/dist/main.js?ver=1.0.0';
		$result    = $this->notice->forceNpsAssetSrc( $astra_src, 'nps-survey-script' );

		$this->assertSame( $astra_src, $result );
	}

	public function test_force_nps_asset_src_returns_null_when_src_is_null(): void {
		$this->setUpSureCartScreen();

		// Query Monitor enumerates dependency-only handles with src=null on the front end.
		$result = $this->notice->forceNpsAssetSrc( null, 'nps-survey-script' );

		$this->assertNull( $result );
	}

	public function test_force_nps_asset_src_returns_src_unchanged_when_handle_is_null(): void {
		$this->setUpSureCartScreen();

		$src    = 'https://example.com/nps-survey/dist/main.js?ver=1.0.0';
		$result = $this->notice->forceNpsAssetSrc( $src, null );

		$this->assertSame( $src, $result );
	}

	public function test_force_nps_asset_src_returns_src_unchanged_when_handle_not_in_map_on_surecart_screen(): void {
		$this->setUpSureCartScreen();

		$src    = 'https://example.com/some-other-script.js?ver=1.0.0';
		$result = $this->notice->forceNpsAssetSrc( $src, 'some-unrelated-handle' );

		$this->assertSame( $src, $result );
	}

	public function test_force_nps_asset_src_rewrites_to_vendor_copy_on_surecart_screen_preserving_query_string(): void {
		$this->setUpSureCartScreen();

		$src    = 'https://example.com/wp-content/themes/astra/inc/lib/nps-survey/dist/main.js?ver=1.2.3';
		$result = $this->notice->forceNpsAssetSrc( $src, 'nps-survey-script' );

		$this->assertIsString( $result );
		$this->assertStringContainsString( 'vendor/brainstormforce/nps-survey/dist/main.js', $result );
		$this->assertStringEndsWith( '?ver=1.2.3', $result );
		$this->assertStringNotContainsString( 'astra', $result );
	}
}
