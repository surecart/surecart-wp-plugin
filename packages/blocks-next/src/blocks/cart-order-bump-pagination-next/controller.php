<?php
// Get the arrow type and size from context.
$pagination_arrow = $block->context['paginationArrow'] ?? 'chevron';
$arrow_size       = $block->context['paginationArrowSize'] ?? 20;

// Map the arrow name to the icon name with RTL support.
$icon = [
	'arrow'   => is_rtl() ? 'arrow-left' : 'arrow-right',
	'chevron' => is_rtl() ? 'chevron-left' : 'chevron-right',
][ $pagination_arrow ] ?? ( is_rtl() ? 'chevron-left' : 'chevron-right' );

// Return the view.
return 'file:./view.php';
