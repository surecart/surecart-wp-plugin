<?php

namespace SureCart\WordPress\Admin\Menus;

use SureCart\Models\ApiToken;

/**
 * Handles the admin toolbar menus and items.
 */
class AdminToolbarService {
	/**
	 * Application instance.
	 *
	 * @var \SureCartCore\Application\Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param \SureCartCore\Application\Application $app Application instance.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Bootstrap the service and hook into WordPress.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Admin bar site menu.
		if ( apply_filters( 'surecart_show_admin_bar_visit_store', true ) ) {
			add_action( 'admin_bar_menu', array( $this, 'adminBarSiteMenu' ), 31 );
		}

		// Admin toolbar new content menu.
		if ( apply_filters( 'surecart_show_admin_bar_new_content', true ) ) {
			add_action( 'admin_bar_menu', array( $this, 'adminBarNewContent' ), 71 );
		}

		// Admin toolbar SureCart menu.
		if ( $this->isEnabled() ) {
			add_action( 'admin_bar_menu', array( $this, 'adminBarMenu' ), 99 );
		}
	}

	/**
	 * Check if the admin toolbar is enabled.
	 *
	 * @return bool
	 */
	public function isEnabled(): bool {
		return ! get_option( 'surecart_admin_toolbar_disabled', false );
	}

	/**
	 * Check if the current user is in the admin area.
	 *
	 * @return bool
	 */
	public function isAdmin(): bool {
		return is_admin();
	}

	/**
	 * Check if the admin bar is showing.
	 *
	 * @return bool
	 */
	public function isAdminBarShowing(): bool {
		return is_admin_bar_showing();
	}

	/**
	 * Check if the current page is the admin area.
	 *
	 * @return bool
	 */
	public function isShopPageOnFront(): bool {
		return intval( get_option( 'page_on_front' ) ) === \SureCart::pages()->getId( 'shop' );
	}

