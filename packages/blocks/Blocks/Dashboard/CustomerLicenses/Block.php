<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerLicenses;

use SureCart\Models\User;
use SureCart\Models\Purchase;
use SureCartBlocks\Blocks\Dashboard\DashboardPage;

/**
 * Customer licenses
 */
class Block extends DashboardPage {
	/**
	 * Render the preview (overview)
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		if ( ! is_user_logged_in() ) {
			return;
		}

		$ids = User::current()->customerIds();

		$cust_test_id = isset( $ids['test'] ) ? $ids['test'] : '';

		$purchases = Purchase::where([
			'customer_ids' => array_values( User::current()->customerIds() ),
		])->with([
			'product'
		])->paginate([
			'page' => 1,
			'per_page' => 20
		]);

		// ->with( [
		// 	'customer', 'checkout', 'license',
		// 	'product', 'product.downloads',
		// 	'product.product', 'download.media', 'license.activations'
		// ] )

		// if ( empty( $purchases->customer->id ) || ! User::current()->hasCustomerId( $purchases->customer->id ) ) {
		// 	return null;
		// }

		if( ! is_array( $purchases->data ) || ! empty( $purchases->data ) ) {
			return;
		}

		$rows_html = '';

		foreach( $purchases->data as $purchase ) {
			if( empty( $purchase->license ) ) {
				continue;
			}
			$rows_html .='<sc-stacked-list-row style="--columns: 3;">';
			$rows_html .= '<span>' . $purchase->product->name . '</span>';
			$rows_html .= '<span>' . $purchase->license . '</span>';
			$rows_html .= '<a href="' . esc_url(
				add_query_arg(
					[
						'license'    => $purchase->license,
						'model'  => 'license',
						'action' => 'show',
						'customer' => $purchase->customer,
						'nonce' => wp_create_nonce( 'customer-license' )
					],
					remove_query_arg( array_keys( $_GET ) ) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
				)
			) . '"><span>' . __( 'View', 'surecart' ) . '</span></a>';
			$rows_html .= '</sc-stacked-list-row>';
		}

		ob_start();
		?>

		<sc-heading><?php echo __( 'Licenses', 'surecart' ); ?></sc-heading>
		<sc-card no-padding>
			<sc-stacked-list>
				<?php echo $rows_html; ?>
			</sc-stacked-list>
		</sc-card>
		<?php

		return ob_get_clean();
	}
}
