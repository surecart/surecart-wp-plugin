<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Dynamic Pricing', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'auto-fees' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search', 'surecart' ), 'sc-search-auto-fees' ); ?>

	<form id="auto-fees-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>

<script>
	const deleteLinks = document.querySelectorAll( '.row-actions .delete>a' );
	Array.from( deleteLinks ).forEach( button => {
		button.addEventListener( 'click', event => {
			event.preventDefault();
			const confirmed = confirm("<?php echo esc_js( __( 'Are you sure you want to delete this dynamic price? This action cannot be undone.', 'surecart' ) ); ?>");
			if ( confirmed ) {
				window.location.href = event.target.href;
			}
		} );
	} );
</script>
