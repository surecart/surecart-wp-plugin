<div class="wp-block-button <?php echo esc_attr( $width_class ); ?>"
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'checkoutUrl'     => esc_url( \SureCart::pages()->url( 'checkout' ) ),
				'text'            => $attributes['text'] ?? ( $attributes['add_to_cart'] ? __( 'Add to Cart', 'surecart' ) : __( 'Buy Now', 'surecart' ) ),
				'outOfStockText'  => esc_attr( $attributes['out_of_stock_text'] ?? __( 'Sold Out', 'surecart' ) ),
				'unavailableText' => esc_attr( $attributes['unavailable_text'] ?? __( 'Unavailable For Purchase', 'surecart' ) ),
				'addToCart'       => $attributes['add_to_cart'] ?? true,
			)
		)
	);
	?>
	>
	<?php if ( ! $attributes['add_to_cart'] ) { ?>
		<a
			<?php
			echo wp_kses_data(
				get_block_wrapper_attributes(
					array(
						'class' => 'wp-block-button__link wp-element-button sc-button__link ' . $custom_class,
					)
				)
			);
			?>
			data-wp-bind--disabled="state.isUnavailable"
			data-wp-bind--href="state.checkoutUrl"
		>
			<span class="sc-button__link-text" data-wp-text="state.buttonText">
			</span>
		</a>
		<?php
	} else {
		?>
		<button
			<?php
			echo wp_kses_data(
				get_block_wrapper_attributes(
					array(
						'class' => 'wp-block-button__link wp-element-button sc-button__link ' . $custom_class,
					)
				)
			);
			?>
			data-wp-bind--disabled="state.isUnavailable"
			data-wp-class--sc-button__link--busy="context.busy"
		>
			<span class="sc-spinner" aria-hidden="false"></span>
			<span class="sc-button__link-text" data-wp-text="state.buttonText">
			</span>
		</button>
		<?php
	}
	?>
</div>
