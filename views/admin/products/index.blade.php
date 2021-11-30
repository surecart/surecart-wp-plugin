<style>
	.wp-list-table .column-image {
		width: 40px;
	}
	.ce-product-name {
		display: flex;
		gap: 1em;
	}
	.ce-product-image-preview {
		width: 40px;
		height: 40px;
		object-fit: cover;
		background: #f3f3f3;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--ce-border-radius-small);
	}
</style>
@component('components.admin.templates.index', [
    'title' => __('Products', 'checkout_engine'),
	'table' => $table,
	'model_type' => 'product'
    ])
@endcomponent
