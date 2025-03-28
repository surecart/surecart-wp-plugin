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
		add_action( 'init', array( $this, 'loadAnalytics' ) );
	}

	/**
	 * Load analytics.
	 *
	 * @return void
	 */
	public function loadAnalytics() {
		// If not in a admin area then return it.
		if ( ! is_admin() ) {
			return;
		}

		add_action( 'admin_footer', array( $this, 'loadDeactivationSurveyForm' ) );
	}

	/**
	 * Function to load the deactivation survey form on the admin footer.
	 *
	 * The form is configured with specific settings for plugin. Example: For CartFlows, including the source, logo, plugin slug, title, support URL, description, and the screen on which to show the form.
	 *
	 * @return void
	 */
	public function loadDeactivationSurveyForm() {
		\SureCart::deactivationForm()->showFeedbackForm(
			[
				'id'                => 'deactivation-survey-surecart',
				'popup_logo'        => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/icon.svg' ),
				'plugin_slug'       => 'surecart',
				'plugin_version'    => \SureCart::plugin()->version(),
				'popup_title'       => 'Quick Feedback',
				'support_url'       => 'https://surecart.com/support/',
				'popup_description' => 'If you have a moment, please share why you are deactivating SureCart:',
				'show_on_screens'   => [ 'plugins' ],
			]
		);
	}
}
