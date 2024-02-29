<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<label class="sc-form-label">
		<?php echo wp_kses_post( $attributes['label'] ?? __('Pricing', 'surecart') ); ?>
	</label>
	<div class="sc-choices">
		<?php foreach($prices as $price) : ?>
			<div class="sc-choice"
				data-wp-key="<?php echo esc_attr( $price->id ); ?>"
				data-wp-context='{ "priceId": "<?php echo esc_attr( $price->id ); ?>" }'
				data-wp-on--click="callbacks.setPrice"
				data-wp-class--sc-choice--checked="state.isPriceSelected">
				<strong><?php echo !empty($price->name) ? $price->name : $product->name; ?></strong>
				<?php echo $price->display_amount; ?>
			</div>
		<?php endforeach; ?>
	</div>
</div>
