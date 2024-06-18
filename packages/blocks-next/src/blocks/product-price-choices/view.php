<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<label class="sc-form-label">
		<?php echo wp_kses_post( $attributes['label'] ?? __( 'Pricing', 'surecart' ) ); ?>
	</label>

	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
</div>
