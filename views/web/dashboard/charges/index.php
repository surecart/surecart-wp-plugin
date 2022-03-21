<ce-charges-list id="customer-charges-list"></ce-charges-list>

<?php
\SureCart::assets()->addComponentData(
	'ce-charges-list',
	'#customer-charges-list',
	[
		'query' => $query ?? [],
	]
);
?>
