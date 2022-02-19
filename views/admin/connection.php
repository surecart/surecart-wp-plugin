<style>
	#wpwrap {
		background: var(--ce-color-gray-50);
	}

	.ce-container {
		margin-left: auto;
		margin-right: auto;
		max-width: 768px;
		padding: 2rem;
	}

	.ce-section-heading {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(229, 231, 235, 1);
		padding-bottom: 1rem;
	}

	.ce-section-heading h3 {
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1.25rem;
		line-height: 1.75rem;
		font-weight: 600;
		color: rgba(17, 24, 39, 1);
		display: flex;
		align-items: center;
		gap: 0.5em;
		color: var(--ce-color-gray-900);
	}
</style>

<div class="wrap">
	<div class="ce-container">

		<?php if ( 'saved' === $status ) : ?>
			<div class="notice notice-success is-dismissible">
				<p><?php _e( 'Saved.', 'checkout_engine' ); ?></p>
			</div>
		<?php endif; ?>

		<?php if ( 'missing' === $status ) : ?>
			<div class="notice notice-error is-dismissible">
				<p><?php _e( 'Please enter an API key.', 'checkout_engine' ); ?></p>
			</div>
		<?php endif; ?>

		<div class="ce-section-heading">
			<h3>
				<ce-icon name="upload-cloud"></ce-icon>
				<span><?php _e( 'Connection', 'checkout_engine' ); ?></span>
			</h3>
			<ce-button href="https://app.surecart.com" target="_blank" type="primary">
				<?php esc_html_e( 'View Account', 'checkout_engine' ); ?>
				<ce-icon name="arrow-right" slot="suffix"></ce-icon>
			</ce-button>
		</div>

		<form action="" method="post">
			<?php wp_nonce_field( 'update_connection', 'nonce' ); ?>

			<ce-flex flex-direction="column">
				<ce-text style="--font-size: var(--ce-font-size-large); --font-weight: var(--ce-font-weight-bold); --line-height:1;"><?php esc_html_e( 'Connection Details', 'checkout_engine' ); ?></ce-text>
				<ce-text style="margin-bottom: 1em; --line-height:1;"><?php esc_html_e( 'Update your api token to change or update the connection to SureCart.', 'checkout_engine' ); ?></ce-text>
				<ce-card title="Test">
					<ce-input label="<?php echo esc_attr_e( 'Api Token', 'checkout_engine' ); ?>" type="password" value="<?php echo esc_attr( $api_token ); ?>" name="api_token" placeholder="<?php echo esc_attr_e( 'Enter your api token.', 'checkout_engine' ); ?>"></ce-input>
					<ce-button type="primary" submit>
						<?php esc_html_e( 'Save Api Token', 'checkout_engine' ); ?>
					</ce-button>
				</ce-card>
			</ce-flex>
		</form>
	</div>
</div>
