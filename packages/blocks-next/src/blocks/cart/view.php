<?php
$context = array(
	'isOpen' => false,
);
?>

<div
	class="sc-drawer"
	data-wp-interactive='{ "namespace": "surecart/cart-v2" }'
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $context ) ); ?>
>
	<button
		data-wp-on--click='surecart/dialog::callbacks.toggle'
		data--target=".sc-dialog"
		class="sc-cart__button"
	>
		<?php echo SureCart::svg()->get('shopping-bag'); ?>
	</button>

	<dialog class="sc-dialog">
		<div class="sc-dialog__header">
			<button
				autofocus
				data-wp-on--click='surecart/dialog::callbacks.toggle'
				data--target=".sc-dialog"
				style="border: 0; background: transparent; cursor: pointer;"
				title="<?php esc_attr_e( 'Close dialog', 'surecart' ); ?>"
			>
				<?php echo SureCart::svg()->get('arrow-left'); ?>
			</button>
			<p><?php esc_html_e( 'My Cart', 'surecart' ); ?></p>
			<button>1</button>
		</div>
		<div class="sc-dialog__body">
			<p><?php esc_html_e( 'Cart Items...', 'surecart' ); ?></p>
		</div>
	</dialog>
</div>
