<div <?php echo wp_kses_data( get_block_wrapper_attributes( [ 'style' => $style ] ) ); ?> role="list" aria-label="<?php esc_attr_e( 'Review breakdown by star rating', 'surecart' ); ?>">
	<div class="sc-star-bars sc-star-bars__columns-<?php echo esc_attr( $columns ); ?>">
		<?php for ( $star = 5; $star >= 1; $star-- ) : ?>
			<?php
			// get the count of the stars for the current star rating.
			$count = isset( $product->reviews_breakdown->$star ) ? (int) $product->reviews_breakdown->$star : 0;
			// get the percentage of the count out of the total reviews.
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
			?>
			<div class="sc-star-row" role="listitem" aria-label="<?php echo esc_attr( sprintf( _n( '%1$d star: %2$d review', '%1$d stars: %2$d reviews', $star, 'surecart' ), $star, $count ) ); ?>">
				<span class="sc-star-text" aria-hidden="true"><?php echo (int) $star; ?></span>

				<?php
					echo wp_kses(
						SureCart::svg()->get(
							'star',
							[
								'class'       => 'sc-star-icon',
								'fill'        => 'var(--sc-star-fill-color)',
								'stroke'      => 'var(--sc-star-fill-color)',
								'aria-hidden' => 'true',
							]
						),
						sc_allowed_svg_html()
					);
				?>

				<div class="sc-star-row__bar" role="progressbar" aria-valuenow="<?php echo esc_attr( round( $percentage ) ); ?>" aria-valuemin="0" aria-valuemax="100" aria-label="<?php echo esc_attr( sprintf( __( '%d%% of reviews', 'surecart' ), round( $percentage ) ) ); ?>">
					<div class="sc-star-row__bar-fill" style="width: <?php echo esc_attr( $percentage ); ?>%;"></div>
				</div>

				<div class="sc-star-row__count" aria-hidden="true"><?php echo esc_html( $count ); ?></div>
			</div>
		<?php endfor; ?>
	</div>
</div>
