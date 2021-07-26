<?php
namespace CheckoutEngine\Settings;

/**
 * Class to extend settings registration.
 */
abstract class RegisterSetting {
	/**
	 * Slug for the setting
	 *
	 * @since 1.0
	 * @var string $slug
	 */
	protected $name;

	/**
	 * Setting REST API Schema
	 *
	 * @var array
	 */
	protected $schema;

	/**
	 * Register the setting.
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'checkout_engine/rest/settings/schema', [ $this, 'registerSchema' ] );
		add_filter( 'checkout_engine/rest/settings/index', [ $this, 'index' ], 10, 2 );
		add_filter( 'checkout_engine/rest/settings/update', [ $this, 'handleUpdate' ] );
	}

	/**
	 * Get the attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return mixed
	 */
	public function __get( $key ) {
		return $this->$key;
	}

	/**
	 * Register the settings schema for REST API requests.
	 *
	 * @param array $schema Schema for requests.
	 *
	 * @return array
	 */
	public function registerSchema( $schema ) {
		$schema[ $this->name ] = $this->schema;
		return $schema;
	}

	/**
	 * Add our data to the index.
	 *
	 * @param array $settings Array of settings data.
	 *
	 * @return array
	 */
	public function addToIndex( $settings, $params ) {
		$settings[ $this->name ] = $this->index( $settings, $params );
		return $settings;
	}

	/**
	 * Handle the setting update.
	 *
	 * @param array $settings Array of settings.
	 * @param array $params Array of params.
	 *
	 * @return array
	 */
	protected function handleUpdate( $settings, $params ) {
		$settings[ $this->name ] = $this->update( $params );
		return $settings;
	}

	/**
	 * What to return when settings are indexed.
	 */
	public function index( $settings, $params ) {
		return [];
	}

	/**
	 * What to return when settings are updated.
	 */
	public function update() {
		return [];
	}
}
