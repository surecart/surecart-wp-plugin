<ce-charges-list id="customer-charges-list"></ce-charges-list>

<?php
\CheckoutEngine::assets()->addComponentData(
	'ce-charges-list',
	'#customer-charges-list',
	[
		'query' => $query ?? [],
	]
);
?>
