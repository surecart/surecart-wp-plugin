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

	<?php // The React SPA mounts here and renders both the sidebar and content area. ?>
	<div id="sc-settings-app"></div>
</div>

