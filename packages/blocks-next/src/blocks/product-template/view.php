<div <?php echo get_block_wrapper_attributes(); ?>>
	<template
		data-wp-each--product="context.products"
		data-wp-each-key="context.product.id">
		<div class="product-item">
			<?php echo $content ?>
		</div>
	</template>
</div>
