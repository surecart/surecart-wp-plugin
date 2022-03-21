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


<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Products', 'surecart' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'product' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>
