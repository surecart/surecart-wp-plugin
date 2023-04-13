<?php


// need a form for checkout.

use SureCart\Models\Form;
use SureCartBlocks\Util\BlockStyleAttributes;

$product       = get_query_var( 'surecart_current_product' );
$form          = \SureCart::forms()->getDefault();
$checkout_link = \SureCart::pages()->url( 'checkout' );

if ( empty( $form->ID ) ) {
	echo current_user_can( 'edit_products' ) ? '<sc-alert type="warning" open>' . esc_html__( 'Your default store checkout form has been deleted. Please deactivate and reactivate the plugin to regenerate this form.', 'surecart' ) . '</sc-alert>' : '';
}

if ( empty( $checkout_link ) ) {
	echo current_user_can( 'edit_products' ) ? '<sc-alert type="warning" open>' . esc_html__( 'Your default store checkout page has been deleted. Please deactivate and reactivate the plugin to regenerate this page.', 'surecart' ) . '</sc-alert>' : '';
}

[ 'styles' => $styles, 'classes' => $classes ] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );

?>

<?php if ( ! empty( $product->id ) ) : ?>
	<?php
		// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
		\SureCart::assets()->addComponentData(
			'sc-product',
			'#product-' . $product->id,
			[
				'product' => $product,
			]
		);
	?>

	<sc-product
			id="product-<?php echo esc_attr( $product->id ); ?>"
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>"
			checkout-url="<?php echo esc_url( $checkout_link ); ?>"
			media-position="<?php echo esc_attr( $attributes['media_position'] ); ?>"
			media-width="<?php echo esc_attr( $attributes['media_width'] ); ?>"
			column-gap="<?php echo esc_attr( $attributes['column_gap'] ); ?>"
			sticky-content="<?php echo esc_attr( $attributes['sticky_content'] ); ?>"
			class="<?php echo esc_attr( $classes ); ?>"
			style="<?php echo esc_attr( $styles ); ?> --sc-font-sans: initial; --sc-input-font-family: initial;"
		>
			<?php echo filter_block_content( $content, 'post' ); ?>
	</sc-product>
<?php endif; ?>
