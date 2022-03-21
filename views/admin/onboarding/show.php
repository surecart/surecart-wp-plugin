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
		padding: 2rem;
	}

	.ce-section-heading {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* border-bottom: 1px solid rgba(229, 231, 235, 1); */
		/* padding-bottom: 1rem; */
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
		<div class="ce-section-heading">
			<h3>
				<ce-icon name="shopping-bag"></ce-icon>
				<?php esc_html_e( 'Getting Started With SureCart', 'surecart' ); ?>
			</h3>
		</div>
		<ce-dashboard-module>
				<ce-card>
					<ce-text style="--font-size: var(--ce-font-size-x-large); --line-height: var(--ce-line-height-normal)">
					<?php esc_html_e( 'Get started by selecting a creating your first product or creating a new, custom form.', 'surecart' ); ?>
				</ce-text>
				<ce-button type="primary" full size="large" href="<?php echo esc_url_raw( $settings_url ); ?>">
					<ce-icon name="sliders" slot="prefix"></ce-icon>
					<?php esc_html_e( 'Store Settings', 'surecart' ); ?>
				</ce-button>
				<ce-button type="primary" full size="large" href="<?php echo esc_url_raw( $product_url ); ?>">
					<ce-icon name="shopping-bag" slot="prefix"></ce-icon>
					<?php esc_html_e( 'Create A Product', 'surecart' ); ?>
				</ce-button>
				<ce-button type="primary" outline full size="large" href="<?php echo esc_url_raw( $form_url ); ?>">
					<ce-icon name="layers" slot="prefix"></ce-icon>
					<?php esc_html_e( 'Create A Form', 'surecart' ); ?>
				</ce-button>
			</ce-card>
			<ce-button full type="text" size="large" href="<?php echo esc_url_raw( $docs_url ); ?>" target="_blank">
				<ce-icon name="life-buoy" slot="prefix"></ce-icon>
				<?php esc_html_e( 'Get Help', 'surecart' ); ?>
				<ce-icon name="external-link" slot="suffix"></ce-icon>
			</ce-button>
		</ce-dashboard-module>
	</div>
</div>
