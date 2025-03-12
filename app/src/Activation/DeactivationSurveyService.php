<?php
namespace SureCart\Activation;

/**
 * Service for plugin deactivation survey.
 */
class DeactivationSurveyService {

	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'registerDeactivationSurvey' ] );
	}

	/**
	 * Register deactivation survey.
	 *
	 * @return void
	 */
	public function registerDeactivationSurvey() {
		if ( ! class_exists( 'BSF_Analytics_Loader' ) ) {
			require_once SURECART_VENDOR_DIR . DIRECTORY_SEPARATOR . 'brainstormforce/bsf-analytics/class-bsf-analytics-loader.php';
		}

		$bsf_analytics = \BSF_Analytics_Loader::get_instance();

		$bsf_analytics->set_entity(
			[
				'surecart' => [
					'product_name'        => __( 'SureCart', 'surecart' ),
					'path'                => SURECART_VENDOR_DIR . DIRECTORY_SEPARATOR . 'brainstormforce/bsf-analytics',
					'author'              => __( 'SureCart', 'surecart' ),
					'deactivation_survey' => [
						[
							'id'                => 'deactivation-survey-surecart',
							'popup_logo'        => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ),
							'plugin_slug'       => 'surecart',
							'plugin_version'    => \SureCart::plugin()->version(),
							'popup_title'       => __( 'Quick Feedback', 'surecart' ),
							'support_url'       => 'https://surecart.com/support/',
							'popup_description' => __( 'If you have a moment, please share why you are deactivating SureCart:', 'surecart' ),
							'show_on_screens'   => [ 'plugins' ],
						],
					],
				],
			]
		);
	}
}
