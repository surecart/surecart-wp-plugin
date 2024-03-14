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
		gap: 1em;
	}

</style>
<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>

	<sc-flex justify-content="center" class="container">
		<sc-card style="--sc-card-padding: var(--sc-spacing-xxx-large)">
			<form action="" method="post">
				<?php wp_nonce_field( 'bulk_delete_nonce', 'nonce' ); ?>
				<input type="hidden" name="confirm-bulk-delete" value="true" />
				<sc-flex flex-direction="column" style="--sc-flex-column-gap:1em;">
					<sc-icon name="trash"></sc-icon>
					<sc-heading size="large"><?php esc_html_e( 'Delete', 'surecart' ); ?></sc-heading>
					<sc-text>
						<?php esc_html_e( 'Are you sure you want to permanently delete the products you selected?', 'surecart' ); ?>
					</sc-text>
					<sc-flex class="button-container" justify-content="flex-start">
						<sc-button size="medium" type="primary" submit><?php esc_html_e( 'Delete', 'surecart' ); ?></sc-button>
						<sc-button size="medium" type="link" onclick="window.history.back()"><?php esc_html_e( 'Cancel', 'surecart' ); ?></sc-button>
					</sc-flex>
				</sc-flex>
			</form>
		</sc-card>
	</sc-flex>
</div>
