<?php
// Enqueue the select styles.
wp_enqueue_style( 'surecart-select' );
?>

<div class="sc-select-option__wrapper">
	<select class="sc-form-select" data-wp-on--change="callbacks.setOption">
		<?php foreach ( $option->values as $key => $value ) : ?>
		<option
			value="<?php echo esc_attr( $value ); ?>"
			data-wp-bind--selected="state.isOptionSelected"
			<?php
			echo wp_kses_data(
				wp_interactivity_data_wp_context(
					array(
						'option_value'      => $value,
						'option_name'       => $option->name,
						'option_name_slug'  => sanitize_title( $option->name ),
						'option_value_slug' => sanitize_title( $value ),
					)
				)
			);
			?>
			>
				<?php echo esc_html( $value ); ?>
		</option>
	<?php endforeach; ?>
	</select>
</div>