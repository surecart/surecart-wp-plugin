<style>
	.surecart-webhook-change-notice {
		padding: 2rem;
	}
	.surecart-webhook-change-notice .breadcrumbs {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.surecart-webhook-change-notice h1 {
		font-size: 24px;
		color: #000;
	}
	.surecart-webhook-change-notice .description {
		font-size: 16px;
		color: #52555B;
		font-weight: 400;
		max-width: 700px;
	}
	.surecart-webhook-change-notice .learn-more-safe-mode {
		color: #52555B;
	}
	.surecart-webhook-change-notice .webhook-cards {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2rem;
		margin-top: 1.5rem;
	}
	.surecart-webhook-change-notice .webhook-cards .webhook-card {
		flex: 1;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 0 0 1px rgba(0,0,0,.05), 0 1px 3px 0 rgba(0,0,0,.15);
		padding: 2rem;
	}
	.surecart-webhook-change-notice .webhook-links {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.surecart-webhook-change-notice .webhook-links span {
		font-size: 16px;
		color: #52555B;
		padding: 6px 12px;
		border-radius: 22px;
		font-weight: 700;
	}
	.surecart-webhook-change-notice .webhook-links .previous-webhook {
		background: #FFF5EB;
		color: #B87637;
		text-decoration: line-through;
	}
	.surecart-webhook-change-notice .webhook-links .previous-to-current {
		background: #fff;
		border: 1px solid #D9D9D9;
		padding: 6px 10px;
	}
	.surecart-webhook-change-notice .webhook-links .current-webhook {
		background: #E8F8F1;
		color: #01824C;
	}
	.surecart-webhook-change-notice .webhook-links .webhook-action-link {
		width: 100%;
		text-align: center;
	}
	.surecart-webhook-change-notice .webhook-links .webhook-action-link a {
		display: block;
		background: #01824C;
		color: #FFF;
		border-radius: 4px;
		padding: 10px 20px;
		font-size: 16px;
		font-weight: 400;
		text-decoration: none;
		transition: all 0.2s ease-in-out;
	}
	.surecart-webhook-change-notice .webhook-links .webhook-action-link a:hover {
		opacity: 0.8;
	}
</style>

<div class="notice notice-warning surecart-webhook-change-notice">
	<div class="breadcrumbs">
		<img style="display: block" src="<?php echo esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ); ?>" alt="SureCart" width="125">
		<span>〉</span>
		<span>
			<?php esc_html_e( 'Safe Mode', 'surecart' ); ?>
		</span>
	</div>
	<h1>
		<?php esc_html_e( 'Safe Mode has been activated', 'surecart' ); ?>
	</h1>
	<p class="description">
		<?php
		esc_html_e(
			'Your site is in Safe Mode because you have 2 SureCart stores that appear to be duplicates. 
		Two sites that are telling SureCart they\'re the same site.',
			'surecart'
		);
		?>
		<a href="https://docs.surecart.com/article/35-what-is-safe-mode" target="_blank" class="learn-more-safe-mode">
			<?php esc_html_e( 'Learn more about Safe Mode.', 'surecart' ); ?>
		</a>  
	</p>
	<div class="webhook-cards">
		<div class="webhook-card">
			<h2><?php esc_html_e( 'Update SureCart site connection', 'surecart' ); ?></h2>
			<p>
			Your connection will be updated to <b>siteb.example.com</b>.<br><b>sitea.example.com</b> will be disconnected from SureCart.
			</p>
			<div class="webhook-links">
				<span class="previous-webhook">
					<?php echo esc_url( $previous_web_url ); ?>
				</span>
				<span class="previous-to-current">
					↓
				</span>
				<span class="current-webhook">
					<?php echo esc_url( $current_web_url ); ?>
				</span>
				<p class="webhook-action-link">
					<a href="<?php echo esc_url( $update_url ); ?>">
						<?php esc_html_e( 'I Changed My Site Address', 'surecart' ); ?>
					</a>
				</p>
			</div>
		</div>
		<div class="webhook-card">
			<h2><?php esc_html_e( 'Treat each as independent sites', 'surecart' ); ?></h2>
			<p>
			<b>siteb.example.com</b> will add a new connection to SureCart.<br><b>sitea.example.com</b> will keep its existing connection..
			</p>
			<div class="webhook-links">
				<span class="current-webhook">
					<?php echo esc_url( $previous_web_url ); ?>
				</span>
				<span class="">
					-
				</span>
				<span class="current-webhook">
					<?php echo esc_url( $current_web_url ); ?>
				</span>
				<p class="webhook-action-link">
					<a href="<?php echo esc_url( $add_url ); ?>">
						<?php esc_html_e( 'This Is A Duplicate Or Staging Site', 'surecart' ); ?>
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
<?php
