<?php

use SureCart\Models\Blocks\ProductListBlock;

$controller = new ProductListBlock( $block );
$query      = $controller->query();

// if there are no first page posts, return early.
if ( ! $query->have_posts() && 1 === $query->paged ) {
	return;
}

?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
