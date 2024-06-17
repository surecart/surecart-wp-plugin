	<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
		)
	);

	?>

	>
<?php foreach ( $prices as $price ) : ?>

		<div
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'price'                => $price,
				'price_display_name'   => ! empty( $price->name ) ? $price->name : $product->name ?? '',
				// translators: %1$s is the price amount, %2$s is the price interval.
				'price_display_amount' => sprintf( esc_attr__( '%1$s %2$s', 'surecart' ), $price->display_amount, $price->short_interval_text ),
			)
		)
	);
	?>
	class="sc-choice"
	data-wp-on--click="callbacks.setPrice"
	data-wp-class--sc-choice--checked="state.isPriceSelected"
	data-wp-bind--aria-checked="state.isPriceSelected"
	tabindex="0"
	role="radio">
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
</div>

<?php endforeach; ?>
</div>
