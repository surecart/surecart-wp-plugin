<style>
	#wpwrap {
		background: var(--ce-color-gray-50);
	}

	:root {
		--wp-admin-theme-color: #007cba;
		--ce-color-primary-500: var(--wp-admin-theme-color);
		--ce-focus-ring-color-primary: var(
			--wp-admin-theme-color
		);
		--ce-input-border-color-focus: var(
			--wp-admin-theme-color
		);
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
				<p><?php _e( 'Saved.', 'surecart' ); ?></p>
			</div>
		<?php endif; ?>

		<?php if ( 'missing' === $status ) : ?>
			<div class="notice notice-error is-dismissible">
				<p><?php _e( 'Please enter an API key.', 'surecart' ); ?></p>
			</div>
		<?php endif; ?>

		<form action="" method="post">
			<div class="ce-section-heading">
				<h3>
					<ce-icon name="sliders"></ce-icon>
					<span><?php _e( 'Plugin Settings', 'surecart' ); ?></span>
				</h3>
				<ce-button type="primary" submit>
					<?php esc_html_e( 'Save Settings', 'surecart' ); ?>
				</ce-button>
			</div>

			<?php wp_nonce_field( 'update_plugin_settings', 'nonce' ); ?>

			<ce-flex flex-direction="column" style="--spacing: var(--ce-spacing-xxx-large)">
				<ce-flex flex-direction="column">
					<ce-text style="--font-size: var(--ce-font-size-large); --font-weight: var(--ce-font-weight-bold); --line-height:1;"><?php esc_html_e( 'Connection Details', 'surecart' ); ?></ce-text>
					<ce-text style="margin-bottom: 1em; --line-height:1; --color: var(--ce-color-gray-500)"><?php esc_html_e( 'Update your api token to change or update the connection to SureCart.', 'surecart' ); ?></ce-text>
					<ce-card>
						<ce-input label="<?php echo esc_attr_e( 'Api Token', 'surecart' ); ?>" type="password" value="<?php echo esc_attr( $api_token ); ?>" name="api_token" placeholder="<?php echo esc_attr_e( 'Enter your api token.', 'surecart' ); ?>"></ce-input>
						<ce-button href="https://app.surecart.com" target="_blank">
							<?php esc_html_e( 'Find My Api Token', 'surecart' ); ?>
							<ce-icon name="arrow-right" slot="suffix"></ce-icon>
						</ce-button>
					</ce-card>
				</ce-flex>

				<ce-flex flex-direction="column">
					<ce-text style="--font-size: var(--ce-font-size-large); --font-weight: var(--ce-font-weight-bold); --line-height:1;"><?php esc_html_e( 'Uninstall', 'surecart' ); ?></ce-text>
					<ce-text style="margin-bottom: 1em; --line-height:1; --color: var(--ce-color-gray-500)"><?php esc_html_e( 'Change your plugin uninstall settings.', 'surecart' ); ?></ce-text>
					<ce-card>
						<ce-switch name="uninstall" <?php checked( $uninstall, 1 ); ?> value="on">
							<?php _e( 'Uninstall On Delete', 'surecart' ); ?>
							<span slot="description"><?php _e( 'Completely remove all plugin data when deleted. This cannot be undone.', 'surecart' ); ?></span>
						</ce-switch>
					</ce-card>
				</ce-flex>
			</ce-flex>

		</form>
	</div>
</div>
