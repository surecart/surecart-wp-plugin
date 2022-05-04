<style>
	#sc-settings-header {
		box-sizing: border-box;
		width: 100%;
		position: sticky;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		background: #fff;
		border-bottom: 1px solid var(--sc-color-gray-200);
	}
</style>
<div id="sc-settings-header">
	<sc-breadcrumbs style="font-size: 16px">
		<sc-breadcrumb>
			<img style="display: block" src="<?php echo esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ); ?>" alt="SureCart" width="125">
		</sc-breadcrumb>
		<sc-breadcrumb><?php esc_html_e( 'Settings' ); ?></sc-breadcrumb>
	</sc-breadcrumbs>

	<sc-tag>
	<?php
	// translators: Version number.
	echo sprintf( esc_html__( 'Version %s', 'surecart' ), esc_html( \SureCart::plugin()->version() ) );
	?>
	</sc-tag>
</div>
