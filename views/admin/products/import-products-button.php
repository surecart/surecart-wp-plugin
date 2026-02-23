<div class="sc-button-group" style="position: relative; top: -3px;">
	<a href="<?php echo esc_url( \SureCart::getUrl()->edit( 'product' ) ); ?>" class="button button-secondary" style="border-top-right-radius: 0; border-bottom-right-radius: 0;">
		<?php esc_html_e( 'Add New', 'surecart' ); ?>
	</a>
	<?php if ( class_exists( 'WooCommerce' ) ) : ?>
		<sc-dropdown placement="bottom-end">
			<button slot="trigger" class="button button-secondary" style="border-top-left-radius: 0; border-bottom-left-radius: 0;" aria-haspopup="true" aria-expanded="false" aria-label="<?php esc_attr_e( 'More Options', 'surecart' ); ?>">
				<sc-icon name="chevron-down" style="vertical-align: middle; margin-top: -2px;"></sc-icon>
			</button>
			<sc-menu>
				<sc-menu-item href="<?php echo esc_url( \SureCart::getUrl()->import( 'products' ) ); ?>">
					<?php esc_html_e( 'Import from Woo', 'surecart' ); ?>
				</sc-menu-item>
			</sc-menu>
		</sc-dropdown>
	<?php endif; ?>
</div>
