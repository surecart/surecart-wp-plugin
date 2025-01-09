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
		add_action( 'admin_footer', [ $this, 'show_nps_notice' ], 999 );
	}

	/**
	 * Show NPS Notice.
	 *
	 * @return void
	 */
	public function show_nps_notice(): void {
		Nps_Survey::show_nps_notice(
			'nps-survey-surecart',
			array(
				'show_if'          => true,
				'dismiss_timespan' => 2 * MINUTE_IN_SECONDS, // 2 * WEEK_IN_SECONDS,
				'display_after'    => 0,
				'plugin_slug'      => 'surecart',
				'message'          => array(
					// Step 1 i.e rating input.
					'logo'                  => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ),
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
			)
		);
	}
}
