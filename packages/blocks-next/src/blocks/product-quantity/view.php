<div
<?php echo get_block_wrapper_attributes(); ?>
>
	<label>
		<?php echo wp_kses_post( $attributes['label'] ?? esc_html_e( 'Quantity', 'surecart' ) ); ?>
	</label>
	<div class="sc-quantity-selector" style="<?php echo esc_attr( $styles['border']['css'] ?? '' ); ?>" data-wp-interactive='{ "namespace": "surecart/quantity-selector" }'
	<?php
		echo wp_interactivity_data_wp_context(
			array(
				'quantity' => max($product->selectedPrice->ad_hoc? 1: ),
				'disabled' => false,
			)
		);
		?>
	>
		<div role="button" class="sc-quantity-selector__decrease" data-wp-on--click="callbacks.decrease">
			<?php echo wp_kses( SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
		</div>
		<input
			class="sc-quantity-selector__control"
			data-wp-bind--value="context.quantity"
			data-wp-on--change="callbacks.onChange"
			data-wp-bind--min="context.min"
			data-wp-bind--aria-valuemin="context.min"
			data-wp-bind--max="context.max"
			data-wp-bind--aria-valuemax="context.max"
			data-wp-bind--aria-disabled=""
			type="number"
			step="1"
			autocomplete="off"
			role="spinbutton"
		/>
		<div role="button" class="sc-quantity-selector__increase" data-wp-on--click="callbacks.increase">
			<?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
		</div>
	</div>
</div>
