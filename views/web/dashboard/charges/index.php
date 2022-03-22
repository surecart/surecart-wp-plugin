<sc-charges-list id="customer-charges-list"></sc-charges-list>

<?php
\SureCart::assets()->addComponentData(
	'sc-charges-list',
	'#customer-charges-list',
	[
		'query' => $query ?? [],
	]
);
?>