	/**
	 * Check if the admin menu should be shown.
	 *
	 * @return bool
	 */
	public function showAdminMenu(): bool {
		if ( ! $this->isAdmin() || ! $this->isAdminBarShowing() ) {
			return false;
		}

		// Show only when the user is a member of this site, or they're a super admin.
		if ( ! $this->isBlogMember() ) {
			return false;
		}

		// Don't display when shop page is the same of the page on front.
		if ( $this->isShopPageOnFront() ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if the user is a member of the site.
	 *
	 * @return bool
	 */
	public function isBlogMember(): bool {
		return is_user_member_of_blog() || is_super_admin();
	}

	/**
	 * Add the "Visit Store" link in admin bar main menu.
	 *
	 * @since 2.4.0
	 * @param \WP_Admin_Bar $wp_admin_bar Admin bar instance.
	 */
	public function adminBarSiteMenu( $wp_admin_bar ) {
		if ( ! $this->showAdminMenu() ) {
			return;
		}

		// Add an option to visit the store.
		$wp_admin_bar->add_node(
			array(
				'parent' => 'site-name',
				'id'     => 'view-sc-store',
				'title'  => class_exists( 'WooCommerce' ) ? __( 'Visit SureCart Store', 'surecart' ) : __( 'Visit Store', 'surecart' ),
				'href'   => \SureCart::pages()->url( 'shop' ),
			)
		);
	}

	/**
	 * Add SureCart admin page links to the admin bar "+ New" menu.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar Admin bar instance.
	 */
	public function adminBarNewContent( $wp_admin_bar ) {
		// Show only when the user is a member of this site, or they're a super admin.
		if ( ! $this->isBlogMember() ) {
			return;
		}

		// Only show if user has API token connected.
		if ( ! \SureCart::account()->isConnected() ) {
			return;
		}

		$woocommerce_exists = class_exists( 'WooCommerce' );

		if ( current_user_can( 'edit_sc_products' ) ) {
			// Add Product link.
			$wp_admin_bar->add_node(
				array(
					'parent' => 'new-content',
					'id'     => 'new-sc-product',
					'title'  => $woocommerce_exists ? __( 'SureCart Product', 'surecart' ) : __( 'Product', 'surecart' ),
					'href'   => esc_url( admin_url( 'admin.php?page=sc-products&action=edit' ) ),
				)
			);

			// Add Product Collection link.
			$wp_admin_bar->add_node(
				array(
					'parent' => 'new-sc-product',
					'id'     => 'new-sc-collection',
					'title'  => $woocommerce_exists ? __( 'SureCart Collection', 'surecart' ) : __( 'Collection', 'surecart' ),
					'href'   => esc_url( admin_url( 'admin.php?page=sc-product-collections&action=edit' ) ),
				)
			);

			// Add Order Bump link.
			$wp_admin_bar->add_node(
				array(
					'parent' => 'new-sc-product',
					'id'     => 'new-sc-bump',
					'title'  => $woocommerce_exists ? __( 'SureCart Order Bump', 'surecart' ) : __( 'Order Bump', 'surecart' ),
					'href'   => esc_url( admin_url( 'admin.php?page=sc-bumps&action=edit' ) ),
				)
			);

			// Add Upsell link.
			$wp_admin_bar->add_node(
				array(
					'parent' => 'new-sc-product',
					'id'     => 'new-sc-upsell',
					'title'  => $woocommerce_exists ? __( 'SureCart Upsell', 'surecart' ) : __( 'Upsell', 'surecart' ),
					'href'   => esc_url( admin_url( 'admin.php?page=sc-upsell-funnels&action=edit' ) ),
				)
			);
		}

		// Add Coupon link.
		if ( current_user_can( 'edit_sc_coupons' ) ) {
			$wp_admin_bar->add_node(
				array(
					'parent' => 'new-content',
					'id'     => 'new-sc-coupon',
					'title'  => $woocommerce_exists ? __( 'SureCart Coupon', 'surecart' ) : __( 'Coupon', 'surecart' ),
					'href'   => esc_url( admin_url( 'admin.php?page=sc-coupons&action=edit' ) ),
				)
			);
		}

		// Add Invoice link.
		if ( current_user_can( 'edit_sc_invoices' ) ) {
			$wp_admin_bar->add_node(
				array(
					'parent' => 'new-content',
					'id'     => 'new-sc-invoice',
					'title'  => $woocommerce_exists ? __( 'SureCart Invoice', 'surecart' ) : __( 'Invoice', 'surecart' ),
					'href'   => esc_url( \SureCart::getUrl()->create( 'invoices' ) ),
				)
			);
		}
	}

	/**
	 * Add SureCart main menu to the admin bar.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar Admin bar instance.
	 *
	 * @return void
	 */
	public function adminBarMenu( $wp_admin_bar ) {
		// Its for frontend only.
		if ( ! is_admin_bar_showing() || is_admin() ) {
			return;
		}

		// Only show on single product edit screen and user can edit products.
		if ( ! is_singular( 'sc_product' ) || ! current_user_can( 'edit_sc_products' ) ) {
			return;
		}

		// Only show if user has API token and product is not empty.
		if ( ! ApiToken::get() || empty( sc_get_product() ) ) {
			return;
		}

		$surecart_logo = esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'images/icon.svg' );
		?>

		<style>
			#wp-admin-bar-surecart-toolbar > .ab-item {
				display: flex !important;
				align-items: center;
			}

			#wp-admin-bar-surecart-toolbar > .ab-item::before {
				content: "";
				display: inline-block;
				width: 18px;
				height: 18px;
				background-color: #a7aaad !important; /* WordPress toolbar like icon color */
				-webkit-mask: url('<?php echo esc_url( $surecart_logo ); ?>') no-repeat center;
				mask: url('<?php echo esc_url( $surecart_logo ); ?>') no-repeat center;
				-webkit-mask-size: contain;
				mask-size: contain;
				-webkit-mask-size: 18px;
				mask-size: 18px;
			}
		</style>

		<?php
		$product = sc_get_product();
		$wp_admin_bar->add_node(
			[
				'id'    => 'surecart-toolbar',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => '#',
			]
		);

