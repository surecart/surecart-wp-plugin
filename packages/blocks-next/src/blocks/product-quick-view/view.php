<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-on--click="actions.productQuickView"
>
	<?php echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
</div>
