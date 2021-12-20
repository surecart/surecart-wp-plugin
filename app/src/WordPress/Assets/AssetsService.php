<?php

namespace CheckoutEngine\WordPress\Assets;

/**
 * Our assets service.
 */
class AssetsService {
	/**
	 * This adds component data to the component when it's defined at runtime.
	 *
	 * @param string $tag Tag of the web component.
	 * @param string $selector Specific selector (class or id).
	 * @param array  $data Data to add.
	 * @return void
	 */
	public function addComponentData( $tag, $selector, $data = [] ) {
		$data_string = '';
		foreach ( $data as $key => $value ) {
			$encoded      = wp_json_encode( $value );
			$data_string .= 'component.' . $key . " =$encoded;\n";
		}
		wp_add_inline_script(
			'checkout-engine-components',
			"(async () => {
				await customElements.whenDefined('" . $tag . "');
				var component = document.querySelector('" . $tag . $selector . "');
				if (!component) return;
				" . $data_string . '
			})();'
		);
	}
}
