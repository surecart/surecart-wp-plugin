<div
	<?php echo get_block_wrapper_attributes( array( 'class' => 'is-layout-flex sc-product-collection-badges' ) ); ?>
	<?php echo wp_interactivity_data_wp_context( array( 'collections' => $collections ) ); ?>
>
	<template
		data-wp-each--collection="context.collections"
		data-wp-key="context.collection.id"
	>
		<span>
			<?php echo wp_kses_post( $content ); ?>
		</span>
	</template>
</div>

