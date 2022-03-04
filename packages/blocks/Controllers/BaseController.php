<?php
namespace CheckoutEngineBlocks\Controllers;

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
		return $this->getParam( 'page' );
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
	 * Render not found view.
	 *
	 * @return string
	 */
	protected function notFound() {
		return '<ce-alert type="danger" open>' . esc_html__( 'Not found.', 'checkout-engine' ) . '</ce-alert>';
	}
}
