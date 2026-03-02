<<?php echo esc_html( $html_tag ); ?>
	<?php
	// translators: %s: number of reviews.
	$aria_label_text = sprintf( _n( '%s review', '%s reviews', $count, 'surecart' ), $number );
	if ( $link_to_reviews ) {
		// translators: %s: number of reviews.
		$aria_label_text = sprintf( _n( '%s review. View all reviews', '%s reviews. View all reviews', $count, 'surecart' ), $number );
	}

	echo wp_kses_data(
		get_block_wrapper_attributes(
			array_filter(
				[
					'class'      => trim( ( $link_to_reviews ? 'sc-review-link' : '' ) . ' ' . $has_multiple_reviews ),
					'href'       => $link_to_reviews ? sc_get_product_review_link() : null,
					'aria-label' => $aria_label_text,
				]
			)
		)
	);
	?>
	>

	<span class="sc-review-count" aria-hidden="true"><?php echo esc_html( $number ); ?></span>

	<span class="<?php echo esc_attr( empty( $attributes['show_label'] ) ? 'sc-screen-reader-text' : 'surecart-review-label' ); ?>" aria-hidden="true">
		<?php
		// translators: 1: number of reviews, 2: label "review" or "reviews".
		echo ' ' . esc_html( _n( 'review', 'reviews', $count, 'surecart' ) );
		?>
	</span>

</<?php echo esc_html( $html_tag ); ?>>
