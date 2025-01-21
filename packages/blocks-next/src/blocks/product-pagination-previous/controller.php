<?php
// Get the arrows and label show/hide from context.

$pagination_arrow = $block->context['paginationArrow'] ?? '';
$show_label       = $block->context['showLabel'] ?? true;

// Map the arrow name to the icon name.
$arrow_name = [
	'none'    => '',
	'arrow'   => is_rtl() ? 'arrow-right' : 'arrow-left',
	'chevron' => is_rtl() ? 'chevron-right' : 'chevron-left',
][ $pagination_arrow ] ?? $pagination_arrow;

$query     = sc_product_list_query( $block );
$page_link = $query->previous_page_link;

// Render the block.
return 'file:./view.php';
