<?php
// Get the arrow type and size from context.
$pagination_arrow = $block->context['paginationArrow'] ?? 'chevron';
$arrow_size       = $block->context['paginationArrowSize'] ?? 20;

// Map the arrow name to the icon name with RTL support.
$icon = [
	'arrow'   => is_rtl() ? 'arrow-right' : 'arrow-left',
	'chevron' => is_rtl() ? 'chevron-right' : 'chevron-left',
][ $pagination_arrow ] ?? ( is_rtl() ? 'chevron-right' : 'chevron-left' );

// Return the view.
return 'file:./view.php';
