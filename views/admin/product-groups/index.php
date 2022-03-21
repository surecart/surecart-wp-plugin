
<div class="wrap">
	<?php \SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Upgrade Groups', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'product_group' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>

