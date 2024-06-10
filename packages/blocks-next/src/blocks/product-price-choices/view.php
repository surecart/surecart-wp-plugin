<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<label class="sc-form-label">
		<?php echo wp_kses_post( $attributes['label'] ?? __( 'Pricing', 'surecart' ) ); ?>
	</label>

	<div class="sc-choices">
		<?php foreach ( $prices as $price ) : ?>
			<div 
			<?php
			echo wp_interactivity_data_wp_context(
				array(
					'price'                => $price,
					'price_display_name'   => ! empty( $price->name ) ? $price->name : sc_get_product()->name ?? '',
					'price_display_amount' => sprintf( __( '%1$s %2$s', 'surecart' ), $price->display_amount, $price->short_interval_text ),
				)
			);
			?>
			>
				<?php echo $content; ?>
			</div>
		<?php endforeach; ?>
	</div>
</div>
