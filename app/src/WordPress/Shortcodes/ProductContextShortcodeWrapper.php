<?php

namespace SureCart\WordPress\Shortcodes;

/**
 * Wraps the render callback for shortcodes that opt in via `['supports_product_id' => true]`.
 */
class ProductContextShortcodeWrapper {

	public function bootstrap() {
		add_filter( 'surecart/shortcodes/render_callback', [ $this, 'maybeWrap' ], 10, 3 );
	}

	/**
	 * Wrap the render callback when the caller opted in; pass through otherwise.
	 *
	 * @param callable $callback Render callback supplied by ShortcodesService.
	 * @param string   $name     Shortcode name (unused — opt-in is via $options).
	 * @param array    $options  Caller-supplied options bag.
	 *
	 * @return callable
	 */
	public function maybeWrap( callable $callback, $name, array $options = array() ) {
		if ( empty( $options['supports_product_id'] ) ) {
			return $callback;
		}

		return function ( $attributes = '', $content = null ) use ( $callback ) {
			// Accept both `id` and `product_id`; `product_id` (these shortcodes' native param) wins.
			$product_id = is_array( $attributes )
				? ( $attributes['product_id'] ?? $attributes['id'] ?? '' )
				: '';

			if ( empty( $product_id ) ) {
				return $callback( $attributes, $content );
			}

			$product_id = (string) $product_id;
			unset( $attributes['product_id'], $attributes['id'] );

			// Clear so sc_get_product() doesn't short-circuit to the page's product.
			$product = $this->withQueryVar( null, fn() => sc_get_product( $product_id ) );

			// Unresolved id: render empty rather than silently using the page's product.
			if ( empty( $product ) || empty( $product->id ) ) {
				return '';
			}

			// Inner next-gen blocks read this query var via render_block_context.
			return $this->withQueryVar( $product, fn() => $callback( $attributes, $content ) );
		};
	}

	/**
	 * Run `$fn` with `surecart_current_product` temporarily set to `$value`,
	 * restoring the previous value afterward (even on exception).
	 *
	 * @param mixed    $value New query var value (null clears it).
	 * @param callable $fn    Callable to invoke.
	 *
	 * @return mixed
	 */
	protected function withQueryVar( $value, callable $fn ) {
		$previous = get_query_var( 'surecart_current_product' );
		set_query_var( 'surecart_current_product', $value );

		try {
			return $fn();
		} finally {
			set_query_var( 'surecart_current_product', $previous );
		}
	}
}
