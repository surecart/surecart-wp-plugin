<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive="surecart/product-review-form"
	data-wp-context='{ "rating": 0, "hoverRating": 0 }'
	data-wp-watch="callbacks.updateRatingValue"
>
	<?php if ( ! empty( $label ) ) : ?>
		<label class="sc-form-label">
			<?php echo esc_html( $label ); ?>
		</label>
	<?php endif; ?>
	<div class="stars-container">
		<?php for ( $i = 1; $i <= 5; $i++ ) : ?>
			<button 
				type="button" 
				class="star-button"
				style="width: <?php echo esc_attr( $size ); ?>px; height: <?php echo esc_attr( $size ); ?>px;"
				data-wp-on--mouseenter="actions.setHoverRating"
				data-wp-on--mouseleave="actions.clearHoverRating"
				data-wp-on--click="actions.setRating"
				data-rating="<?php echo esc_attr( $i ); ?>"
				data-wp-class--filled="state.isStarFilled"
				data-wp-key="star-<?php echo esc_attr( $i ); ?>"
				<?php /* translators: %d: star rating number */ ?>
				aria-label="<?php echo esc_attr( sprintf( __( 'Rate %d stars', 'surecart' ), $i ) ); ?>"
			>
				<?php
				echo wp_kses(
					SureCart::svg()->get(
						'star',
						[
							'height' => esc_attr( $size ),
							'width'  => esc_attr( $size ),
							'fill'   => 'currentColor',
							'stroke' => esc_attr( $fill_color ),
							'class'  => 'star-svg',
						]
					),
					sc_allowed_svg_html()
				);
				?>
			</button>
		<?php endfor; ?>
	</div>
	<input type="hidden" name="rating" data-wp-bind--value="state.rating" />
</div>