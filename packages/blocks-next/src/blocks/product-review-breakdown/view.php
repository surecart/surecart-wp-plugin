<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="sc-star-bars sc-star-bars__columns-<?php echo esc_attr( $columns ); ?>" style="--sc-row-gap: <?php echo esc_attr( $row_gap ); ?>px; --sc-column-gap: <?php echo esc_attr( $column_gap ); ?>px; --sc-star-label-gap: <?php echo esc_attr( $attributes['star_label_gap'] ?? 4 ); ?>px; row-gap: <?php echo esc_attr( $row_gap ); ?>px; column-gap: <?php echo esc_attr( $column_gap ); ?>px;">
		<?php for ( $star = 5; $star >= 1; $star-- ) : ?>
			<?php
			$count      = isset( $product->reviews_breakdown->$star ) ? (int) $product->reviews_breakdown->$star : 0;
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
			?>
			<div class="sc-star-row">
				<div class="sc-star-row__label" style="gap: <?php echo esc_attr( $attributes['star_label_gap'] ?? 4 ); ?>px;">
					<?php echo esc_html( $star ); ?>
					<?php
						echo wp_kses(
							SureCart::svg()->get(
								'star',
								[
									'height' => esc_attr( $attributes['size'] ?? 25 ),
									'width'  => esc_attr( $attributes['size'] ?? 25 ),
									'fill'   => esc_attr( $fill_color ),
									'color'  => esc_attr( $fill_color ),
									'stroke' => esc_attr( $fill_color ),
								]
							),
							sc_allowed_svg_html()
						);
					?>
				</div>
				<div class="sc-star-row__bar" <?php echo ! empty( $attributes['bar_background_color'] ) ? 'style="background-color: ' . esc_attr( $attributes['bar_background_color'] ) . ';"' : ''; ?>>
					<div class="sc-star-row__bar-fill" style="width: <?php echo esc_attr( $percentage ); ?>%;<?php echo ! empty( $attributes['bar_fill_color'] ) ? ' background-color: ' . esc_attr( $attributes['bar_fill_color'] ) . ';' : ''; ?>"></div>
				</div>
				<div class="sc-star-row__count"><?php echo esc_html( $count ); ?></div>
			</div>
			<?php
		endfor;
		?>
	</div>
</div>
