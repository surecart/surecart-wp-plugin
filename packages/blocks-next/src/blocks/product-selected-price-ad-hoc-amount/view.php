<div <?php echo get_block_wrapper_attributes(); ?>
	data-wp-bind--hidden="!state.selectedPrice.ad_hoc"
	hidden>
	<label for="amount" class="sc-form-label"><?php echo wp_kses_post($attributes['label'] ?? esc_html_e('Amount', 'surecart')); ?></label>
	<div class="sc-input-group">
		<span class="sc-input-group-text" id="basic-addon1" data-wp-text="state.selectedPrice.currency_symbol"></span>
		<input
			class="sc-form-control"
			data-wp-bind--value="state.adHocAmount"
			data-wp-on--input="callbacks.setAdHocAmount"
			data-wp-on--change="callbacks.formatAdHocAmount"
			data-wp-bind--required="state.selectedPrice.ad_hoc"
			type="number"
			step="0.01" />
	</div>
</div>
