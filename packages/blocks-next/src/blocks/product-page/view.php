<form
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-sc-block-id' => 'product-page',
			]
		)
	); ?>
	<?php
	echo wp_kses_data( wp_interactivity_data_wp_context( $context ) );
	?>
	data-wp-interactive='{ "namespace": "surecart/product-page" }'
	data-wp-on--submit="callbacks.handleSubmit"
	data-wp-init="callbacks.init"
>
	<?php echo do_blocks( $content );  // phpcs:ignore WordPress.Security.EscapeOutput ?>
	
	<?php
	if ( ! empty( $attributes['show_sticky_purchase_button'] ) ) :
		$sticky_purchase_button_template = get_block_template( 'surecart/surecart//sticky-purchase-button', 'wp_template_part' );
		$sticky_purchase_button_content  = $sticky_purchase_button_template ? $sticky_purchase_button_template->content ?? '' : '';
		?>
		<div class="sc-sticky-purchase-button-container">
			<?php echo do_blocks( $sticky_purchase_button_content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	<?php endif; ?>
</form>
