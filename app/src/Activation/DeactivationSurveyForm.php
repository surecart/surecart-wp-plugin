<?php
namespace SureCart\Activation;

/**
 * Service for plugin deactivation survey form.
 */
class DeactivationSurveyForm {
	/**
	 * Feedback URL.
	 *
	 * @var string
	 */
	private $feedback_api_endpoint = 'api/plugin-deactivate';

	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// handle ajax request.
		add_action( 'wp_ajax_sc_plugin_deactivate_feedback', array( $this, 'sendPluginDeactivateFeedback' ) );

		// show feedback form on plugins screen.
		if ( $this->isPluginsScreen() ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'loadFormStyles' ) );
			add_action( 'admin_footer', array( $this, 'showFeedbackForm' ) );
		}
	}

	/**
	 * Render feedback HTML on plugins.php admin page only.
	 *
	 * This function renders the feedback form HTML on the plugins.php admin page.
	 * It takes an optional string parameter $id for the form wrapper ID and an optional array parameter $args for customizing the form.
	 *
	 * @since 1.1.6
	 * @return void
	 */
	public function showFeedbackForm() {
		// Set default arguments for the feedback form.
		$args = array(
			'source'            => 'User Deactivation Survey',
			'popup_reasons'     => $this->getDefaultReasons(),
			'popup_description' => __( 'If you have a moment, please share why you are deactivating the plugin.', 'surecart' ),
			'id'                => 'deactivation-survey-surecart',
			'popup_logo'        => esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/icon.svg' ),
			'plugin_slug'       => 'surecart',
			'plugin_version'    => \SureCart::plugin()->version(),
			'popup_title'       => __( 'Quick Feedback', 'surecart' ),
			'support_url'       => 'https://surecart.com/support/',
		);

		?>
		<div id="<?php echo esc_attr( $args['id'] ); ?>" class="uds-feedback-form--wrapper" style="display: none">
			<div class="uds-feedback-form--container">
				<div class="uds-form-header--wrapper">
					<div class="uds-form-title--icon-wrapper">
						<?php if ( ! empty( $args['popup_logo'] ) ) { ?>
							<img class="uds-icon" src="<?php echo esc_url( $args['popup_logo'] ); ?>" title="<?php echo esc_attr( $args['plugin_slug'] ); ?> <?php echo esc_attr( __( 'Icon', 'surecart' ) ); ?>" />
						<?php } ?>
						<h2 class="uds-title"><?php echo esc_html( $args['popup_title'] ); ?></h2>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="uds-close">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</div>
				<div class="uds-form-body--content">

					<?php if ( ! empty( $args['popup_description'] ) ) { ?>
						<p class="uds-form-description"><?php echo esc_html( $args['popup_description'] ); ?></p>
					<?php } ?>

					<form class="sc-feedback-form" id="sc-feedback-form" method="post">
						<?php foreach ( $args['popup_reasons'] as $key => $value ) { ?>
							<fieldset>
								<div class="reason">
									<input type="radio" class="uds-reason-input" name="uds_reason_input" id="uds_reason_input_<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $key ); ?>" data-placeholder="<?php echo esc_attr( $value['placeholder'] ); ?>" data-show_cta="<?php echo esc_attr( $value['show_cta'] ); ?>" data-accept_feedback="<?php echo esc_attr( $value['accept_feedback'] ); ?>">
									<label class="uds-reason-label" for="uds_reason_input_<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $value['label'] ); ?></label>
								</div>
							</fieldset>
						<?php } ?>

						<fieldset>
							<textarea class="uds-options-feedback hide" id="uds-options-feedback" rows="3" name="uds_options_feedback" placeholder="<?php echo esc_attr( __( 'Please tell us more details.', 'surecart' ) ); ?>"></textarea>
							<?php
							if ( ! empty( $args['support_url'] ) ) {
								?>
									<p class="uds-option-feedback-cta hide">
										<?php
										echo wp_kses_post(
											sprintf(
											/* translators: %1$s: link html start, %2$s: link html end*/
												__( 'Need help from our experts? %1$sClick here to contact us.%2$s' ),
												'<a href="' . esc_url( $args['support_url'] ) . '" target="_blank">',
												'</a>'
											)
										);
										?>
									</p>
							<?php } ?>
						</fieldset>

						<div class="uds-feedback-form-sumbit--actions">
						<button class="button button-primary uds-feedback-submit" data-action="submit"><?php esc_html_e( 'Submit & Deactivate', 'surecart' ); ?></button>
						<button class="button button-secondary uds-feedback-skip" data-action="skip"><?php esc_html_e( 'Skip & Deactivate', 'surecart' ); ?></button>
							<input type="hidden" name="referer" value="<?php echo esc_url( get_site_url() ); ?>">
							<input type="hidden" name="version" value="<?php echo esc_attr( $args['plugin_version'] ); ?>">
							<input type="hidden" name="source" value="<?php echo esc_attr( $args['plugin_slug'] ); ?>">
						</div>
					</form>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Load form styles.
	 *
	 * This function loads the necessary styles for the feedback form.
	 *
	 * @since 1.1.6
	 * @return void
	 */
	public function loadFormStyles() {
		wp_enqueue_script(
			'sc-plugin-deactivation-feedback-script',
			plugins_url( 'dist/scripts/plugin-deactivation-feedback.js', SURECART_PLUGIN_FILE ),
			array( 'jquery' ),
			\SureCart::plugin()->version(),
			true
		);

		// Add localize JS.
		wp_localize_script(
			'sc-plugin-deactivation-feedback-script',
			'scUdsVars',
			array(
				'ajaxurl'        => esc_url( admin_url( 'admin-ajax.php' ) ),
				'_ajax_nonce'    => wp_create_nonce( 'sc_plugin_deactivate_feedback' ),
				'_current_theme' => function_exists( 'wp_get_theme' ) ? wp_get_theme()->get_template() : '',
				'_plugin_slug'   => array( 'surecart' ),
			)
		);

		wp_enqueue_style( 'sc-plugin-deactivation-feedback-style', plugins_url( 'dist/styles/plugin-deactivation-feedback.css', SURECART_PLUGIN_FILE ), array(), \SureCart::plugin()->version() );
		wp_style_add_data( 'sc-plugin-deactivation-feedback-style', 'rtl', 'replace' );
	}

	/**
	 * Sends plugin deactivation feedback to the server.
	 *
	 * This function checks the user's permission and verifies the nonce for the request.
	 * If the checks pass, it sends the feedback data to the server for processing.
	 *
	 * @return void
	 */
	public function sendPluginDeactivateFeedback() {
		/**
		 * Nonce verification
		 */
		if ( ! check_ajax_referer( 'sc_plugin_deactivate_feedback', 'security', false ) ) {
			wp_send_json_error( array( 'message' => __( 'Nonce validation failed', 'surecart' ) ) );
		}

		/**
		 * Check permission
		 */
		if ( ! current_user_can( 'delete_plugins' ) ) {
			wp_send_json_error( array( 'message' => __( 'Sorry, you are not allowed to do this operation.', 'surecart' ) ) );
		}

		/**
		 * Get the feedback data.
		 */
		$feedback_data = array(
			'reason'      => isset( $_POST['reason'] ) ? sanitize_text_field( wp_unslash( $_POST['reason'] ) ) : '',
			'feedback'    => isset( $_POST['feedback'] ) ? sanitize_text_field( wp_unslash( $_POST['feedback'] ) ) : '',
			'domain_name' => isset( $_POST['referer'] ) ? sanitize_text_field( wp_unslash( $_POST['referer'] ) ) : '',
			'version'     => isset( $_POST['version'] ) ? sanitize_text_field( wp_unslash( $_POST['version'] ) ) : '',
			'plugin'      => isset( $_POST['source'] ) ? sanitize_text_field( wp_unslash( $_POST['source'] ) ) : '',
		);

		/**
		 * Send the feedback data to the server.
		 */
		wp_safe_remote_post(
			$this->getApiUrl() . $this->feedback_api_endpoint,
			array(
				'body'     => wp_json_encode( $feedback_data ),
				'headers'  => array(
					'Content-Type' => 'application/json',
					'Accept'       => 'application/json',
				),
				'blocking' => false, // don't wait for the response.
			)
		);

		/**
		 * Send success response.
		 */
		wp_send_json_success();
	}

	/**
	 * Get the array of default reasons.
	 *
	 * @return array Default reasons.
	 */
	public function getDefaultReasons() {
		return apply_filters(
			'uds_default_deactivation_reasons',
			array(
				'temporary_deactivation' => array(
					'label'           => esc_html__( 'This is a temporary deactivation for testing.', 'surecart' ),
					'placeholder'     => esc_html__( 'How can we assist you?', 'surecart' ),
					'show_cta'        => 'false',
					'accept_feedback' => 'false',
				),
				'plugin_not_working'     => array(
					'label'           => esc_html__( 'Something isn\'t working properly.', 'surecart' ),
					'placeholder'     => esc_html__( 'Please tell us more about what went wrong?', 'surecart' ),
					'show_cta'        => 'true',
					'accept_feedback' => 'true',
				),
				'found_better_plugin'    => array(
					'label'           => esc_html__( 'I found a better alternative.', 'surecart' ),
					'placeholder'     => esc_html__( 'Could you please specify which solution?', 'surecart' ),
					'show_cta'        => 'false',
					'accept_feedback' => 'true',
				),
				'missing_a_feature'      => array(
					'label'           => esc_html__( 'It\'s missing a specific feature.', 'surecart' ),
					'placeholder'     => esc_html__( 'Please tell us more about the feature.', 'surecart' ),
					'show_cta'        => 'false',
					'accept_feedback' => 'true',
				),
				'other'                  => array(
					'label'           => esc_html__( 'Other', 'surecart' ),
					'placeholder'     => esc_html__( 'Please tell us more details.', 'surecart' ),
					'show_cta'        => 'false',
					'accept_feedback' => 'true',
				),
			)
		);
	}

	/**
	 * Check if the current screen is allowed for the survey.
	 *
	 * This function checks if the current screen is one of the allowed screens for displaying the survey.
	 * It uses the `get_current_screen` function to get the current screen information and compares it with the list of allowed screens.
	 *
	 * The function is accurate for identifying the main plugins screen, but doesn't account for:
	 * - Network admin plugins screen (plugins.php in multisite)
	 * - AJAX requests that might be triggered from the plugins screen
	 * - Early admin page loads where get_current_screen() might not be available yet
	 *
	 * @return bool True if the current screen is allowed, false otherwise.
	 */
	public function isPluginsScreen() {
		// Check if we are in the admin area.
		if ( ! is_admin() ) {
			return false;
		}

		// Handle case where function is called before get_current_screen() is available.
		if ( ! function_exists( 'get_current_screen' ) ) {
			// Alternative check: look at the current admin page URL.
			global $pagenow;
			return 'plugins.php' === $pagenow;
		}

		// Get the current screen.
		$current_screen = get_current_screen();

		// Check if $current_screen is a valid object before accessing its properties.
		if ( ! is_object( $current_screen ) ) {
			return false; // Return false if current screen is not valid.
		}

		// Get the current screen ID.
		$screen_id = $current_screen->id;

		// Check for both regular and network admin plugins screens.
		return ! empty( $screen_id ) && ( 'plugins' === $screen_id || 'plugins-network' === $screen_id );
	}

	/**
	 * Get API URL for sending analytics.
	 *
	 * @return string API URL.
	 */
	public function getApiUrl() {
		return defined( 'BSF_ANALYTICS_API_BASE_URL' ) ? BSF_ANALYTICS_API_BASE_URL : 'https://analytics.brainstormforce.com/';
	}
}
