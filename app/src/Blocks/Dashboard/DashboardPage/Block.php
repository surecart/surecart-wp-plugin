<?php

namespace CheckoutEngine\Blocks\Dashboard\DashboardPage;

use CheckoutEngine\Blocks\Dashboard\DashboardPage;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		// get the current page tab and possible id.
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;

		// make sure we are on the correct tab.
		if ( empty( $attributes['name'] ) || $tab !== $attributes['name'] ) {
			return '';
		}

		return '<ce-spacing style="--spacing: var(--ce-spacing-large)">' . wp_kses_post( $content ) . '</ce-spacing>';
	}
}
