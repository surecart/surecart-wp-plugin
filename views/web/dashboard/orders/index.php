<ce-orders-list id="customer-orders-index"></ce-orders-list>
<?php
\SureCart::assets()->addComponentData(
	'ce-orders-list',
	'#customer-orders-index',
	[
		'query' => $query ?? [],
	]
);
?>
