<?php
static $option_id = 0;
++$option_id;
// Enqueue the select styles.
wp_enqueue_style( 'surecart-select' );
?>

<label class="sc-form-label" for="sc-select-option-<?php echo esc_attr( sanitize_title( $option->name . '-' . $option_id ) ); ?>">
	<?php echo wp_kses_post( $option->name ); ?>
</label>

<div class="sc-select-option__wrapper">
	<select class="sc-form-select" data-wp-on--change="callbacks.setOption" id="sc-select-option-<?php echo esc_attr( sanitize_title( $option->name . '-' . $option_id ) ); ?>">
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