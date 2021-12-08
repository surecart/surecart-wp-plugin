<?php

namespace CheckoutEngine\Settings;

/**
 * Service for registering a new setting.
 */
class SettingsService {
	/**
	 * Holds our registered settings.
	 *
	 * @var array
	 */
	private $settings = [];

	/**
	 * The Singleton's instance is stored in a static field. This field is an
	 * array, because we'll allow our Singleton to have subclasses. Each item in
	 * this array will be an instance of a specific Singleton's subclass. You'll
	 * see how this works in a moment.
	 */
	private static $instances = [];

	/**
	 * The Singleton's constructor should always be private to prevent direct
	 * construction calls with the `new` operator.
	 */
	final private function __construct() { }

	/**
	 * Singletons should not be cloneable.
	 */
	protected function __clone() { }

	/**
	 * Singletons should not be restorable from strings.
	 */
	public function __wakeup() {
		throw new \Exception( 'Cannot unserialize a singleton.' );
	}

	/**
	 * This is the static method that controls the access to the singleton
	 * instance. On the first run, it creates a singleton object and places it
	 * into the static field. On subsequent runs, it returns the client existing
	 * object stored in the static field.
	 *
	 * This implementation lets you subclass the Singleton class while keeping
	 * just one instance of each subclass around.
	 */
	public static function getInstance() {
		$cls = static::class;
		if ( ! isset( self::$instances[ $cls ] ) ) {
			self::$instances[ $cls ] = new static();
		}

		return self::$instances[ $cls ];
	}

	/**
	 * Register the setting.
	 *
	 * @param string $class Classname to initialize.
	 */
	public function register( $class ) {
		if ( ! class_exists( $class ) ) {
			return;
		}

		// Create a new instance of the setting.
		$registered = new $class();

		if ( method_exists( $registered, 'register' ) ) {
			$registered->register();
			$this->settings[ $class ] = $registered;
		}
	}

	/**
	 * Get all registered settings
	 *
	 * @return array
	 */
	public function getRegisteredSettings() {
		return $this->settings;
	}
}
