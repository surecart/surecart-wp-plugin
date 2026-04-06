<?php \SureCart::render( 'layouts/partials/admin-settings-styles' ); ?>

<div id="sc-settings-container">
	<?php
	\SureCart::render(
		'layouts/partials/admin-settings-header',
		[
			'claim_url'     => $claim_url,
			'claim_expired' => $claim_expired,
			'breadcrumb'    => $breadcrumb,
		]
	);
	?>
	<div id="sc-settings-app"></div>
</div>

