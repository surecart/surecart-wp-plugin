<style>
	.wp-list-table .column-image {
		width: 40px;
	}
</style>

<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Affiliate Requests', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'product' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Affiliate Requests', 'surecart' ), 'sc-search-affiliate-requests' ); ?>

	<form id="affiliate-requests-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>
