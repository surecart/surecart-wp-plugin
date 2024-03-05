<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Affiliate Referrals', 'surecart' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Affiliate Referrals', 'surecart' ), 'sc-search-affiliate-referrals' ); ?>

	<?php $table->views(); ?>
	<?php $table->display(); ?>
</div>
