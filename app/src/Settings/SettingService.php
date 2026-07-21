<?php

namespace SureCart\Settings;

use SureCart\WordPress\RecaptchaValidationService;
use SureCart\Routing\PermalinksSettingsService;

/**
 * A service for registering settings.
 */
class SettingService {
	/**
	 * Per-user meta key for the "Introducing Modern View" onboarding modal
	 * dismissal flag. Stored as user_meta (not a site option) so each admin
	 * dismisses for themselves — onboarding is inherently per-user.
	 */
	const MODERN_VIEW_INTRO_DISMISSED_META = 'surecart_modern_view_intro_dismissed';

	/**
	 * Boostrap settings.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'init', [ $this, 'registerSettings' ] );
		add_action( 'admin_post_sc_set_enhanced_admin_views', [ $this, 'handleSetEnhancedAdminViews' ] );
		add_action( 'wp_ajax_sc_dismiss_modern_view_intro', [ $this, 'handleDismissModernViewIntro' ] );
	}

	/**
	 * Handle setting enhanced admin views.
	 *
	 * @return void
	 */
	public function handleSetEnhancedAdminViews() {
		check_admin_referer( 'sc_set_enhanced_admin_views' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to change this setting.', 'surecart' ), '', [ 'response' => 403 ] );
		}

		$value = isset( $_POST['value'] ) ? (bool) absint( wp_unslash( $_POST['value'] ) ) : false;
		update_option( 'surecart_enhanced_admin_views', $value );

		$redirect = isset( $_POST['redirect_to'] ) ? esc_url_raw( wp_unslash( $_POST['redirect_to'] ) ) : admin_url();
		wp_safe_redirect( $redirect );
		exit;
	}

	/**
	 * Mark the Modern View intro modal as dismissed for the current user.
	 *
	 * @return void
	 */
	public function handleDismissModernViewIntro() {
		check_admin_referer( 'sc_dismiss_modern_view_intro' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( [ 'message' => __( 'Not logged in.', 'surecart' ) ], 401 );
		}

		update_user_meta( get_current_user_id(), self::MODERN_VIEW_INTRO_DISMISSED_META, 1 );

		wp_send_json_success( [ 'dismissed' => true ] );
	}

	/**
	 * Whether the current user has dismissed the Modern View intro modal.
	 *
	 * @return bool
	 */
	public static function isModernViewIntroDismissed(): bool {
		if ( ! is_user_logged_in() ) {
			return false;
		}
		return (bool) get_user_meta( get_current_user_id(), self::MODERN_VIEW_INTRO_DISMISSED_META, true );
	}

