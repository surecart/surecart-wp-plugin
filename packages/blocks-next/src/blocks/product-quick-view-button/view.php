<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-on--click="actions.productQuickView"
	data-wp-interactive='{ "namespace": "surecart/product-quick-view" }'
	<?php
		echo wp_kses_data( wp_interactivity_data_wp_context( [
			'productId' => intval( $product_id ),
		] ) );
	?>
>
	<?php echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
</div>
