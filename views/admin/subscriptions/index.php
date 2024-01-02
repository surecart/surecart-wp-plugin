<style>

	.wp-list-table {
		table-layout: auto !important;
	}
</style>
<div class="wrap">

	<?php
	\SureCart::render( 'layouts/partials/admin-index-styles' );
	?>

	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[ 'title' => __( 'Subscription Insights', 'surecart' ) ]
	);
	?>

	<div id="app"></div>

	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Subscriptions', 'surecart' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Subscriptions', 'surecart' ), 'sc-search-subscriptions' ); ?>
	<?php $table->display(); ?>
</div>
