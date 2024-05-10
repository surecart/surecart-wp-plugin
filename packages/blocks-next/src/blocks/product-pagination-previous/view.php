<a
	<?php echo get_block_wrapper_attributes(['class' => 'sc-product-pagination-previous has-arrow-type-' . esc_attr($pagination_arrow)]); ?>
	data-wp-bind--href="context.previousPageLink"
	data-wp-class--disabled="!context.previousPageLink"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	>
	<?php if (!empty($arrow_name)) : ?>
		<?php echo \SureCart::svg()->get($arrow_name); ?>
	<?php endif; ?>

	<?php if (!empty($show_label)) : ?>
		<?php echo wp_kses_post($attributes['label'] ?? __('Previous', 'surecart')); ?>
	<?php endif; ?>
</a>
