<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Affiliate Clicks', 'surecart' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Affiliate Clicks', 'surecart' ), 'sc-search-affiliate-requests' ); ?>

	<form id="affiliate-requests-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>
