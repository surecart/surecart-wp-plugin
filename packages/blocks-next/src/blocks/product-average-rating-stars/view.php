<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	for ( $i = 1; $i <= 5; $i++ ) {
		$difference      = $average_rating - ( $i - 1 );
		$fill_percentage = 0;

		if ( $difference >= 1 ) {
			$fill_percentage = 100;
		} elseif ( $difference > 0 ) {
			$fill_percentage = round( $difference * 100 );
		}

		$gradient_id    = 'star-gradient-' . $i . '-' . $product->id;
		$polygon_fill   = 'url(#' . $gradient_id . ')';
		$polygon_stroke = $fill_color;

		if ( 0 === $fill_percentage ) {
			$polygon_fill   = $empty_color;
			$polygon_stroke = $empty_color;
		}
		?>
		<div class="star-container" style="width: <?php echo esc_attr( $size ); ?>px; height: <?php echo esc_attr( $size ); ?>px;">
			<svg class="star-svg" viewBox="0 0 24 24">
				<defs>
					<linearGradient id="<?php echo esc_attr( $gradient_id ); ?>">
						<stop offset="<?php echo esc_attr( $fill_percentage ); ?>%" stop-color="<?php echo esc_attr( $fill_color ); ?>" />
						<stop offset="<?php echo esc_attr( $fill_percentage ); ?>%" stop-color="<?php echo esc_attr( $empty_color ); ?>" />
					</linearGradient>
				</defs>
				<polygon
					points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
					fill="<?php echo esc_attr( $polygon_fill ); ?>"
					stroke="<?php echo esc_attr( $polygon_stroke ); ?>"
					stroke-width="1"
				/>
			</svg>
		</div>
		<?php
	}
	?>
</div>