<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'style' => $style ] ) ); ?>>
	<div class="sc-star-bars sc-star-bars__columns-<?php echo esc_attr( $columns ); ?>">
		<?php for ( $star = 5; $star >= 1; $star-- ) : ?>
			<?php
			// get the count of the stars for the current star rating.
			$count = isset( $product->reviews_breakdown->$star ) ? (int) $product->reviews_breakdown->$star : 0;
			// get the percentage of the count out of the total reviews.
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
			?>
			<div class="sc-star-row">
				<div class="sc-star-row__label">
					<?php echo (int) $star; ?>
					<?php
						echo wp_kses(
							SureCart::svg()->get(
								'star',
								[
									'fill'   => 'var(--sc-star-fill-color)',
									'stroke' => 'var(--sc-star-fill-color)',
								]
							),
							sc_allowed_svg_html()
						);
					?>
				</div>
				<div class="sc-star-row__bar">
					<div class="sc-star-row__bar-fill" style="width: <?php echo esc_attr( $percentage ); ?>%;<?php echo ! empty( $attributes['bar_fill_color'] ) ? ' background-color: ' . esc_attr( $attributes['bar_fill_color'] ) . ';' : ''; ?>"></div>
				</div>
				<div class="sc-star-row__count"><?php echo esc_html( $count ); ?></div>
			</div>
			<?php
		endfor;
		?>
	</div>
</div>
