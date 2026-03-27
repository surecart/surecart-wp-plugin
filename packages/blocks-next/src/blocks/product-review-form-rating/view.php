<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label">
			<?php echo wp_kses_data( $label ); ?>
		</label>
	<?php endif; ?>

	<fieldset class="sc-rating-input" role="group" aria-label="<?php echo esc_attr( $label ); ?>" style="justify-content: <?php echo esc_attr( 'center' === $text_align ? 'center' : ( 'right' === $text_align ? 'flex-start' : 'flex-end' ) ); ?>;">
		<?php for ( $i = 5; $i >= 1; $i-- ) : ?>
			<input
				type="radio"
				name="stars"
				value="<?php echo esc_attr( $i ); ?>"
				id="stars-star<?php echo esc_attr( $i ); ?>"
				data-wp-on--change="actions.setStars"
				tabindex="-1"
				aria-hidden="true"
				required
			>
			<label
				data-star="<?php echo esc_attr( $i ); ?>"
				role="button"
				tabindex="0"
				aria-label="
				<?php
				echo esc_attr(
					sprintf(
					/* translators: %d: number of star rating */
						_n( '%d star', '%d stars', $i, 'surecart' ),
						$i
					)
				);
				?>
				"
				data-wp-on--keydown="actions.handleStarKeydown"
				data-wp-on--click="actions.handleStarClick"
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
							'class'        => 'sc-star-row__label__svg',
							'stroke-width' => 2,
							'aria-hidden'  => 'true',
						]
					),
					sc_allowed_svg_html()
				);
				?>
			</label>
		<?php endfor; ?>
	</fieldset>
</div>
