<ce-orders-list id="customer-orders-index"></ce-orders-list>
<?php
\CheckoutEngine::assets()->addComponentData(
	'ce-orders-list',
	'#customer-orders-index',
	[
		'query' => $query ?? [],
	]
);
?>
