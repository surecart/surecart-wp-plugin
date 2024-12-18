<?php

$query = sc_product_list_query( $block );

// there are less than 2 pages.
if ( ( $query->max_num_pages ?? 1 ) < 2 ) {
	return;
}

if ( ! $query->has_pagination ) {
	return;
}

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
