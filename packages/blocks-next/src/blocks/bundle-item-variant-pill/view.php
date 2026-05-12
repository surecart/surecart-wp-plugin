<div
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-pill-option__button' ) ) ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'option_value'      => $block->context['value'],
				'option_name'       => $block->context['name'],
				'option_name_slug'  => sanitize_title( $block->context['name'] ),
				'option_value_slug' => sanitize_title( $block->context['value'] ),
			)
		)
	);
	?>
	data-wp-on--click="callbacks.setBundleComponentOption"
	data-wp-on--keydown="callbacks.setBundleComponentOption"
	data-wp-class--sc-pill-option__button--selected="state.isBundleComponentOptionSelected"
	data-wp-class--sc-pill-option__button--disabled="state.isBundleComponentOptionUnavailable"
	data-wp-bind--aria-checked="state.isBundleComponentOptionSelected"
	data-wp-bind--aria-disabled="state.isBundleComponentOptionUnavailable"
	role="radio"
	tabindex="0"
>
	<span class="sc-screen-reader-text">
		<?php
		printf(
			/* translators: %s is the variant option name. */
			esc_html__( 'Select %s', 'surecart' ),
			esc_html( $block->context['name'] )
		);
		?>
	</span>
	<?php echo esc_html( $block->context['value'] ); ?>
</div>
