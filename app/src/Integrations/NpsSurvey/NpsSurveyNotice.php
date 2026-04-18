<?php

namespace SureCart\Integrations\NpsSurvey;

use Nps_Survey;

/**
 * Nps Survey Notice.
 */
class NpsSurveyNotice {
	/**
	 * Option name for last NPS submission date.
	 *
	 * @var string
	 */
	public const LAST_SUBMITTED_OPTION = 'surecart_nps_last_submitted';

	/**
	 * NPS Survey ID used in the library.
	 *
	 * @var string
	 */
	public const NPS_SURVEY_ID = 'nps-survey-surecart';

	/**
	 * Number of days after setup before showing NPS survey.
	 *
	 * @var int
	 */
	public const DAYS_AFTER_SETUP = 15;

	/**
	 * Minimum days between NPS survey displays.
	 *
	 * @var int
	 */
	public const DAYS_BETWEEN_SURVEYS = 90;

	/**
	 * Ottokit Webhook URL for NPS survey submissions.
	 *
	 * @var string
	 */
	public const OTTOKIT_WEBHOOK_URL = 'https://webhook.ottokit.com/ottokit/01f97dac-ade0-4d21-b9a4-c788ca28da22';

	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'nps_survey_post_data', [ $this, 'getNpsSurveyPostData' ], 10 );
		add_filter( 'nps_survey_api_endpoint', [ $this, 'getNpsSurveyApiEndpoint' ], 11, 2 );
		add_filter( 'nps_survey_should_skip_status_update', [ $this, 'handleStatusUpdate' ], 10, 2 );
		add_filter( 'nps_survey_vars', [ $this, 'ensureNpsSurveyVars' ], 10 );
		add_filter( 'script_loader_src', [ $this, 'forceNpsAssetSrc' ], 10, 2 );
		add_filter( 'style_loader_src', [ $this, 'forceNpsAssetSrc' ], 10, 2 );
		add_action( 'admin_footer', [ $this, 'showNpsNotice' ], 999 );
	}

	/**
	 * Check all conditions to determine if the survey should be shown.
	 *
	 * @return bool
	 */
	protected function isReadyToShow(): bool {
		// Must not have been submitted within the last 90 days.
		$last_submitted = get_option( self::LAST_SUBMITTED_OPTION );
		if ( $last_submitted && time() - (int) $last_submitted < self::DAYS_BETWEEN_SURVEYS * DAY_IN_SECONDS ) {
			return false;
		}

		return true;
	}

	/**
	 * Handle NPS survey status updates.
	 *
	 * On submission, we skip the library's permanent dismiss and instead
	 * store our own timestamp so we can re-show the survey after 90 days.
	 *
	 * @param bool  $skip Whether to skip the status update.
	 * @param array $data Data about the action (nps_id, action_type, plugin_slug, etc.).
	 * @return bool
	 */
	public function handleStatusUpdate( bool $skip, array $data ): bool {
		$plugin_slug = $data['plugin_slug'] ?? $data['nps_id'] ?? '';

		// Only handle SureCart's NPS survey.
		if ( 'surecart' !== $plugin_slug && self::NPS_SURVEY_ID !== $plugin_slug ) {
			return $skip;
		}

		if ( 'submit' === ( $data['action_type'] ?? '' ) ) {
			// Store our own submission timestamp for the 90-day re-show window.
			update_option( self::LAST_SUBMITTED_OPTION, time(), false );

			// Skip the library's permanent dismiss so we can re-show after 90 days.
			return true;
		}

		return $skip;
	}

	/**
	 * Enrich NPS survey post data with SureCart account info.
	 *
	 * @param array $post_data Post data.
	 * @return array
	 */
	public function getNpsSurveyPostData( array $post_data ): array {
		if ( 'surecart' !== ( $post_data['plugin_slug'] ?? '' ) ) {
			return $post_data;
		}

		$account                   = \SureCart::account();
		$post_data['is_free_plan'] = $account->plan->free ?? true;
		$post_data['plan_slug']    = $account->plan->name ?? '';

		return $post_data;
	}

	/**
	 * Override the NPS survey API endpoint for SureCart.
	 *
	 * @param string $api_endpoint Default API endpoint.
	 * @param array  $post_data    Post data.
	 * @return string
	 */
	public function getNpsSurveyApiEndpoint( string $api_endpoint, array $post_data ): string {
		if ( 'surecart' !== ( $post_data['plugin_slug'] ?? '' ) ) {
			return $api_endpoint;
		}

		return self::OTTOKIT_WEBHOOK_URL;
	}

	/**
	 * Ensure NPS survey vars include a valid REST API nonce for admins.
	 *
	 * @param array $vars Localized script variables.
	 * @return array
	 */
	public function ensureNpsSurveyVars( array $vars ): array {
		if ( empty( $vars['rest_api_nonce'] ) && current_user_can( 'manage_options' ) ) {
			$vars['rest_api_nonce'] = wp_create_nonce( 'wp_rest' );
		}

		return $vars;
	}

	/**
	 * Map of NPS survey asset handles to their corresponding filenames.
	 *
	 * @var array<string, string>
	 */
	private const NPS_ASSET_MAP = [
		'nps-survey-script' => 'main.js',
		'nps-survey-style'  => 'style-main.css',
	];

	/**
	 * Force NPS survey assets to load from SureCart's vendor copy on SureCart admin pages.
	 *
	 * @param string $src    Asset source URL.
	 * @param string $handle Asset handle name.
	 * @return string
	 */
	public function forceNpsAssetSrc( string $src, string $handle ): string {
		$filename = self::NPS_ASSET_MAP[ $handle ] ?? null;
		if ( ! $filename ) {
			return $src;
		}

		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->id, \SureCart::pages()->getSureCartPageScreenIds(), true ) ) {
			return $src;
		}

		$query = wp_parse_url( $src, PHP_URL_QUERY );

		return plugins_url( 'vendor/brainstormforce/nps-survey/dist/' . $filename, SURECART_PLUGIN_FILE )
			. ( $query ? '?' . $query : '' );
	}

	/**
	 * Show the NPS survey notice in the admin footer.
	 *
	 * @return void
	 */
	public function showNpsNotice(): void {
		// Only show on SureCart admin pages.
		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->id, \SureCart::pages()->getSureCartPageScreenIds(), true ) ) {
			return;
		}

		if ( ! class_exists( 'Nps_Survey' ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! $this->isReadyToShow() ) {
			return;
		}

		Nps_Survey::show_nps_notice(
			self::NPS_SURVEY_ID,
			[
				'show_if'          => true,
				'dismiss_timespan' => self::DAYS_BETWEEN_SURVEYS * DAY_IN_SECONDS,
				'display_after'    => self::DAYS_AFTER_SETUP * DAY_IN_SECONDS,
				'dismiss_count'    => 0, // We handle dismissals ourselves in handleStatusUpdate().
				'plugin_slug'      => 'surecart',
				'allow_review'     => true, // Enables promoter (8-10) vs non-promoter (<8) split.
				'show_on_screens'  => \SureCart::pages()->getSureCartPageScreenIds(),
				'message'          => [
					// Rating step.
					'logo'                  => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/icon.svg' ),
					'plugin_name'           => __( 'SureCart', 'surecart' ),
					'nps_rating_message'    => __( 'How likely are you to recommend #pluginname to your friends or colleagues?', 'surecart' ),

					// Promoters (score 8-10): "plugin-rating" step.
					'feedback_title'        => __( 'Wow, we appreciate the feedback! 😀', 'surecart' ),
					'feedback_content'      => __( "Thanks. This means a lot!\n\nIf you've got a minute, a review on WordPress would mean the world to us. It helps others find us and keeps our momentum strong.", 'surecart' ),
					'plugin_rating_link'    => esc_url( 'https://wordpress.org/support/plugin/surecart/reviews/#new-post' ),

					// General score (score 1-7): "comment" step — default for all scores < 8.
					'plugin_rating_title'   => __( 'Thanks for your honest feedback! 😊', 'surecart' ),
					'plugin_rating_content' => __( "We'd love to understand what's not working or what's missing for you. What can SureCart improve to earn a higher score from you?", 'surecart' ),
				],
			]
		);
	}
}
