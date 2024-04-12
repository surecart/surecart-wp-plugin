<sc-dropdown>
	<sc-button slot="trigger" caret>Add New</sc-button>
	<sc-menu>
		<sc-menu-item href="<?php echo esc_attr( \SureCart::getUrl()->edit( 'affiliate-payout' ) ); ?>">Payout</sc-menu-item>
		<sc-menu-item href="<?php echo esc_attr( \SureCart::getUrl()->edit( 'affiliate-payout-group' ) ); ?>">Payout Batch</sc-menu-item>
	</sc-menu>
</sc-dropdown>
