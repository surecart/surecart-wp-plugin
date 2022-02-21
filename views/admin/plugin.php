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

		<form action="" method="post" onSubmit="return false;">
			<div class="ce-section-heading">
				<h3>
					<ce-icon name="sliders"></ce-icon>
					<span><?php _e( 'Plugin Settings', 'checkout_engine' ); ?></span>
				</h3>
				<ce-button type="primary" submit>
					<?php esc_html_e( 'Save Settings', 'checkout_engine' ); ?>
				</ce-button>
			</div>

			<?php wp_nonce_field( 'update_plugin_settings', 'nonce' ); ?>

			<ce-flex flex-direction="column" style="--spacing: var(--ce-spacing-xxx-large)">
				<ce-flex flex-direction="column">
					<ce-text style="--font-size: var(--ce-font-size-large); --font-weight: var(--ce-font-weight-bold); --line-height:1;"><?php esc_html_e( 'Connection Details', 'checkout_engine' ); ?></ce-text>
					<ce-text style="margin-bottom: 1em; --line-height:1; --color: var(--ce-color-gray-500)"><?php esc_html_e( 'Update your api token to change or update the connection to SureCart.', 'checkout_engine' ); ?></ce-text>
					<ce-card>
						<ce-input label="<?php echo esc_attr_e( 'Api Token', 'checkout_engine' ); ?>" type="password" value="<?php echo esc_attr( $api_token ); ?>" name="api_token" placeholder="<?php echo esc_attr_e( 'Enter your api token.', 'checkout_engine' ); ?>"></ce-input>
						<ce-button href="https://app.surecart.com" target="_blank">
							<?php esc_html_e( 'Find My Api Token', 'checkout_engine' ); ?>
							<ce-icon name="arrow-right" slot="suffix"></ce-icon>
						</ce-button>
					</ce-card>
				</ce-flex>

				<ce-flex flex-direction="column">
					<ce-text style="--font-size: var(--ce-font-size-large); --font-weight: var(--ce-font-weight-bold); --line-height:1;"><?php esc_html_e( 'Uninstall', 'checkout_engine' ); ?></ce-text>
					<ce-text style="margin-bottom: 1em; --line-height:1; --color: var(--ce-color-gray-500)"><?php esc_html_e( 'Change your plugin uninstall settings.', 'checkout_engine' ); ?></ce-text>
					<ce-card>
						<ce-switch name="uninstall" onCeChange="if(!confirm('Are you sure you want to sign out?'))return false;" <?php checked( $uninstall, 0, 1 ); ?>>
							<?php _e( 'Uninstall On Delete', 'checkout_engine' ); ?>
							<span slot="description"><?php _e( 'Completely remove all plugin data when deleted. This cannot be undone.', 'checkout_engine' ); ?></span>
						</ce-switch>
					</ce-card>
				</ce-flex>
			</ce-flex>

		</form>
	</div>
</div>
