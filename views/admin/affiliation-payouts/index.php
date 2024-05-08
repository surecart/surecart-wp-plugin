<style>
	.row-actions .approve {
		display: inline !important;
	}
</style>

<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Affiliate Payouts', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'affiliate-payout' ),
		]
	);
	?>

	<?php $table->views(); ?>
	<?php $table->display(); ?>
</div>
