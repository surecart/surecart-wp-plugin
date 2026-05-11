<?php
$inline_styles = sc_get_inline_styles(
	array_filter(
		array(
			'--sc-pill-option-active-background-color' => $attributes['highlight_background'] ?? '',
			'--sc-pill-option-active-text-color'       => $attributes['highlight_text'] ?? '',
			'--sc-pill-option-active-border-color'     => $attributes['highlight_border'] ?? '',
		)
	)
);
?>
<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-pill-option__wrapper',
				'style' => $inline_styles,
			)
		)
	);
	?>
	role="radiogroup"
	aria-label="<?php echo esc_attr( $current_option->name ); ?>"
>
	<?php foreach ( $current_option->values as $value ) : ?>
		<div
			class="sc-pill-option__button"
			<?php
			echo wp_kses_data(
				wp_interactivity_data_wp_context(
					array(
						'option_value' => $value,
						'option_name'  => $current_option->name,
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
					esc_html( $current_option->name )
				);
				?>
			</span>
			<?php echo esc_html( $value ); ?>
		</div>
	<?php endforeach; ?>
</div>
