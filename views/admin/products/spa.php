<?php
\SureCart::render(
	'components/admin/list-header',
	[
		'id'           => 'sc-products-list-header',
		'title'        => __( 'Products', 'surecart' ),
		'action_label' => __( 'Add Product', 'surecart' ),
		'new_link'     => $new_link ?? '',
	]
);
?>

<div id="sc-products-app"></div>
