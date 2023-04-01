<?php

namespace SureCartBlocks\Blocks\Product\Info;

use SureCart\Models\Form;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) ) {
			return '';
		}

		// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
		\SureCart::assets()->addComponentData(
			'sc-product',
			'#product-' . $product->id,
			[
				'product' => $product,
			]
		);

		// need a form for checkout.
		$form = \SureCart::forms()->getDefault();
		if ( empty( $form->ID ) ) {
			return current_user_can( 'edit_products' ) ? '<sc-alert type="warning" open>' . esc_html__( 'Your default store checkout form has been deleted. Please deactivate and reactivate the plugin to regenerate this form.', 'surecart' ) . '</sc-alert>' : '';
		}

		// need a page to checkout.
		$checkout_link = \SureCart::pages()->url( 'checkout' );
		if ( empty( $checkout_link ) ) {
			return current_user_can( 'edit_products' ) ? '<sc-alert type="warning" open>' . esc_html__( 'Your default store checkout page has been deleted. Please deactivate and reactivate the plugin to regenerate this page.', 'surecart' ) . '</sc-alert>' : '';
		}
		ob_start();
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
			class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>"
		>
				<?php echo filter_block_content( $content, 'post' ); ?>
		</sc-product>

		<?php
		return ob_get_clean();
	}
}
