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
				<?php esc_html_e( 'Welcome to SureCart!', 'checkout_engine' ); ?>
			</h3>
		</div>
		<ce-dashboard-module>
			<ce-card>
				<ce-text style="--font-size: var(--ce-font-size-x-large); --line-height: var(--ce-line-height-normal)">Commerce on WordPress has never been easier, faster, or more flexible.</ce-text>
				<ce-button type="primary" full size="large" href="<?php echo esc_url_raw( $url ); ?>">
					Set Up My Store
					<ce-icon name="arrow-right" slot="suffix"></ce-icon>
				</ce-button>
			</ce-card>
			<ce-text style="--font-size: var(--ce-font-sizesmall); --line-height: var(--ce-line-height-normal); --text-align: center; --color: var(--ce-color-gray-500)">
				By clicking "Set Up", you agree to our <a href="#" target="_blank">Terms of Service</a>.
			</ce-text>
		</ce-dashboard-module>
	</div>
</div>
