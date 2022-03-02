<?php
namespace CheckoutEngineBlocks\Controllers;

/**
 * Base controller for dashboard pages.
 */
abstract class BaseController {
	/**
	 * Get the current tab.
	 *
	 * @return string|false
	 */
	protected function getTab() {
		return isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;
	}

	/**
	 * Get the current page.
	 *
	 * @return integer
	 */
	protected function getPage() {
		return isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : 1;
	}

	/**
	 * Get the current id.
	 *
	 * @return integer|false
	 */
	protected function getId() {
		return isset( $_GET['id'] ) ? sanitize_text_field( wp_unslash( $_GET['id'] ) ) : false;
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
