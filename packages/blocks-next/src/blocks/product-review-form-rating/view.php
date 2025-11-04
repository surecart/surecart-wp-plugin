<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label">
			<?php echo wp_kses_data( $label ); ?>
		</label>
	<?php endif; ?>

	<fieldset class="sc-rating-input">
		<?php for ( $i = 5; $i >= 1; $i-- ) : ?>
			<input 
				type="radio" 
				value="<?php echo esc_attr( $i ); ?>" 
				id="stars-star<?php echo esc_attr( $i ); ?>" 
				name="stars"
				data-wp-on--change="actions.setStars" 
				data-rating="<?php echo esc_attr( $i ); ?>"
			>
			<label for="stars-star<?php echo esc_attr( $i ); ?>" title="<?php echo esc_attr( sprintf( __( '%d Stars', 'surecart' ), $i ) ); ?>">
				<?php
				echo wp_kses(
					SureCart::svg()->get(
						'star',
						[
							'height' => esc_attr( $size ),
							'width'  => esc_attr( $size ),
							'stroke' => $fill_color ?? 'var(--sc-color-primary-500)',
							'class'  => 'sc-star-svg',
						]
					),
					sc_allowed_svg_html()
				);
				?>
			</label>
		<?php endfor; ?>
	</fieldset>
</div>