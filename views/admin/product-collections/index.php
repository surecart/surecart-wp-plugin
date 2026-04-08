<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Product Collections', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'product_collection' ),
		]
	);
	?>

	<div id="sc-product-collections-list-app"></div>
</div>
