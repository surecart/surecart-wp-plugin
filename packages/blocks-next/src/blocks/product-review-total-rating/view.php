<<?php echo esc_html( $html_tag ); ?>
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array_filter(
				[
					'class'      => $link_to_reviews ? 'sc-review-link' : null,
					'href'       => $link_to_reviews ? sc_get_product_review_link() : null,
					'aria-label' => sprintf( __( 'View all reviews.', 'surecart' ), $display_number ),
					'role'       => 'link',
				]
			)
		)
	);
	?>
	>

	<?php echo esc_html( $display_number ); ?>
	<?php
	if ( ! empty( $attributes['show_label'] ) ) :
		// translators: 1: number of reviews, 2: label "review" or "reviews".
		echo ' ' . esc_html( _n( 'review', 'reviews', $count, 'surecart' ) );
	endif;
	?>

</<?php echo esc_html( $html_tag ); ?>>
