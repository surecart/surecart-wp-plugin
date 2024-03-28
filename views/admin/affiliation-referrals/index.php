<style>
	.row-actions .approve {
		display: inline !important;
	}
</style>

<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>

<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Affiliate Referrals', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'affiliate-referral' ),
		]
	);
	?>

	<?php $table->views(); ?>
	<?php $table->display(); ?>
</div>

<script>
	const deleteLinks = document.querySelectorAll( '.row-actions .delete>a' );
	Array.from( deleteLinks ).forEach( button => {
		button.addEventListener( 'click', event => {
			event.preventDefault();
			const confirmed = confirm("<?php echo esc_js( __( 'Are you sure you want to delete this referral? This action cannot be undone.', 'surecart' ) ); ?>")
			if ( confirmed ) {
				window.location.href = event.target.href;
			}
		} );
	} );


	document.querySelector('sc-switch#live-mode-toggle')?.addEventListener('scChange',(e)=>{
		window.location.assign(e.target.checked ? '<?php echo esc_url_raw( add_query_arg( array( 'live_mode' => 'false' ), \SureCart::getUrl()->index( 'affiliate-referrals' ) ) ); ?>' : '<?php echo esc_url_raw( add_query_arg( array( 'live_mode' => 'true' ), \SureCart::getUrl()->index( 'affiliate-referrals' ) ) ); ?>');
	})
</script>
