<?php
\SureCart::render(
	'components/admin/list-header',
	[
		'id'           => 'sc-product-collections-list-header',
		'title'        => __( 'Product Collections', 'surecart' ),
		'action_label' => __( 'Add Collection', 'surecart' ),
		'new_link'     => $new_link ?? '',
	]
);
?>

<div id="sc-product-collections-app"></div>