	/**
	 * Build the `modern_view_intro` data bag consumed by the React modal.
	 *
	 * @return array
	 */
	public static function getModernViewIntroData(): array {
		return [
			'enabled'       => (bool) get_option( 'surecart_enhanced_admin_views', true ),
			'dismissed'     => self::isModernViewIntroDismissed(),
			'image_url'     => trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/dataview/modern-view-change.svg',
			'toggle_id'     => 'sc-enhanced-views-toggle',
			'dismiss_url'   => admin_url( 'admin-ajax.php' ),
			'dismiss_nonce' => wp_create_nonce( 'sc_dismiss_modern_view_intro' ),
		];
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function registerSettings() {
		$this->register(
			'surecart',
			'auto_sync_user_to_customer',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => false,
			]
		);
		$this->register(
			'surecart',
			'honeypot_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'recaptcha_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
		$this->register(
			'surecart',
			'recaptcha_site_key',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'recaptcha_secret_key',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'recaptcha_min_score',
			[
				'type'              => 'number',
				'show_in_rest'      => true,
				'default'           => 0.5,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'load_stripe_js',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
		$this->register(
			'surecart',
			'google_map_api_key_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
		$this->register(
			'surecart',
			'google_map_api_key',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'tracking_confirmation',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
		$this->register(
			'surecart',
			'tracking_confirmation_message',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'default'           => esc_html__( 'Your email and cart are saved so we can send email reminders about this order.', 'surecart' ),
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'buy_link_logo_width',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'default'           => '180px',
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'cart_menu_alignment',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => 'right',
			]
		);
		$this->register(
			'surecart',
			'cart_menu_always_shown',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'cart_menu_selected_ids',
			[
				'type'         => 'array',
				'items'        => 'integer',
				'show_in_rest' => [
					'schema' => [
						'type'  => 'array',
						'items' => [
							'type' => 'integer',
						],
					],
				],
			]
		);
		$this->register(
			'surecart',
			'cart_icon',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => 'shopping-bag', // shopping-bag, shopping-cart.
			]
		);
		$this->register(
			'surecart',
			'cart_icon_type',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => 'floating_icon', // both, floating_icon, menu_icon.
			]
		);
		$this->register(
			'surecart',
			'admin_toolbar_disabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => false,
			]
		);
		$this->register(
			'surecart',
			'password_validation_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => false,
			]
		);
		$this->register(
			'surecart',
			'checkout_show_login_prompt',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'checkout_geo_capture_title',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'checkout_geo_capture_content',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => [ $this, 'sanitizeRichContent' ],
			]
		);
		$this->register(
			'surecart',
			'checkout_geo_capture_allow_label',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'checkout_geo_capture_decline_label',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'shop_admin_menu',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'cart_admin_menu',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'checkout_admin_menu',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'dashboard_admin_menu',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'unrestricted_test_mode',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
		$this->register(
			'surecart',
			'hide_help_widget',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => false,
			]
		);
		$this->register(
			'surecart',
			'currency_switcher_alignment',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => 'right',
			]
		);
		$this->register(
			'surecart',
			'currency_switcher_selected_ids',
			[
				'type'         => 'array',
				'items'        => 'integer',
				'show_in_rest' => [
					'schema' => [
						'type'  => 'array',
						'items' => [
							'type' => 'integer',
						],
					],
				],
			]
		);
		$this->register(
			'surecart',
			'currency_geolocation_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'currency_locale',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'surecart',
			'hide_verified_buyer_badge',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => false,
			]
		);
		$this->register(
			'surecart',
			'learn_admin_menu',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'surecart',
			'learn_completed_steps',
			[
				'type'              => 'array',
				'show_in_rest'      => [
					'schema' => [
						'type'  => 'array',
						'items' => [
							'type' => 'string',
						],
					],
				],
				'default'           => [],
				'autoload'          => false,
				'sanitize_callback' => function ( $value ) {
					if ( ! is_array( $value ) ) {
						return [];
					}
					return array_values(
						array_unique(
							array_filter(
								array_map( 'sanitize_key', $value )
							)
						)
					);
				},
			]
		);
		$this->register(
			'surecart',
			'learn_total_steps',
			[
				'type'              => 'integer',
				'show_in_rest'      => true,
				'sanitize_callback' => 'absint',
				'default'           => 24,
				'autoload'          => false,
			]
		);
		$this->register(
			'surecart',
			'mcp_abilities_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
				'autoload'          => false,
			]
		);
		$this->register(
			'surecart',
			'mcp_edit_abilities_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
				'autoload'          => false,
			]
		);
		$this->register(
			'surecart',
			'mcp_delete_abilities_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
				'autoload'          => false,
			]
		);
		$this->register(
			'surecart',
			'enhanced_admin_views',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
				'autoload'          => true,
			]
		);
	}
	/**
	 * Register a setting.
	 *
	 * @param string $option_group A settings group name. Should correspond to an allowed option key name.
	 *                             Default allowed option key names include 'surecart', 'discussion', 'media',
	 *                             'reading', 'writing', and 'options'.
	 * @param string $option_name The name of an option to sanitize and save.
	 * @param array  $args {
	 *     Data used to describe the setting when registered.
	 *
	 *     @type string     $type              The type of data associated with this setting.
	 *                                         Valid values are 'string', 'boolean', 'integer', 'number', 'array', and 'object'.
	 *     @type string     $description       A description of the data attached to this setting.
	 *     @type callable   $sanitize_callback A callback function that sanitizes the option's value.
	 *     @type bool|array $show_in_rest      Whether data associated with this setting should be included in the REST API.
	 *                                         When registering complex settings, this argument may optionally be an
	 *                                         array with a 'schema' key.
	 *     @type mixed      $default           Default value when calling `get_option()`.
	 */
	public function register( $option_group, $option_name, $args = [] ) {
		$service = new RegisterSettingService( $option_group, $option_name, $args );
		return $service->register();
	}

	/**
	 * Sanitize rich (post) content, normalizing "visually empty" editor output
	 * (e.g. "<p></p>") to an empty string.
	 *
	 * The block/rich text editor submits "<p></p>" for an empty field, which
	 * wp_kses_post preserves as a non-empty string. That breaks empty-value
	 * default fallbacks. Collapsing it to '' keeps the emptiness contract
	 * consistent with the plain-text settings sanitized via sanitize_text_field.
	 *
	 * @param string $value Raw setting value.
	 * @return string Sanitized content, or '' when visually empty.
	 */
	public function sanitizeRichContent( $value ) {
		$value = wp_kses_post( (string) $value );

		// Keep media-only content (no text) as non-empty.
		if ( preg_match( '/<(img|iframe|video|audio|embed|object|svg)\b/i', $value ) ) {
			return $value;
		}

		// Collapse "<p></p>", "<p><br></p>", "&nbsp;" and whitespace to ''.
		$text = trim( wp_strip_all_tags( str_replace( '&nbsp;', ' ', $value ) ) );

		return '' === $text ? '' : $value;
	}

	/**
	 * Recaptcha service.
	 *
	 * @return RecaptchaValidationService
	 */
	public function recaptcha() {
		return new RecaptchaValidationService();
	}

	/**
	 * Get the option.
	 *
	 * @return mixed
	 */
	public function get( $name, $default = false ) {
		return get_option( 'surecart_' . $name, $default );
	}

	/**
	 * Get the number of remaining learn steps.
	 *
	 * @return int
	 */
	public function getLearnRemainingSteps() {
		$total     = (int) $this->get( 'learn_total_steps', 24 );
		$completed = $this->get( 'learn_completed_steps', [] );
		return max( 0, $total - count( (array) $completed ) );
	}

	/**
	 * Get the permalinks settings.
	 *
	 * @return PermalinksSettingsService
	 */
	public function permalinks() {
		return new PermalinksSettingsService();
	}
}
