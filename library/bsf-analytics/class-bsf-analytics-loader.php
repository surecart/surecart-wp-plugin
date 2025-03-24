<?php
/**
 * BSF analytics loader file.
 *
 * @version 1.0.0
 *
 * @package bsf-analytics
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Class BSF_Analytics_Loader.
 */
class BSF_Analytics_Loader {

	/**
	 * Analytics Entities.
	 *
	 * @access private
	 * @var array Entities array.
	 */
	private $entities = array();

	/**
	 * Analytics Version.
	 *
	 * @access private
	 * @var float analytics version.
	 */
	private $analytics_version = '1.1.12';

	/**
	 * Analytics path.
	 *
	 * @access private
	 * @var string path array.
	 */
	private $analytics_path = '';

	/**
	 * Instance
	 *
	 * @access private
	 * @var object Class object.
	 */
	private static $instance = null;

	/**
	 * Get instace of class.
	 *
	 * @return object
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'load_analytics' ) );
	}

	/**
	 * Set entity for analytics.
	 *
	 * @param string $data Entity attributes data.
	 * @return void
	 */
	public function set_entity( $data ) {
		$this->entities = $data;
		$this->analytics_path = $data['surecart'][ 'path' ];
	}

	/**
	 * Load Analytics library.
	 *
	 * @return void
	 */
	public function load_analytics() {
		if ( file_exists( $this->analytics_path ) && ! class_exists( 'BSF_Analytics' ) ) {
			require_once $this->analytics_path . '/class-bsf-analytics.php';
			new BSF_Analytics( $this->entities, $this->analytics_path, $this->analytics_version );
		}
	}
}
