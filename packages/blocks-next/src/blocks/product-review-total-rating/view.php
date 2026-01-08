<<?php echo esc_html( $html_tag ); ?>
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array_filter(
				[
					'class'      => trim( ( $link_to_reviews ? 'sc-review-link' : '' ) . ' ' . $has_multiple_reviews ),
					'href'       => $link_to_reviews ? sc_get_product_review_link() : null,
					'aria-label' => $link_to_reviews ? __( 'View all reviews.', 'surecart' ) : null,
				]
			)
		)
	);
	?>
	>

	<span class="sc-review-count"><?php echo esc_html( $number ); ?></span>

	<span class="<?php echo esc_attr( empty( $attributes['show_label'] ) ? 'sc-screen-reader-text' : 'surecart-review-label' ); ?>">
		<?php
		// translators: 1: number of reviews, 2: label "review" or "reviews".
		echo ' ' . esc_html( _n( 'review', 'reviews', $count, 'surecart' ) );
		?>
	</span>

</<?php echo esc_html( $html_tag ); ?>>
