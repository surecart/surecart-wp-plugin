<?php
/**
 * Declare any actions and filters here. USE THIS SPARINGLY.
 *
 * In most cases you should use a service provider, but in cases where you
 * just need to add an action/filter and forget about it you can add it here.
 *
 * @package SureCart
 */

use SureCart\Models\Price;
use SureCart\Models\Product;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// don't let WordPress redirect 404 permalink for product pages.
add_filter(
	'do_redirect_guess_404_permalink',
	function( $guess ) {
		if ( ( strpos( $_SERVER['REQUEST_URI'], '/product/' ) !== false ) ) {
			return false;
		}
		if ( ( strpos( $_SERVER['REQUEST_URI'], 'surecart/webhooks' ) !== false ) ) {
			return false;
		}
		return $guess;
	},
	9999999999
);

add_filter(
	'query_vars',
	function( $query_vars ) {
		$query_vars[] = 'product';
		return $query_vars;
	}
);
add_filter(
	'get_canonical_url',
	function( $url ) {
		global $sc_product;
		if ( empty( $sc_product->id ) ) {
			return $url;
		}
		return \SureCart::routeUrl( 'product', [ 'id' => $sc_product->id ] );
	}
);
add_filter(
	'get_shortlink',
	function( $url ) {
		global $sc_product;
		if ( empty( $sc_product->id ) ) {
			return $url;
		}
		return \SureCart::routeUrl( 'product', [ 'id' => $sc_product->id ] );
	}
);
add_filter(
	'post_link',
	function( $permalink ) {
		global $sc_product;
		if ( empty( $sc_product->id ) ) {
			return $permalink;
		}
		return \SureCart::routeUrl( 'product', [ 'id' => $sc_product->id ] );
	}
);

// register uninstall.
register_uninstall_hook( SURECART_PLUGIN_FILE, 'surecart_uninstall' );
function surecart_uninstall() {
	if ( (bool) get_option( 'sc_uninstall', false ) ) {
		\SureCart::activation()->uninstall();
	}
}

// redirect to an admin page that they can't access instead of homepage.
// Otherwise the homepage if they cannot access admin.
add_filter(
	'surecart.middleware.user.can.redirect_url',
	function( $url ) {
		if ( current_user_can( 'read' ) ) {
			return get_admin_url() . 'admin.php?page=sc-denied';
		}
		return $url;
	}
);


add_filter(
	'get_post_metadata',
	function( $value, $object_id, $meta_key, $single, $meta_type ) {
		// we only care about our post type.
		if ( 'sc-product' !== get_post_type( $object_id ) ) {
			return $value;
		}

		// we want to leave this one alone.
		if ( 'sc_product_id' === $meta_key ) {
			return $value;
		}

		// get the associated product id.
		$product_id = get_post_meta( $object_id, 'sc_product_id', true );
		if ( empty( $product_id ) ) {
			return $value;
		}

		// asking for the product.
		if ( 'product' === $meta_key ) {
			return Product::with( [ 'prices' ] )->find( $product_id );
		}

		// asking for prices.
		if ( 'prices' === $meta_key ) {
			return Price::where(
				[
					'archived'    => false,
					'product_ids' => [ $product_id ],
				]
			)->get();
		}

		return $value;
	},
	9,
	5
);

register_meta(
	'post',
	'sc_product_id',
	[
		'type'              => 'string',
		'show_in_rest'      => true,
		'single'            => true,
		'sanitize_callback' => 'sanitize_text_field',
		'auth_callback'     => function () {
			return current_user_can( 'edit_sc_products' );
		},
	]
);


add_filter(
	'rest_sc-product_query',
	function( $args, $request ) {
		$args += [
			'meta_key'   => $request['meta_key'],
			'meta_value' => $request['meta_value'],
			'meta_query' => $request['meta_query'],
		];

		return $args;
	},
	99,
	2
);
