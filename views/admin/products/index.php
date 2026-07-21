<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php \SureCart::render( 'layouts/partials/admin-product-list-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'       => __( 'Products', 'surecart' ),
			'after_title' => \SureCart::view( 'admin/products/add-new-product-button' )->toString(),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Products', 'surecart' ), 'sc-search-products' ); ?>

	<form id="products-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>
