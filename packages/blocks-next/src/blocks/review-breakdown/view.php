<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="sc-review-summary">
		<div class="sc-star-bars">
			<?php
			for ( $star = 5; $star >= 1; $star-- ) {
				$count      = isset( $product->reviews_breakdown->$star ) ? (int) $product->reviews_breakdown->$star : 0;
				$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
				?>
				<div class="sc-star-row">
					<div class="sc-star-label">
                        <?php echo esc_html( $star ); ?>
                        <?php
                            echo wp_kses(
                                SureCart::svg()->get(
                                    'star',
                                    [
                                        'height' => esc_attr( 25 ),
                                        'width'  => esc_attr( 25 ),
                                        'fill'   => 'var(--sc-color-primary-500)',
                                        'color'  => 'var(--sc-color-primary-500)',
                                        'stroke' => 'var(--sc-color-primary-500)',
                                    ]
                                ),
                                sc_allowed_svg_html()
                            );
                        ?>
                    </div>
					<div class="sc-bar-wrap">
						<div class="sc-bar-fill" style="width: <?php echo esc_attr( $percentage ); ?>%;"></div>
					</div>
					<div class="sc-count"><?php echo esc_html( $count ); ?></div>
				</div>
				<?php
			}
			?>
		</div>
	</div>
</div>
