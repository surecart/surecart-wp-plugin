<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\User;

/**
 * Base controller for dashboard pages.
 */
abstract class BaseController {
	/**
	 * Get a query param.
	 *
	 * @param string $name The query param name.
	 * @param mixed  $fallback The fallback value.
	 *
	 * @return string|false
	 */
	protected function getParam( $name, $fallback = false ) {
		return isset( $_GET[ $name ] ) ? sanitize_text_field( wp_unslash( $_GET[ $name ] ) ) : $fallback;
	}
	/**
	 * Get the current tab.
	 *
	 * @return string|false
	 */
	protected function getTab() {
		return $this->getParam( 'tab' );
	}

	/**
	 * Get the current page.
	 *
	 * @return integer
	 */
	protected function getPage() {
		return $this->getParam( 'page', 1 );
	}

	/**
	 * Get the current id.
	 *
	 * @return integer|false
	 */
	protected function getId() {
		return $this->getParam( 'id' );
	}

	/**
	 * Get the users customer ids.
	 *
	 * @return array
	 */
	protected function customerIds() {
		return array_values( (array) User::current()->customerIds() );
	}

	/**
	 * Render not found view.
	 *
	 * @return string
	 */
	protected function notFound() {
		return '<sc-alert type="danger" open>' . esc_html__( 'Not found.', 'surecart' ) . '</sc-alert>';
	}

	/**
	 * Render not found view.
	 *
	 * @return string
	 */
	protected function noAccess() {
		return '<sc-alert type="danger" open>' . esc_html__( 'You do not have permission to do this.', 'surecart' ) . '</sc-alert>';
	}

	protected function isLiveMode() {
		if ( 'false' === sanitize_text_field( wp_unslash( $_GET['live_mode'] ?? '' ) ) ) {
			return false;
		}
		return true;
	}
}
