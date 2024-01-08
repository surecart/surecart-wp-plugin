<style>
	#wpwrap {
		--sc-color-primary-500: var(--sc-color-brand-primary);
		background: var(--sc-color-brand-main-background);
	}

	.wrap .container {
		width: 100%;
		padding-top: 3em;
	}

	.wrap .container  sc-card {
		width: 100%;
		max-width: 600px;
	}

	.wrap .container sc-card sc-icon {
		font-size: 24px;
		color: var(--sc-color-primary-500);
	}

	.wrap .container .button-container {
		gap:1em;
	}

</style>
<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>

	<sc-flex justify-content="center" class="container">
		<sc-card >
			<form action="" method="post">
				<?php wp_nonce_field( 'restore_missing_page', 'nonce' ); ?>
				<input type="hidden" name="restore" value="<?php echo esc_attr( $restore ?? '' ); ?>" />
				<sc-flex flex-direction="column" style="--sc-flex-column-gap:1em;">
					<sc-icon name="repeat"></sc-icon>
					<sc-heading size="large"><?php esc_html_e( 'Restore', 'surecart' ); ?></sc-heading>
					<sc-text>
						<?php esc_html_e( 'This page is necessary for some SureCart eCommerce functions. Restoring this page will ensure there are no issues with the functionality of SureCart.', 'surecart' ); ?>
					</sc-text>
					<sc-flex class="button-container" justify-content="flex-start">
						<sc-button size="large" type="primary" submit>Restore</sc-button>
						<sc-button size="large" type="link" onclick="window.history.back()" >Cancel</sc-button>
					</sc-flex>
				</sc-flex>
			</form>
		</sc-card>
	</sc-flex>
</div>
