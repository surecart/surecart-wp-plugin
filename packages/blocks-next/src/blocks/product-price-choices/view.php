<div <?php echo wp_kses_data(get_block_wrapper_attributes()); ?>>
	<label class="sc-form-label">
		<?php echo wp_kses_post($attributes['label'] ?? __('Pricing', 'surecart')); ?>
	</label>

	<div class="sc-choices">
		<?php foreach ($prices as $price) : ?>
			<div <?php echo wp_kses_data(
						wp_interactivity_data_wp_context(
							[
								'price' => $price,
								'price_display_name' => !empty($price->name) ? $price->name : $block->context['surecart/product']->name ?? '',
								'price_display_amount' => sprintf(__('%s %s', 'surecart'), $price->display_amount, $price->short_interval_text),
							]
						)
					); ?>>
				<?php echo $content; ?>
			</div>
		<?php endforeach; ?>
	</div>
</div>
