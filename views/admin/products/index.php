<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Products', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'product' ),
		]
	);
	?>

	<div id="sc-products-list-app"></div>
</div>
