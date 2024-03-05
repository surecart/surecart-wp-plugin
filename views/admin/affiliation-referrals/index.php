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
			'title' => __( 'Affiliate Referrals', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'affiliate-referral' ),
		]
	);
	?>

	<?php $table->views(); ?>
	<?php $table->display(); ?>
</div>
