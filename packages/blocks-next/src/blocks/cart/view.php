<?php
$context = array(
	'isOpen' => false,
);
?>

<div
	class="sc-cart-block"
	data-wp-interactive='{ "namespace": "surecart/cart-v2" }'
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $context ) ); ?>
>
	<button
		data-wp-on--click='surecart/drawer::actions.toggle'
		data--target=".sc-drawer"
		class="sc-cart__button"
	>
		<?php echo SureCart::svg()->get('shopping-bag'); ?>
	</button>

	<dialog class="sc-drawer">
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
			<p><?php esc_html_e( 'My Cart', 'surecart' ); ?></p>
			<button>1</button>
		</div>
		<div class="sc-drawer__body">
			<p><?php esc_html_e( 'Cart Items...', 'surecart' ); ?></p>
		</div>
	</dialog>
</div>
