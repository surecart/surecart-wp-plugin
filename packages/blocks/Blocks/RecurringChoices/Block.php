<?php

namespace SureCartBlocks\Blocks\RecurringChoices;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\Product;

/**
 * Logout Button Block.
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
	public function render( $attributes, $content = '' ) {
		$product = Product::with( [ 'prices' ] )->find( $attributes['product_id'] );
		$prices = $product->prices->data;
		ob_start(); ?>

		<div
			style="
				width: 100%;
			"
		>
		<div
				style="
					width: 100%;
					font-size: 1em;
					font-weight: 500;
				"
			>
				<?php echo esc_html( __('Make it recurring', 'surecart') ); ?>
			</div>
			<div
				style="
					width: 100%;
					display: flex;
					justify-content: space-between;
					gap: 2em;
				"
			>
				<div
					style="
						width: 50%;
					"
				>
					<sc-recurring-price-choice-container
						label="<?php echo esc_html( __('Yes, count me in!', 'surecart') ); ?>"
						product="<?php echo esc_attr( $attributes['product_id'] ); ?>"
					/>
				</div>
				<div
					style="
						width: 50%;
					"
				>

					<sc-choice
						value="one-time"
						style="
							height: 100%;`
						"
					>
						<?php echo esc_html( __('No, donate once', 'surecart') ); ?>
					</sc-choice>
				</div>
			</div>
		</div>


		<?php
		return ob_get_clean();
	}
}
