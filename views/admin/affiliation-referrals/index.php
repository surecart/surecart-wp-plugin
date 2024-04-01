<style>
	.row-actions .approve {
		display: inline !important;
	}
</style>

<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>

<?php
if ( ! empty( $_GET['live_mode'] ) && 'false' === $_GET['live_mode'] ) {
	?>
	<div class="notice notice-info" style="padding-top: var(--sc-spacing-medium);">
		<sc-text tag="h2" style="--font-size: var(--sc-font-size-x-large);--font-weight:bold;">
			<?php esc_html_e( 'What are test mode referrals?', 'surecart' ); ?>
		</sc-text>
		<p><?php esc_html_e( 'Test mode referrals are created when an order is placed in test mode and an affiliate is associated with the order. These referrals do not impact stats, are not included in payouts, and are not visible to affiliates. They are solely for testing your affiliate setup and can be deleted or ignored.', 'surecart' ); ?></p>
	</div>
	<?php
}
?>

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
