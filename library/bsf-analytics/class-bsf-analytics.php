<?php
/**
 * BSF analytics class file.
 *
 * @version 1.0.0
 *
 * @package bsf-analytics
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'BSF_Analytics' ) ) {

	/**
	 * BSF analytics
	 */
	class BSF_Analytics {

		/**
		 * Member Variable
		 *
		 * @var array Entities data.
		 */
		private $entities;

		/**
		 * Setup actions, load files.
		 *
		 * @param array  $args entity data for analytics.
		 * @param string $analytics_path directory path to analytics library.
		 * @param float  $analytics_version analytics library version.
		 * @since 1.0.0
		 */
		public function __construct( $args, $analytics_path, $analytics_version ) {
			// Bail when no analytics entities are registered.
			if ( empty( $args ) ) {
				return;
			}

			$this->entities = $args;

			define( 'BSF_ANALYTICS_VERSION', $analytics_version );
			define( 'BSF_ANALYTICS_URI', $this->get_analytics_url( $analytics_path ) );


			$this->includes();

			$this->load_deactivation_survey_actions();
		}

		/**
		 * Function to load the deactivation survey form actions.
		 *
		 * @since 1.1.6
		 * @return void
		 */
		public function load_deactivation_survey_actions() {

			// If not in a admin area then return it.
			if ( ! is_admin() ) {
				return;
			}

			add_filter( 'uds_survey_vars', array( $this, 'add_slugs_to_uds_vars' ) );
			add_action( 'admin_footer', array( $this, 'load_deactivation_survey_form' ) );
		}

		/**
		 * BSF Analytics URL
		 *
		 * @param string $analytics_path directory path to analytics library.
		 * @return String URL of bsf-analytics directory.
		 * @since 1.0.0
		 */
		public function get_analytics_url( $analytics_path ) {

			$content_dir_path = wp_normalize_path( WP_CONTENT_DIR );

			$analytics_path = wp_normalize_path( $analytics_path );

			return str_replace( $content_dir_path, content_url(), $analytics_path );
		}

		/**
		 * Load analytics stat class.
		 *
		 * @since 1.0.0
		 */
		private function includes() {
			require_once __DIR__ . '/classes/class-bsf-analytics-helper.php';

			// Loads all the modules.
			require_once __DIR__ . '/modules/deactivation-survey/classes/class-deactivation-survey-feedback.php';
		}

		/**
		 * Function to load the deactivation survey form on the admin footer.
		 *
		 * This function checks if the Deactivation_Survey_Feedback class exists and if so, it loads the deactivation survey form.
		 * The form is configured with specific settings for plugin. Example: For CartFlows, including the source, logo, plugin slug, title, support URL, description, and the screen on which to show the form.
		 *
		 * @since 1.1.6
		 * @return void
		 */
		public function load_deactivation_survey_form() {
			if ( class_exists( 'Deactivation_Survey_Feedback' ) ) {
				foreach ( $this->entities as $key => $data ) {
					// If the deactibation_survery info in available then only add the form.
					if ( ! empty( $data['deactivation_survey'] ) && is_array( $data['deactivation_survey'] ) ) {
						foreach ( $data['deactivation_survey'] as $key => $survey_args ) {
							Deactivation_Survey_Feedback::show_feedback_form(
								$survey_args
							);
						}
					}
				}
			}
		}

		/**
		 * Function to add plugin slugs to Deactivation Survey vars for JS operations.
		 *
		 * @param array $vars UDS vars array.
		 * @return array Modified UDS vars array with plugin slugs.
		 * @since 1.1.6
		 */
		public function add_slugs_to_uds_vars( $vars ) {
			foreach ( $this->entities as $key => $data ) {
				if ( ! empty( $data['deactivation_survey'] ) && is_array( $data['deactivation_survey'] ) ) {
					foreach ( $data['deactivation_survey'] as $key => $survey_args ) {
						$vars['_plugin_slug'] = isset( $vars['_plugin_slug'] ) ? array_merge( $vars['_plugin_slug'], array( $survey_args['plugin_slug'] ) ) : array( $survey_args['plugin_slug'] );
					}
				}
			}

			return $vars;
		}
	}
}
