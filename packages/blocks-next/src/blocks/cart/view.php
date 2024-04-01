<div
	class="sc-cart-block"
	data-wp-interactive='{ "namespace": "surecart/cart-v2" }'
>
	<button
		data-wp-on--click='surecart/drawer::actions.toggle'
		data--target=".sc-drawer"
		class="sc-cart__button"
	>
		<?php echo SureCart::svg()->get('shopping-bag'); ?>
	</button>

	<dialog class="sc-drawer" data-wp-on--click="surecart/drawer::actions.closeOverlay">
		<div class="sc-drawer__header">
			<button
				autofocus
				data-wp-on--click='surecart/drawer::actions.toggle'
				data--target=".sc-drawer"
				style="border: 0; background: transparent; cursor: pointer;"
				title="<?php esc_attr_e( 'Close drawer', 'surecart' ); ?>"
			>
				<?php echo SureCart::svg()->get('arrow-left'); ?>
			</button>
			<p><?php esc_html_e( 'My Carts', 'surecart' ); ?></p>
			<button>1</button>
		</div>
		<div class="sc-drawer__body" style="min-height: 73vh;">
			<p><?php esc_html_e( 'Cart Items...', 'surecart' ); ?></p>
		</div>
		<div class="sc-drawer__footer">
			<button
				data-wp-on--click='surecart/drawer::actions.toggle'
				data--target=".sc-drawer"
				class="sc-drawer__footer__button"
			>
				<?php esc_html_e( 'Close', 'surecart' ); ?>
			</button>
		</div>
	</dialog>
</div>
