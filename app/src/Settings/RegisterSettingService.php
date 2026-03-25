<?php

namespace SureCart\Settings;

/**
 * Settings registration service.
 */
class RegisterSettingService {
	/**
	 * Our setting prefix.
	 *
	 * @var string
	 */
	protected $prefix = 'surecart_';

	/**
	 * Holds the option group name.
	 *
	 * @var string
	 */
	protected $option_group;

	/**
	 * Holds the option name.
	 *
	 * @var string
	 */
	protected $option_name;

	/**
	 * Holds the options args.
	 *
	 * @var array
	 */
	protected $args = [];

	/**
	 * The autoload value for this option, or null to use WordPress default.
	 *
	 * @var bool|null
	 */
	protected $autoload;

	/**
	 * The full prefixed option name.
	 *
	 * @var string
	 */
	protected $full_option_name;

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
	 *     @type bool       $autoload          Whether to autoload this option. Omit to use WordPress default.
	 */
	public function __construct( $option_group, $option_name, $args = [] ) {
		$this->option_group     = $option_group;
		$this->full_option_name = $this->prefix . $option_name;
		$this->option_name      = $option_name;
		$this->autoload         = array_key_exists( 'autoload', $args ) ? $args['autoload'] : null;
		$this->args             = array_diff_key( $args, [ 'autoload' => '' ] );
	}

	/**
	 * Call registration hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_init', [ $this, 'registerSetting' ] );
		add_action( 'rest_api_init', [ $this, 'registerSetting' ] );

		if ( null !== $this->autoload ) {
			add_filter( 'wp_default_autoload_value', [ $this, 'filterAutoload' ], 10, 3 );
		}
	}

	/**
	 * Filter the default autoload value for this option.
	 *
	 * @param string|null $autoload The default autoload value.
	 * @param string      $option   The option name.
	 * @param mixed       $value    The option value.
	 *
	 * @return string|null
	 */
	public function filterAutoload( $autoload, $option, $value ) {
		if ( $this->full_option_name !== $option ) {
			return $autoload;
		}

		return $this->autoload ? 'yes' : 'no';
	}

	/**
	 * Register the setting
	 *
	 * @return void
	 */
	public function registerSetting() {
		register_setting(
			$this->option_group,
			$this->full_option_name,
			$this->args,
		);
	}
}
