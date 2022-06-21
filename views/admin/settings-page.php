<?php \SureCart::render( 'layouts/partials/admin-settings-styles' ); ?>

<div id="sc-settings-container">
	<?php \SureCart::render( 'layouts/partials/admin-settings-header' ); ?>

	<div id="sc-settings-content">
		<?php
			\SureCart::render(
				'layouts/partials/admin-settings-sidebar',
				[
					'tab' => $tab,
				]
			);
			?>

		<div class="sc-container">
			<div class="sc-content" id="app"></div>
		</div>
	</div>
</div>

