<a
	<?php echo get_block_wrapper_attributes(['class' => 'has-arrow-type-' . esc_attr($pagination_arrow)]); ?>
	data-wp-bind--href="context.nextPageLink"
	data-wp-class--disabled="!context.nextPageLink"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	>
	<span class="<?php echo empty($show_label) ? 'sc-screen-reader-text': 'sc-page-link-label'; ?>">
		<?php echo wp_kses_post($attributes['label'] ?? __('Next', 'surecart')); ?>
	</span>

	<?php if (!empty($arrow_name)) : ?>
		<?php echo \SureCart::svg()->get($arrow_name, ['class' => 'wp-block-surecart-product-pagination-next__icon', 'aria-hidden' => true]); ?>
	<?php endif; ?>
</a>
