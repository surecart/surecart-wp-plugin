<?php
namespace SureCart\Activation;

/**
 * Service for plugin deactivation survey.
 */
class DeactivationSurveyService {

	/**
	 * Analytics key.
	 *
	 * @var string
	 */
	private $analytics_key = 'surecart';

	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		$this->registerDeactivationSurvey();
	}

	/**
	 * Register deactivation survey.
	 *
	 * @return void
	 */
	public function registerDeactivationSurvey() {
		update_site_option( $this->analytics_key . '_analytics_optin', 'no' ); // We do not want to track the user.
		if ( ! class_exists( 'Astra_Notices' ) ) { // BSF Analytics is dependent on Astra Notices.
			require_once SURECART_VENDOR_DIR . DIRECTORY_SEPARATOR . 'astra-notices/class-astra-notices.php';
		}

		if ( ! class_exists( 'BSF_Analytics_Loader' ) ) {
			require_once SURECART_VENDOR_DIR . DIRECTORY_SEPARATOR . 'brainstormforce/bsf-analytics/class-bsf-analytics-loader.php';
		}

		$bsf_analytics = \BSF_Analytics_Loader::get_instance();

		$bsf_analytics->set_entity(
			[
				$this->analytics_key => [
					'product_name'        => 'SureCart',
					'path'                => SURECART_VENDOR_DIR . DIRECTORY_SEPARATOR . 'brainstormforce/bsf-analytics',
					'author'              => 'SureCart',
					'deactivation_survey' => [
						[
							'id'                => 'deactivation-survey-surecart',
							'popup_logo'        => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/icon.svg' ),
							'plugin_slug'       => 'surecart',
							'plugin_version'    => \SureCart::plugin()->version(),
							'popup_title'       => 'Quick Feedback',
							'support_url'       => 'https://surecart.com/support/',
							'popup_description' => 'If you have a moment, please share why you are deactivating SureCart:',
							'show_on_screens'   => [ 'plugins' ],
						],
					],
				],
			]
		);
	}
}
