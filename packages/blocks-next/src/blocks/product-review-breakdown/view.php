<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="sc-star-bars">
		<?php
		$params = \SureCart::block()->urlParams( 'reviews' );
		for ( $star = 5; $star >= 1; $star-- ) {
			$count      = isset( $product->reviews_breakdown->$star ) ? (int) $product->reviews_breakdown->$star : 0;
			$percentage = $total > 0 ? ( $count / $total ) * 100 : 0;
			$filter_url = $params->addArg( 'ratings', (string) $star )->url();
			?>
			<a
				href="<?php echo esc_url( $filter_url ); ?>"
				class="sc-star-row"
				data-wp-interactive='{ "namespace": "surecart/product-review" }'
				data-wp-on--click="actions.navigate"
				data-wp-on--mouseenter="actions.prefetch"
				aria-label="<?php echo esc_attr( sprintf( __( 'Filter by %d star reviews', 'surecart' ), $star ) ); ?>"
			>
				<div class="sc-star-label">
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
				<div class="sc-bar-wrap" <?php echo ! empty( $attributes['bar_background_color'] ) ? 'style="background-color: ' . esc_attr( $attributes['bar_background_color'] ) . ';"' : ''; ?>>
					<div class="sc-bar-fill" style="width: <?php echo esc_attr( $percentage ); ?>%;<?php echo ! empty( $attributes['bar_fill_color'] ) ? ' background-color: ' . esc_attr( $attributes['bar_fill_color'] ) . ';' : ''; ?>"></div>
				</div>
				<div class="sc-count"><?php echo esc_html( $count ); ?></div>
			</a>
			<?php
		}
		?>
	</div>
</div>
