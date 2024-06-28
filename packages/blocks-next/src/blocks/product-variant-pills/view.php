<div class="sc-product-variants__wrapper">
	<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
		<div
			<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
			<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionNumber' => (int) $key + 1 ) ) ); ?>
		>
			<label class="sc-form-label">
				<?php echo wp_kses_post( $option->name ); ?>
			</label>

			<div <?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionValues' => $option->values ) ) ); ?> >
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
			</div>
		</div>
	<?php endforeach; ?>
</div>
