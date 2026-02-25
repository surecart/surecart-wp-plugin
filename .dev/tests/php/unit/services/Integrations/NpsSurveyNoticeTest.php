<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Integrations\NpsSurvey\NpsSurveyNotice;
use SureCart\Support\Encryption;
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

		delete_option( NpsSurveyNotice::SETUP_DATE_OPTION );
		delete_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION );
		delete_option( NpsSurveyNotice::NPS_SURVEY_ID );
		delete_option( 'sc_api_token' );
	}

	protected function callProtected( string $method ) {
		$ref = new \ReflectionMethod( NpsSurveyNotice::class, $method );
		$ref->setAccessible( true );
		return $ref->invoke( $this->notice );
	}

	protected function setApiToken(): void {
		update_option( 'sc_api_token', Encryption::encrypt( 'sc_test_token_123' ) );
	}

	protected function setSetupDate( int $days_ago ): void {
		update_option( NpsSurveyNotice::SETUP_DATE_OPTION, time() - $days_ago * DAY_IN_SECONDS );
	}

	protected function setLastSubmitted( int $days_ago ): void {
		update_option( NpsSurveyNotice::LAST_SUBMITTED_OPTION, time() - $days_ago * DAY_IN_SECONDS );
	}

	public function test_record_setup_date_stores_current_timestamp(): void {
		$before = time();
		$this->callProtected( 'recordSetupDate' );
		$after = time();

		$stored = (int) get_option( NpsSurveyNotice::SETUP_DATE_OPTION );
		$this->assertGreaterThanOrEqual( $before, $stored );
		$this->assertLessThanOrEqual( $after, $stored );
	}

	public function test_record_setup_date_does_not_overwrite_existing_date(): void {
		$original = time() - 10 * DAY_IN_SECONDS;
		update_option( NpsSurveyNotice::SETUP_DATE_OPTION, $original );

		$this->callProtected( 'recordSetupDate' );

		$this->assertSame( $original, get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_updated_records_setup_date_for_new_connection(): void {
		$this->assertFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );

		$this->notice->onApiTokenUpdated( 'sc_api_token', '', 'new_encrypted_token' );

		$this->assertNotFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_updated_does_not_overwrite_for_token_rotation(): void {
		$original = time() - 20 * DAY_IN_SECONDS;
		update_option( NpsSurveyNotice::SETUP_DATE_OPTION, $original );

		$this->notice->onApiTokenUpdated( 'sc_api_token', 'old_token', 'new_token' );

		$this->assertSame( $original, get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_updated_ignores_other_options(): void {
		$this->notice->onApiTokenUpdated( 'some_other_option', '', 'value' );

		$this->assertFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_updated_does_not_record_when_new_value_is_empty(): void {
		$this->notice->onApiTokenUpdated( 'sc_api_token', '', '' );

		$this->assertFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_added_records_setup_date(): void {
		$this->notice->onApiTokenAdded( 'sc_api_token', 'encrypted_token' );

		$this->assertNotFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_added_ignores_other_options(): void {
		$this->notice->onApiTokenAdded( 'siteurl', 'https://example.com' );

		$this->assertFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_on_api_token_added_does_not_record_when_value_is_empty(): void {
		$this->notice->onApiTokenAdded( 'sc_api_token', '' );

		$this->assertFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_is_setup_old_enough_returns_false_with_no_token_and_no_date(): void {
		$this->assertFalse( $this->callProtected( 'isSetupOldEnough' ) );
	}

	public function test_is_setup_old_enough_seeds_date_for_existing_user_and_returns_false(): void {
		$this->setApiToken();

		$this->assertFalse( $this->callProtected( 'isSetupOldEnough' ) );
		$this->assertNotFalse( get_option( NpsSurveyNotice::SETUP_DATE_OPTION ) );
	}

	public function test_is_setup_old_enough_returns_false_when_setup_is_recent(): void {
		$this->setSetupDate( 14 );

		$this->assertFalse( $this->callProtected( 'isSetupOldEnough' ) );
	}

	public function test_is_setup_old_enough_returns_false_one_second_before_threshold(): void {
		update_option(
			NpsSurveyNotice::SETUP_DATE_OPTION,
			time() - NpsSurveyNotice::DAYS_AFTER_SETUP * DAY_IN_SECONDS + 1
		);

		$this->assertFalse( $this->callProtected( 'isSetupOldEnough' ) );
	}

	public function test_is_setup_old_enough_returns_true_at_exactly_15_days(): void {
		$this->setSetupDate( NpsSurveyNotice::DAYS_AFTER_SETUP );

		$this->assertTrue( $this->callProtected( 'isSetupOldEnough' ) );
	}

	public function test_is_setup_old_enough_returns_true_when_setup_is_old(): void {
		$this->setSetupDate( 60 );

		$this->assertTrue( $this->callProtected( 'isSetupOldEnough' ) );
	}

	public function test_is_ready_to_show_returns_false_when_not_connected(): void {
		$this->setSetupDate( 20 );

		$this->assertFalse( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_false_when_setup_is_recent(): void {
		$this->setApiToken();
		$this->setSetupDate( 10 );

		$this->assertFalse( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_false_when_submitted_recently(): void {
		$this->setApiToken();
		$this->setSetupDate( 20 );
		$this->setLastSubmitted( 30 );

		$this->assertFalse( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_false_one_day_inside_90_day_window(): void {
		$this->setApiToken();
		$this->setSetupDate( 20 );
		$this->setLastSubmitted( NpsSurveyNotice::DAYS_BETWEEN_SURVEYS - 1 );

		$this->assertFalse( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_true_when_all_conditions_met(): void {
		$this->setApiToken();
		$this->setSetupDate( 20 );

		$this->assertTrue( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_true_when_90_days_have_passed_since_submission(): void {
		$this->setApiToken();
		$this->setSetupDate( 20 );
		$this->setLastSubmitted( NpsSurveyNotice::DAYS_BETWEEN_SURVEYS );

		$this->assertTrue( $this->callProtected( 'isReadyToShow' ) );
	}

	public function test_is_ready_to_show_returns_true_when_submitted_long_ago(): void {
		$this->setApiToken();
		$this->setSetupDate( 20 );
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

	public function test_show_nps_notice_outputs_nothing_when_not_connected(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );

		ob_start();
		$this->notice->showNpsNotice();
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	public function test_show_nps_notice_outputs_nothing_when_setup_is_recent(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );
		$this->setApiToken();
		$this->setSetupDate( 10 );

		ob_start();
		$this->notice->showNpsNotice();
		$output = ob_get_clean();

		$this->assertEmpty( $output );
	}

	public function test_show_nps_notice_outputs_nothing_when_submitted_recently(): void {
		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );
		$this->setApiToken();
		$this->setSetupDate( 20 );
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
}
