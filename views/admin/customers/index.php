<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Customers', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'customers' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Customers', 'surecart' ), 'sc-search-customers' ); ?>
	<?php $table->display(); ?>
</div>


