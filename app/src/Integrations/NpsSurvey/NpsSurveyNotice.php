<?php

namespace SureCart\Integrations\NpsSurvey;

use Nps_Survey;

/**
 * Nps Survey Notice.
 */
class NpsSurveyNotice {
	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_footer', [ $this, 'showNpsNotice' ], 999 );
		add_filter( 'nps_survey_post_data', [ $this, 'getNpsSurveyPostData' ], 10 );
		add_filter( 'nps_survey_api_endpoint', [ $this, 'getNpsSurveyApiEndpoint' ], 11, 2 );
	}

	/**
	 * Get NPS Survey Post Data.
	 *
	 * @param array $post_data Post Data.
	 *
	 * @return array
	 */
	public function getNpsSurveyPostData( array $post_data ): array {
		if ( 'surecart' !== $post_data['plugin_slug'] ) {
			return $post_data;
		}

		$post_data['is_free_plan'] = \SureCart::account()->plan->free ?? true;
		$post_data['plan_slug']    = \SureCart::account()->plan->name ?? '';

		return $post_data;
	}

	/**
	 * Get NPS Survey API Endpoint.
	 *
	 * @param string $api_endpoint API Endpoint.
	 * @param array  $post_data    Post Data.
	 *
	 * @return string
	 */
	public function getNpsSurveyApiEndpoint( string $api_endpoint, array $post_data ): string {
		if ( 'surecart' !== $post_data['plugin_slug'] ) {
			return $api_endpoint;
		}

		return 'https://webhook.suretriggers.com/suretriggers/01f97dac-ade0-4d21-b9a4-c788ca28da22';
	}

	/**
	 * Show NPS Notice.
	 *
	 * @return void
	 */
	public function showNpsNotice(): void {
		// Load only if has manage_options capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		Nps_Survey::show_nps_notice(
			'nps-survey-surecart',
			array(
				'show_if'          => true,
				'dismiss_timespan' => 1 * WEEK_IN_SECONDS,
				'dismiss_count'    => 1,
				'display_after'    => 0,
				'plugin_slug'      => 'surecart',
				'message'          => array(
					// Step 1 i.e rating input.
					'logo'                  => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/icon.svg' ),
					'plugin_name'           => __( 'SureCart', 'surecart' ),
					'nps_rating_message'    => __( 'How likely are you to recommend #pluginname to your friends or colleagues?', 'surecart' ),

					// Step 2A i.e. positive.
					'feedback_title'        => __( 'Thanks a lot for your feedback! 😍', 'surecart' ),
					'feedback_content'      => __( 'Could you please do us a favor and give us a 5-star rating on WordPress? It would help others choose Starter Templates with confidence. Thank you!', 'surecart' ),
					'plugin_rating_link'    => esc_url( 'https://wordpress.org/support/plugin/surecart/reviews/#new-post' ),

					// Step 2B i.e. negative.
					'plugin_rating_title'   => __( 'Thank you for your feedback', 'surecart' ),
					'plugin_rating_content' => __( 'We value your input. How can we improve your experience?', 'surecart' ),
				),
				'show_on_screens'  => \SureCart::pages()->getSureCartPageScreenIds(),
			)
		);
	}
}
