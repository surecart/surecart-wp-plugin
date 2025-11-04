<?php
/**
 * Declare any actions and filters here. USE THIS SPARINGLY.
 *
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package SureCart
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Don't let WordPress redirect guess our web routes.
 *
 * This prevents WordPress from finding a close match
 * to one of our web routes in the database and redirecting.
 */
add_filter(
	'do_redirect_guess_404_permalink',
	function ( $guess ) {
		if ( ( strpos( $_SERVER['REQUEST_URI'], '/' . untrailingslashit( \SureCart::settings()->permalinks()->getBase( 'buy_page' ) ) . '/' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/webhooks' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/redirect' ) !== false ) ) {
			return false;
		}
		return $guess;
	},
	9999999999
);

register_uninstall_hook( SURECART_PLUGIN_FILE, 'surecart_uninstall' );

/**
 * Uninstall.
 *
 * @return void
 */
function surecart_uninstall() {
	if ( (bool) get_option( 'sc_uninstall', false ) ) {
		\SureCart::activation()->uninstall();
	}
}

// redirect to an admin page that they can't access instead of homepage.
// Otherwise the homepage if they cannot access admin.
add_filter(
	'surecart.middleware.user.can.redirect_url',
	function ( $url ) {
		if ( current_user_can( 'read' ) ) {
			return get_admin_url() . 'admin.php?page=sc-denied';
		}
		return $url;
	}
);

add_action(
	'admin_init',
	function () {
		if ( ! isset( $_GET['test'] ) ) {
			return;
		}

		\SureCart\Models\ProvisionalAccount::create(
			[
				'email'             => get_option( 'admin_email' ),
				'source_account_id' => 'test',
				'account_currency'  => 'usd',
				'products'          => [
					[
						'name'                => 'AAA2 Import Product',
						'status'              => 'published', // important.
						'product_collections' => [
							[
								'name'        => 'Collection 1',
								'description' => 'Collection 1 description',
								'slug'        => 'collection-1',
							],
							[
								'name'        => 'Collection 2',
								'description' => 'Collection 2 description',
								'slug'        => 'collection-2',
							],
						],
						'prices'              => [ // see prices docs.
							[
								'amount' => 11111, // in cents.
							],
							[
								'amount'                   => 22222,
								'recurring_interval_count' => 1,
								'recurring_interval'       => 'month',
							],
						],
						'variant_options'     => [
							[
								'name'   => 'Size',
								'values' => [ 'Small', 'Large' ],
							],
							[
								'name'   => 'Color',
								'values' => [ 'Black', 'Red' ],
							],
						],
						'variants'            => [
							[
								'option_1' => 'Small',
								'option_2' => 'Black',
							],
							[
								'option_1' => 'Large',
								'option_2' => 'Red',
							],
						],
					],
				],
			]
		);
	}
);
