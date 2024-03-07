<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<label class="sc-form-label">
		<?php echo wp_kses_post( $attributes['label'] ?? __('Pricing', 'surecart') ); ?>
	</label>

	<div class="sc-choices">
		<?php foreach( $prices as $price ) : ?>
			<div <?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'price' => $price ] ) ); ?>>
				<?php echo $content; ?>
			</div>
		<?php endforeach; ?>
	</div>
</div>
