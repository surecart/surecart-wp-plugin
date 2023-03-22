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

		$purchases = Purchase::where(
			[
				'customer_ids' => array_values( User::current()->customerIds() ),
			]
		)->with(
			[
				'product',
				'license',
			]
		)->paginate(
			[
				'page'     => 1,
				'per_page' => 100,
			]
		);

		if ( is_wp_error( $purchases ) ) {
			return '<sc-alert type="error" open>' . $purchases->get_error_message() . '</sc-alert>';
		}

		$licensed_purchases = array_filter(
			$purchases->data,
			function( $purchase ) {
				return ! empty( $purchase->license );
			}
		);

		if ( empty( $licensed_purchases ) ) {
			return;
		}

		ob_start();
		?>

		<sc-heading><?php esc_html_e( 'Licenses', 'surecart' ); ?></sc-heading>
		<sc-card no-padding>
			<sc-stacked-list>
			<?php foreach ( $licensed_purchases as $purchase ) : ?>
				<sc-stacked-list-row style="--columns: 3;">
				<sc-spacing style="--spacing:var(--sc-spacing-xx--small);">
					<sc-text style="--font-weight:var(--sc-font-weight-bold);">
						<?php echo wp_kses_post( $purchase->product->name ); ?>
					</sc-text>
					<sc-tag><?php sprintf( _n( '%s activation', '%s activations', $purchase->license->activations_count, 'surecart' ), $purchase->license->activations_count ); ?></sc-tag>
				</sc-spacing>

					<a href="
					<?php
					echo esc_url(
						add_query_arg(
							[
								'license'  => $purchase->license,
								'model'    => 'license',
								'action'   => 'show',
								'customer' => $purchase->customer,
								'nonce'    => wp_create_nonce( 'customer-license' ),
							],
							remove_query_arg( array_keys( $_GET ) ) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
						)
					);
					?>
					"><span><?php esc_html_e( 'View', 'surecart' ); ?> </span></a>
				</sc-stacked-list-row>
			<?php endforeach; ?>
			</sc-stacked-list>
		</sc-card>
		<?php

		return ob_get_clean();
	}
}
