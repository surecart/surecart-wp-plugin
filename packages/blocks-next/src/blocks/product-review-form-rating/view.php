<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label">
			<?php echo wp_kses_data( $label ); ?>
		</label>
	<?php endif; ?>

	<fieldset class="sc-rating-input" style="justify-content: <?php echo esc_attr( 'center' === $attributes['text_align'] ? 'center' : ( 'right' === $attributes['text_align'] ? 'flex-start' : 'flex-end' ) ); ?>;">
		<?php for ( $i = 1; $i <= 5; $i++ ) : ?>
			<input 
				type="radio"
				name="stars"
				value="<?php echo esc_attr( $i ); ?>" 
				id="stars-star<?php echo esc_attr( $i ); ?>" 
				data-wp-on--change="actions.setStars"
			>
			<label
				for="stars-star<?php echo esc_attr( $i ); ?>"
				title="<?php echo esc_attr( sprintf( __( '%d Stars', 'surecart' ), $i ) ); ?>"
			>
				<?php
				echo wp_kses(
					SureCart::svg()->get(
						'star',
						[
							'height'       => esc_attr( $size ),
							'width'        => esc_attr( $size ),
							'stroke'       => $fill_color ?? 'var(--sc-color-primary-500)',
							'fill'         => $fill_color ?? 'var(--sc-color-primary-500)',
							'class'        => 'sc-star-svg',
							'stroke-width' => 2,
						]
					),
					sc_allowed_svg_html()
				);
				?>
			</label>
		<?php endfor; ?>
	</fieldset>
</div>