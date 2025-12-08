<?php

namespace SureCart\WordPress\Admin\Menus;

use SureCart\Models\ApiToken;

/**
 * Handles creation and enqueueing of admin menu pages and assets.
 */
class AdminMenuPageService {
	/**
	 * Top level menu slug.
	 *
	 * @var string
	 */
	protected $slug = 'sc-dashboard';

	/**
	 * Pages
	 *
	 * @var array
	 */
	protected $pages = array();

	/**
	 * Essential SureCart Pages
	 *
	 * @var array
	 */
	const ESSENTIAL_PAGES = array(
		'shop',
		'checkout',
		'dashboard',
	);

	/**
	 * Menu hidden pages.
	 *
	 * @var array
	 */
	const MENU_CURRENT_OVERRIDES = array(
		'sc-affiliate-payout-groups' => 'sc-affiliate-payouts',
	);

	/**
	 * Add menu items.
	 */
	public function bootstrap() {
		add_action( 'admin_menu', array( $this, 'registerAdminPages' ) );
		add_action( 'admin_head', array( $this, 'adminMenuCSS' ) );
		add_filter( 'parent_file', array( $this, 'forceSelect' ) );
		add_filter( 'parent_file', array( $this, 'applyMenuOverrides' ) );
	}

	/**
	 * Make sure these menu items get selected.
	 *
	 * @param string $file The file string.
	 *
	 * @return string
	 */
	public function forceSelect( $file ) {
		global $submenu_file;
		global $post;

		if ( ! empty( $post->ID ) && in_array(
			$post->ID,
			array(
				\SureCart::pages()->getId( 'cart', 'sc_cart' ),
				\SureCart::pages()->getId( 'checkout' ),
				\SureCart::pages()->getId( 'shop' ),
				\SureCart::pages()->getId( 'dashboard' ),
			)
		) ) {
			$file = $this->slug;
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$submenu_file = 'post.php?post=' . (int) $post->ID . '&action=edit';
		}

		// Check if we're editing a taxonomy that applies to sc_product post types.
		$screen   = get_current_screen();
		$taxonomy = get_taxonomy( $screen->taxonomy );
		if ( $screen && 'edit-tags' === $screen->base && in_array( 'sc_product', (array) $taxonomy->object_type, true ) ) {
			$file         = $this->slug;
			$submenu_file = \SureCart::taxonomies()->editLink( $screen->taxonomy, 'sc_product' ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}

		return $file;
	}

	/**
	 * Add some divider css.
	 *
	 * @return void
	 */
	public function adminMenuCSS(): void {
		echo '<style>
			#toplevel_page_' . $this->slug . ' li {
				clear: both;
			}
			#toplevel_page_' . $this->slug . ' li:not(:last-child) a:has(.sc-menu-divider):after {
				border-bottom: 1px solid hsla(0,0%,100%,.2);
				display: block;
				float: left;
				margin: 13px -15px 8px;
				content: "";
				width: calc(100% + 26px);
			}
		</style>';
	}

	/**
	 * Get the menu slug.
	 *
	 * @return string
	 */
	public function getMenuSlug() {
		// Set the slug to the getting started page if the user has no API token.
		if ( ! ApiToken::get() ) {
			return 'sc-getting-started';
		}

		return $this->slug;
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerAdminPages() {
		// Get the menu slug.
		$this->slug = $this->getMenuSlug();

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		\add_menu_page( __( 'Dashboard', 'surecart' ), __( 'SureCart', 'surecart' ), 'manage_sc_shop_settings', $this->slug, '__return_false', 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'images/icon.svg' ) ), apply_filters( 'surecart_menu_priority', 2.0001 ) );

		// not yet installed.
		if ( ! ApiToken::get() ) {
			$this->pages = array(
				'get-started'     => \add_submenu_page( $this->slug, __( 'Get Started', 'surecart' ), __( 'Get Started', 'surecart' ), 'manage_options', $this->slug, '__return_false' ),
				'complete-signup' => \add_submenu_page( '', __( 'Complete Signup', 'surecart' ), __( 'Complete Signup', 'surecart' ), 'manage_options', 'sc-complete-signup', '__return_false' ),
				'settings'        => \add_submenu_page( $this->slug, __( 'Settings', 'surecart' ), __( 'Settings', 'surecart' ), 'manage_options', 'sc-settings', '__return_false' ),
			);
			return;
		}

		$this->pages = array();

		/**
		 * Dashboard
		 */
		$this->pages += array(
			'get-started'     => \add_submenu_page( $this->slug, __( 'Dashboard', 'surecart' ), '<span class="sc-menu-divider">' . __( 'Dashboard', 'surecart' ) . '</span>', 'manage_sc_shop_settings', 'sc-dashboard', '__return_false' ),
			'complete-signup' => \add_submenu_page( '', __( 'Complete Signup', 'surecart' ), __( 'Complete Signup', 'surecart' ), 'manage_options', 'sc-complete-signup', '__return_false' ),
			'claim-account'   => \add_submenu_page( '', __( 'Claim Account', 'surecart' ), __( 'Claim Account', 'surecart' ), 'manage_options', 'sc-claim-account', '__return_false' ),
		);

		/**
		 * Orders
		 */
		$this->pages += array(
			'orders' => \add_submenu_page( $this->slug, __( 'Orders', 'surecart' ), __( 'Orders', 'surecart' ), 'edit_sc_orders', 'sc-orders', '__return_false' ),
		);
		// Orders submenu pages.
		if ( in_array( $_GET['page'] ?? '', [ 'sc-orders', 'sc-abandoned-checkouts', 'sc-invoices' ], true ) ) {
			$this->pages += array(
				'abandoned' => \add_submenu_page( $this->slug, __( 'Abandoned', 'surecart' ), '↳ ' . __( 'Abandoned', 'surecart' ), 'edit_sc_orders', 'sc-abandoned-checkouts', '__return_false' ),
				'invoices'  => \add_submenu_page( $this->slug, __( 'Invoices', 'surecart' ), '↳ ' . __( 'Invoices', 'surecart' ), 'edit_sc_invoices', 'sc-invoices', '__return_false' ),
			);
		}

		/**
		 * Products
		 */
		$this->pages += array(
			'products' => \add_submenu_page( $this->slug, __( 'Products', 'surecart' ), __( 'Products', 'surecart' ), 'edit_sc_products', 'sc-products', '__return_false' ),
		);

		// Product submenu pages.
		$taxonomies = array_diff( get_object_taxonomies( 'sc_product' ), array( 'sc_account', 'sc_collection' ) );
		sort( $taxonomies, SORT_STRING ); // Sort the taxonomies alphabetically.
		$is_product_menu_opened = in_array( $_GET['page'] ?? '', array( 'sc-products', 'sc-product-groups', 'sc-bumps', 'sc-upsell-funnels', 'sc-product-collections' ), true ) || in_array( $_GET['taxonomy'] ?? '', array_merge( $taxonomies, array( 'sc_collection' ) ), true );
		if ( $is_product_menu_opened ) {
			$this->pages += array(
				'product-collections' => \add_submenu_page( $this->slug, __( 'Product Collections', 'surecart' ), '↳ ' . __( 'Collections', 'surecart' ), 'edit_sc_products', 'sc-product-collections', '__return_false' ),
			);
			if ( ! empty( $taxonomies ) && is_array( $taxonomies ) ) {
				$this->pages += array_map(
					function ( $taxonomy ) {
						if ( ! taxonomy_exists( $taxonomy ) ) {
							return null;
						}
						$taxonomy_obj = get_taxonomy( $taxonomy );
						return \add_submenu_page( $this->slug, $taxonomy_obj->label, '↳ ' . $taxonomy_obj->labels->menu_name ?? $taxonomy_obj->label, 'edit_sc_products', \SureCart::taxonomies()->editLink( $taxonomy_obj->name, 'sc_product' ), '' );
					},
					$taxonomies,
					[ $is_product_menu_opened, $this->slug ]
				);
			}
			$this->pages += array(
				'bumps'          => \add_submenu_page( $this->slug, __( 'Order Bumps', 'surecart' ), '↳ ' . __( 'Order Bumps', 'surecart' ), 'edit_sc_products', 'sc-bumps', '__return_false' ),
				'upsells'        => \add_submenu_page( $this->slug, __( 'Upsells', 'surecart' ), '↳ ' . __( 'Upsells', 'surecart' ), 'edit_sc_products', 'sc-upsell-funnels', '__return_false' ),
				'product-groups' => \add_submenu_page( $this->slug, __( 'Upgrade Groups', 'surecart' ), '↳ ' . __( 'Upgrade Groups', 'surecart' ), 'edit_sc_products', 'sc-product-groups', '__return_false' ),
			);
		}

		/**
		 * Coupons
		 */
		$this->pages += array(
			'coupons'  => \add_submenu_page( $this->slug, __( 'Coupons', 'surecart' ), __( 'Coupons', 'surecart' ), 'edit_sc_coupons', 'sc-coupons', '__return_false' ),
			'licenses' => \add_submenu_page( $this->slug, __( 'Licenses', 'surecart' ), __( 'Licenses', 'surecart' ), 'edit_sc_products', 'sc-licenses', '__return_false' ),
		);

		/**
		 * Subscriptions
		 */
		$this->pages += array(
			'subscriptions' => \add_submenu_page( $this->slug, __( 'Subscriptions', 'surecart' ), __( 'Subscriptions', 'surecart' ), 'edit_sc_subscriptions', 'sc-subscriptions', '__return_false' ),
		);
		if ( in_array( $_GET['page'] ?? '', array( 'sc-subscriptions', 'sc-cancellation-insights' ), true ) ) {
			$this->pages += array(
				'cancellations' => \add_submenu_page( $this->slug, __( 'Cancellation Insights', 'surecart' ), '↳ ' . __( 'Cancellations', 'surecart' ), 'edit_sc_subscriptions', 'sc-cancellation-insights', '__return_false' ),
			);
		}

		$this->pages += array(
			'affiliates' => \add_submenu_page( $this->slug, __( 'Affiliates', 'surecart' ), __( 'Affiliates', 'surecart' ), 'edit_sc_affiliates', 'sc-affiliates', '__return_false' ),
		);
		if ( in_array( $_GET['page'] ?? '', array( 'sc-affiliates', 'sc-affiliate-requests', 'sc-affiliate-clicks', 'sc-affiliate-referrals', 'sc-affiliate-payouts', 'sc-affiliate-payout-groups' ), true ) ) {
			$this->pages += array(
				'affiliate-requests'      => \add_submenu_page( $this->slug, __( 'Requests', 'surecart' ), '↳ ' . __( 'Requests', 'surecart' ), 'edit_sc_affiliates', 'sc-affiliate-requests', '__return_false' ),
				'affiliate-clicks'        => \add_submenu_page( $this->slug, __( 'Clicks', 'surecart' ), '↳ ' . __( 'Clicks', 'surecart' ), 'edit_sc_affiliates', 'sc-affiliate-clicks', '__return_false' ),
				'affiliate-referrals'     => \add_submenu_page( $this->slug, __( 'Referrals', 'surecart' ), '↳ ' . __( 'Referrals', 'surecart' ), 'edit_sc_affiliates', 'sc-affiliate-referrals', '__return_false' ),
				'affiliate-payouts'       => \add_submenu_page( $this->slug, __( 'Payouts', 'surecart' ), '↳ ' . __( 'Payouts', 'surecart' ), 'edit_sc_affiliates', 'sc-affiliate-payouts', '__return_false' ),
				'affiliate-payout-groups' => \add_submenu_page( ' ', __( 'Payout Groups', 'surecart' ), '', 'edit_sc_affiliates', 'sc-affiliate-payout-groups', '__return_false' ),
			);
		}

		/**
		 * Customers
		 */
		$this->pages += array(
			'customers' => \add_submenu_page( $this->slug, __( 'Customers', 'surecart' ), '<span class="sc-menu-divider">' . __( 'Customers', 'surecart' ) . '</span>', 'edit_sc_customers', 'sc-customers', '__return_false' ),
		);

		/**
		 * Restore
		 */
		if ( 'sc-restore' === ( $_GET['page'] ?? '' ) ) {
			$this->pages += array(
				'restore' => \add_submenu_page( null, __( 'Restore', 'surecart' ), __( 'Restore', 'surecart' ), 'manage_options', 'sc-restore', '__return_false' ),
			);
		}

		$this->pages += array(
			'shop'      => $this->getPage( 'shop', __( 'Shop', 'surecart' ) ),
			'checkout'  => $this->getPage( 'checkout', __( 'Checkout', 'surecart' ) ),
			'cart'      => $this->addTemplateSubMenuPage( 'cart', __( 'Cart', 'surecart' ), 'surecart/surecart//cart' ),
			'dashboard' => $this->getPage( 'dashboard', __( 'Customer Area', 'surecart' ) ),
			'forms'     => \add_submenu_page( $this->slug, __( 'Forms', 'surecart' ), '<span class="sc-menu-divider">' . __( 'Custom Forms', 'surecart' ) . '</span>', 'manage_options', 'edit.php?post_type=sc_form', '' ),
			'settings'  => \add_submenu_page( $this->slug, __( 'Settings', 'surecart' ), __( 'Settings', 'surecart' ), 'manage_options', 'sc-settings', '__return_false' ),
		);
	}

	/**
	 * Get the page link.
	 *
	 * @param string $slug The slug.
	 * @param string $name The name.
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	public function getPage( $slug, $name, $post_type = 'page', $divider = false ) {
		// add filter to disable shop page menu item.
		if ( ! get_option( 'surecart_' . $slug . '_admin_menu', true ) ) {
			return;
		}

		$page_id = \SureCart::pages()->getId( $slug, $post_type );

		$status = '';

		$post_status = get_post_status( $page_id );
		if ( 'publish' !== $post_status ) {
			$status = '<span class="awaiting - mod">' . ( get_post_status_object( $post_status )->label ?? esc_html__( 'Deleted', 'surecart' ) ) . '</span>';
		}

		$label = $name . $status;
		if ( $divider ) {
			$label = '<span class="sc-menu-divider">' . $label . '</span>';
		}

		return \add_submenu_page( $this->slug, $name, $label, 'manage_options', $this->getSubMenuPageSlug( $slug, $page_id ), '' );
	}

	/**
	 * Get the page menu slug.
	 *
	 * @param string $slug The slug.
	 * @param int    $page_id The page id.
	 */
	public function getSubMenuPageSlug( $slug, $page_id ) {
		// check if it is not an essential page.
		if ( ! in_array( $slug, self::ESSENTIAL_PAGES, true ) ) {
			return 'post.php?post=' . $page_id . '&action=edit';
		}

		$post_status = get_post_status( $page_id );

		// check if the page is published.
		if ( 'publish' === $post_status ) {
			return 'post.php?post=' . $page_id . '&action=edit';
		}

		return 'admin.php?page=sc-restore&restore=' . $slug;
	}

	/**
	 * Add a submenu page for a template.
	 *
	 * @param string $slug The slug.
	 * @param string $name The name.
	 * @param string $template_slug The template slug.
	 *
	 * @return null|string|false
	 */
	public function addTemplateSubMenuPage( $slug, $name, $template_slug ) {
		// add filter to disable shop page menu item.
		if ( ! get_option( 'surecart_' . $slug . '_admin_menu', true ) ) {
			return;
		}

		return \add_submenu_page(
			$this->slug,
			$name,
			$name,
			'manage_options',
			add_query_arg(
				[
					'postId'   => rawurlencode( $template_slug ),
					'postType' => 'wp_template_part',
					'canvas'   => 'edit',
				],
				'site-editor.php',
			),
			''
		);
	}

	/**
	 * Select menu item.
	 *
	 * @param string $file The file.
	 *
	 * @return string
	 */
	public function applyMenuOverrides( $file ) {
		global $plugin_page;

		foreach ( self::MENU_CURRENT_OVERRIDES as $key => $value ) {
			if ( $key === $plugin_page ) {
				$plugin_page = $value; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			}
		}

		return $file;
	}
}