		// Add product edit link.
		$wp_admin_bar->add_node(
			[
				'id'     => 'surecart-edit-product',
				'parent' => 'surecart-toolbar',
				'title'  => 'Product Details',
				'href'   => \SureCart::getUrl()->edit( 'product', $product->id ),
			]
		);

		// Add secondary group
		$wp_admin_bar->add_group(
			array(
				'id'     => 'surecart-design',
				'parent' => 'surecart-toolbar',
				'meta'   => array( 'class' => 'ab-sub-secondary' ),
			)
		);

		$this->renderProductContent( $wp_admin_bar );
		$this->renderProductTemplate( $wp_admin_bar );
		$this->maybeAddStickyPurchaseTemplate( $wp_admin_bar );
	}

	/**
	 * Check if the current page is rendered with blocks.
	 *
	 * @return bool
	 */
	public function isRenderedWithBlocks(): bool {
		return ! $this->isRenderedWithBricks() && ! $this->isRenderedWithElementor();
	}

	/**
	 * Add product content and template items to admin toolbar.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar The admin bar instance.
	 *
	 * @return void
	 */
	public function renderProductContent( $wp_admin_bar ): void {
		if ( ! $this->isRenderedWithBlocks() ) {
			return;
		}

		// Add product content link.
		$wp_admin_bar->add_node(
			[
				'id'     => 'surecart-edit-product-content',
				'parent' => 'surecart-design',
				'title'  => __( 'Content Designer', 'surecart' ),
				'href'   => admin_url( '/post.php?post=' . get_the_ID() . '&action=edit' ),
			]
		);
	}

	/**
	 * Add product content item to admin toolbar.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar The admin bar instance.
	 *
	 * @return void
	 */
	public function renderProductTemplate( $wp_admin_bar ): void {
		if ( ! $this->isRenderedWithBlocks() ) {
			return;
		}

		$product       = sc_get_product();
		$template_type = wp_is_block_theme() ? 'wp_template' : 'wp_template_part';
		$template_id   = wp_is_block_theme() ? $product->template_id : $product->template_part_id;
		if ( empty( $template_id ) ) {
			$template_id = wp_is_block_theme() ? 'surecart/surecart//single-sc_product' : 'surecart/surecart//product-info';
		}

		if ( empty( get_block_template( $template_id, $template_type ) ) ) {
			return;
		}

		// Add product template link.
		$wp_admin_bar->add_node(
			[
				'id'     => 'surecart-edit-product-template',
				'parent' => 'surecart-design',
				'title'  => __( 'Product Template', 'surecart' ),
				'href'   => admin_url( '/site-editor.php?postType=' . rawurlencode( $template_type ) . '&postId=' . rawurlencode( $template_id ) . '&canvas=edit' ),
			]
		);
	}

	/**
	 * Check if bricks is rendering the current page.
	 *
	 * @return bool
	 */
	public function isRenderedWithBricks(): bool {
		return class_exists( '\Bricks\Elements' ) && $this->app->resolve( 'surecart.bricks.template' )->isRenderedWithBricks();
	}

	/**
	 * Check if elementor is rendering the current page.
	 *
	 * @return bool
	 */
	public function isRenderedWithElementor(): bool {
		return class_exists( '\Elementor\Plugin' ) && $this->app->resolve( 'elementor.templates.service' )->isRenderedWithElementor();
	}

	/**
	 * Maybe add sticky purchase template to admin toolbar.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar The admin bar instance.
	 *
	 * @return void
	 */
	public function maybeAddStickyPurchaseTemplate( $wp_admin_bar ): void {
		$sticky_purchase_template_id = 'surecart/surecart//sticky-purchase';
		if ( empty( get_block_template( $sticky_purchase_template_id, 'wp_template_part' ) ) ) {
			return;
		}

		$wp_admin_bar->add_node(
			[
				'id'     => 'surecart-edit-sticky-template',
				'parent' => 'surecart-design',
				'title'  => __( 'Sticky Purchase Template', 'surecart' ),
				'href'   => admin_url( '/site-editor.php?postType=wp_template_part&postId=' . rawurlencode( $sticky_purchase_template_id ) . '&canvas=edit' ),
			]
		);
	}
}
