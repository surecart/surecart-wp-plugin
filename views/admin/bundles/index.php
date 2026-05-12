<style>
	.wp-list-table .column-image {
		width: 40px;
	}

	.sc-product-name {
		display: flex;
		gap: 1em;
	}

	.sc-product-name img {
		width: 40px;
		height: 40px;
		border: var(--sc-input-border);
		border-radius: var(--sc-border-radius-medium);
		box-shadow: var(--sc-shadow-small);
		flex: 1 0 40px;
		object-fit: cover;
		display: block;
		flex: 0 0 40px;
	}

	td.sync_status {
		font-size: 16px;
		line-height: 0;
		color: var(--sc-color-gray-700);
	}

	.sc-product-image-preview {
		width: 40px;
		height: 40px;
		object-fit: cover;
		background: #f3f3f3;
		display: flex;
		align-items: center;
		justify-content: center;
		border: var(--sc-input-border);
		border-radius: var(--sc-border-radius-medium);
		box-shadow: var(--sc-shadow-small);
		flex: 0 0 40px;
	}

	th#name {
		width: 245px;
	}
	th#featured {
		width: 60px;
	}

</style>

<div class="wrap">
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
