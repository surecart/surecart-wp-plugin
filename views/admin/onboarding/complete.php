<style>
	#wpwrap {
		background: var(--ce-color-gray-50);
	}


	.wrap {
		display: grid;
		height: calc(100vh - 32px);
	}

	.ce-container {
		margin: auto;
		max-width: 500px;
		width: 100%;
		padding: 2rem;
	}

	.ce-section-heading {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
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

		<?php if ( ! empty( $status ) && 'missing' === $status ) : ?>
			<div class="notice notice-error is-dismissible">
				<p><?php esc_html_e( 'Please enter an API key.', 'surecart' ); ?></p>
			</div>
		<?php endif; ?>


		<div class="ce-section-heading">
			<h3>
				<ce-icon name="download-cloud"></ce-icon>
				<?php esc_html_e( 'Just one last step!', 'surecart' ); ?>
			</h3>
		</div>

		<form action="" method="post">
			<?php wp_nonce_field( 'update_plugin_settings', 'nonce' ); ?>

			<ce-flex flex-direction="column" style="--spacing: var(--ce-spacing-xxx-large)">
				<ce-flex flex-direction="column">
					<ce-dashboard-module>
						<ce-card>
							<ce-input size="large" label="<?php echo esc_attr_e( 'Enter your API Token', 'surecart' ); ?>" type="password" name="api_token" placeholder="<?php echo esc_attr_e( 'Api token', 'surecart' ); ?>" autofocus></ce-input>
							<ce-button type="primary" size="large" full submit>
								<?php esc_html_e( 'Complete Installation', 'surecart' ); ?>
								<ce-icon name="arrow-right" slot="suffix"></ce-icon>
							</ce-button>
						</ce-card>
					</ce-dashboard-module>
				</ce-flex>
			</ce-flex>
		</form>
	</div>
</div>
