<?php

namespace SureCart\Settings;

use SureCart\WordPress\RecaptchaValidationService;

/**
 * A service for registering settings.
 */
class SettingService {
	/**
	 * Boostrap settings.
	 *
	 * @return void
	 */
	public function bootstrap() {
		$this->register(
			'general',
			'theme',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => 'light',
			]
		);
		$this->register(
			'general',
			'honeypot_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
				'default'           => true,
			]
		);
		$this->register(
			'general',
			'recaptcha_enabled',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
		$this->register(
			'general',
			'recaptcha_site_key',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'general',
			'recaptcha_secret_key',
			[
				'type'              => 'string',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'general',
			'recaptcha_min_score',
			[
				'type'              => 'number',
				'show_in_rest'      => true,
				'default'           => 0.5,
				'sanitize_callback' => 'sanitize_text_field',
			]
		);
		$this->register(
			'general',
			'load_stripe_js',
			[
				'type'              => 'boolean',
				'show_in_rest'      => true,
				'sanitize_callback' => 'boolval',
			]
		);
	}

	/**
	 * Register a setting.
	 *
	 * @param string $option_group A settings group name. Should correspond to an allowed option key name.
	 *                             Default allowed option key names include 'general', 'discussion', 'media',
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
	 * Recaptcha service.
	 *
	 * @return RecaptchaValidationService
	 */
	public function recaptcha() {
		return new RecaptchaValidationService();
	}
}
