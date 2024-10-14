
<sc-dropdown>
	<button slot="trigger" class="page-title-action">
		<?php esc_html_e( 'Add New', 'surecart' ); ?>
		<sc-icon name="chevron-down" style="vertical-align: middle; margin-top: -2px;"></sc-icon>
	</button>
	<sc-menu>
		<sc-menu-item href="<?php echo esc_attr( \SureCart::getUrl()->create( 'invoices' ) . '&live_mode=true' ); ?>">
			<?php esc_html_e( 'Live Invoice', 'surecart' ); ?>
		</sc-menu-item>
		<sc-menu-item href="<?php echo esc_attr( \SureCart::getUrl()->create( 'invoices' ) . '&live_mode=false' ); ?>">
			<?php esc_html_e( 'Test Invoice', 'surecart' ); ?>
		</sc-menu-item>
	</sc-menu>
</sc-dropdown>
