<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php \SureCart::render( 'layouts/partials/admin-product-list-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Bundles', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'bundle' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Bundles', 'surecart' ), 'sc-search-bundles' ); ?>

	<form id="bundles-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>
