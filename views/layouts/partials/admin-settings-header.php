<style>
	#sc-settings-header {
		box-sizing: border-box;
		width: 100%;
		position: sticky;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 20px;
		background: #fff;
		border-bottom: 1px solid var(--sc-color-gray-200);
		gap: 1.2em;
		z-index:9;
	}
	@media screen and (min-width: 600px) {
		.sc-settings-header-container {
			position: sticky;
			top: 32px;
			z-index: 9989	;
		}
	}
</style>
<div class="sc-settings-header-container">
	<?php if ( ! empty( $_GET['status'] ) && 'cache_cleared' === sanitize_text_field( wp_unslash( $_GET['status'] ) ) ) : ?>
		<sc-alert open type="info" closable style="position: relative; z-index: 10;"><?php esc_html_e( 'Cache cleared.', 'surecart' ); ?></sc-alert>
	<?php endif; ?>

	<?php if ( ! empty( $claim_url ) ) : ?>
		<sc-provisional-banner claim-url="<?php echo esc_url( $claim_url ); ?>"></sc-provisional-banner>
	<?php endif; ?>

	<div id="sc-settings-header">
		<sc-breadcrumbs style="font-size: 16px">
			<sc-breadcrumb>
				<img style="display: block" src="<?php echo esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ); ?>" alt="SureCart" width="125">
			</sc-breadcrumb>
			<sc-breadcrumb href="<?php echo esc_url( menu_page_url( 'sc-settings', false ) ); ?>"><?php esc_html_e( 'Settings', 'surecart' ); ?></sc-breadcrumb>
			<?php if ( ! empty( $breadcrumb ) ) : ?>
				<sc-breadcrumb><?php echo esc_html( $breadcrumb ); ?></sc-breadcrumb>
			<?php endif; ?>
		</sc-breadcrumbs>

		<sc-flex>
		<form action="
		<?php
			echo esc_url_raw(
				add_query_arg(
					[
						'cache' => 'clear',
					]
				)
			);
			?>
			" method="post">
				<?php wp_nonce_field( 'update_plugin_settings', 'nonce' ); ?>
				<sc-button type="default" size="small" outline submit><?php esc_html_e( 'Clear Account Cache', 'surecart' ); ?></sc-button>
			</form>
			<sc-button type="text" size="small" href="https://status.surecart.com" target="_blank">
				<?php esc_html_e( 'SureCart Status', 'surecart' ); ?>
				<sc-icon name="external-link" slot="suffix"></sc-icon>
			</sc-button>
			<sc-tag>
				<?php
				// translators: Version number.
				echo sprintf( esc_html__( 'Version %s', 'surecart' ), esc_html( \SureCart::plugin()->version() ) );
				?>
			</sc-tag>
		</sc-flex>
	</div>
</div>
