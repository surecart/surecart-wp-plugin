<a <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> data-wp-bind--href="state.lineItemPermalink">
	<span data-wp-text="context.line_item.price.product.name"></span>
	<span
		class="sc-cart-line-item-title__count"
		aria-hidden="true"
		data-wp-bind--hidden="!state.lineItemBundleCount"
		data-wp-text="state.lineItemBundleCount"
	></span>
	<span
		class="sc-screen-reader-text"
		data-wp-bind--hidden="!state.lineItemBundleCount"
		data-wp-text="state.bundleComponentsLabel"
	></span>
</a>
