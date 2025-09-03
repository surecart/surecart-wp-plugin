<?php

namespace SureCart\WordPress\Pages;

/**
 * Handles page creation
 */
class PageService {
	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap() {
		if ( defined( 'SURECART_RUNNING_TESTS' ) ) {
			return;
		}
		add_action( 'display_post_states', [ $this, 'displayDefaultPageStatuses' ] );
		// add_filter( 'pre_delete_post', [ $this, 'restrictDefaultPageDeletion' ], 11, 2 );
		// add_filter( 'pre_trash_post', [ $this, 'restrictDefaultPageDeletion' ], 11, 2 );
		// add_filter( 'wp_insert_post_empty_content', [ $this, 'restrictDefaultCheckoutRemove' ], 11, 2 );
	}

	/**
	 * Restrict default page deletion
	 *
	 * @param boolean  $delete Delete status.
	 * @param \WP_Post $post Post object.
	 *
	 * @return null;
	 */
	public function restrictDefaultPageDeletion( $delete, $post ) {
		$default_checkout = \SureCart::pages()->getID( 'checkout' );
		$default_form     = \SureCart::forms()->getDefault();
		$default_form_id  = $default_form->ID ?? null;
		$post_id          = $post->ID;

		if ( in_array( $post_id, [ $default_checkout, $default_form_id ], true ) ) {
			$message = $post_id === $default_form ? esc_html__( 'To prevent misconfiguration, you cannot delete the default checkout form. Please deactivate SureCart to delete this form.', 'surecart' ) : esc_html__( 'To prevent misconfiguration, you cannot delete the default checkout page. Please deactivate SureCart to delete this page.', 'surecart' );
			wp_die(
				esc_html( $message ),
				esc_html__( 'Deleting This is Restricted', 'surecart' ),
			);
		}

		return $delete;
	}

	/**
	 * Restrict default form remove
	 *
	 * @param boolean $maybe_empty Maybe empty.
	 * @param array   $post Post data.
	 *
	 * @return boolean|void
	 */
	public function restrictDefaultCheckoutRemove( $maybe_empty, $post ) {
		$default_checkout = \SureCart::pages()->getID( 'checkout' );
		$default_form     = \SureCart::forms()->getDefault();
		$default_form_id  = $default_form->ID ?? null;
		$post_id          = $post['ID'];

		if ( in_array( $post_id, [ $default_checkout, $default_form_id ], true ) ) {
			if ( ! has_block( 'surecart/checkout-form', $post['post_content'] ) && ! has_block( 'surecart/form', $post['post_content'] ) ) {
				$message = esc_html__( 'To prevent misconfiguration, you cannot delete the default checkout form. Please deactivate SureCart to delete this form.', 'surecart' );
				wp_die(
					esc_html( $message ),
					esc_html__( 'Deleting This is Restricted', 'surecart' ),
				);
				return true;
			}
		}

		return $maybe_empty;
	}

	/**
	 * The option name
	 *
	 * @param string $option Option name.
	 * @param string $post_type Post type slug.
	 * @return string
	 */
	public function getOptionName( $option, $post_type ) {
		return 'surecart_' . $option . '_' . $post_type . '_id';
	}

	/**
	 * Find Post/Page by its id
	 *
	 * @param integer $id Post/Page ID.
	 *
	 * @return \WP_Post|null
	 */
	public function find( $id ) {
		$post = get_post( $id );
		if ( $post && ! in_array( $post->post_status, [ 'pending', 'trash', 'future', 'auto-draft' ], true ) ) {
			return $post;
		}
		return null;
	}

	/**
	 * Adds status indicator for this website.
	 *
	 * @param array $states States array.
	 *
	 * @return array States array with ours added
	 */
	public function displayDefaultPageStatuses( $states ) {
		global $post;

		// bail if not our post type.
		if ( get_post_type( $post ) !== 'page' ) {
			return $states;
		}

		if ( $post->ID === $this->getId( 'checkout' ) ) {
			$states[] = __( 'Store Checkout', 'surecart' );
		}

		if ( $post->ID === $this->getId( 'dashboard' ) ) {
			$states[] = __( 'Customer Dashboard', 'surecart' );
		}

		if ( $post->ID === $this->getId( 'order-confirmation' ) ) {
			$states[] = __( 'Order Confirmation', 'surecart' );
		}

		if ( $post->ID === $this->getId( 'shop' ) ) {
			$states[] = __( 'Shop Page', 'surecart' );
		}

		return $states;
	}

	/**
	 * Find the post for a given option and post type
	 *
	 * @param string $option Option name.
	 * @param string $post_type Post type slug.
	 *
	 * @return \WP_Post|null
	 */
	public function get( $option, $post_type = 'page' ) {
		return $this->findByName( $option, $post_type );
	}

	/**
	 * Find the url for the given option and post type
	 *
	 * @param string $option Option name.
	 * @param string $post_type Post type slug.
	 *
	 * @return string
	 */
	public function url( $option, $post_type = 'page' ) {
		$post = $this->get( $option, $post_type );
		return $post ? get_permalink( $post ) : '';
	}

	/**
	 * Find the post id for the given option and post type
	 *
	 * @param string $option Option name.
	 * @param string $post_type Post type slug.
	 *
	 * @return integer
	 */
	public function getId( $option, $post_type = 'page' ) {
		return (int) get_option( $this->getOptionName( $option, $post_type ) );
	}

	/**
	 * Find the post for a given option and post type
	 *
	 * @param string $option Option name.
	 * @param string $post_type Post type slug.
	 *
	 * @return \WP_Post|null
	 */
	public function findByName( $option, $post_type = 'page' ) {
		// get the option from the database.
		$option_value = (int) get_option( $this->getOptionName( $option, $post_type ) );

		// check if page has been created.
		if ( $option_value > 0 ) {
			$page = $this->find( $option_value );
			if ( $page ) {
				return $page;
			}
		}

		return null;
	}

	/**
	 * Find or create a page and store the ID in an option.
	 *
	 * @param mixed  $slug Slug for the new page.
	 * @param string $option Option name to store the page's ID.
	 * @param string $page_title (default: '') Title for the new page.
	 * @param string $page_content (default: '') Content for the new page.
	 * @param int    $post_parent (default: 0) Parent for the new page.
	 * @param string $post_status (default: publish) The post status of the new page.
	 * @param string $post_type (default: 'page') The post type of the new page.
	 *
	 * @return \WP_Post
	 */
	public function findOrCreate( $slug, $option = '', $page_title = '', $page_content = '', $post_parent = 0, $post_status = 'publish', $post_type = 'page', $page_template = null ) {
		$page = $this->get( $option, $post_type );
		if ( $page ) {
			return $page;
		}

		return $this->create( $slug, $option, $page_title, $page_content, $post_parent, $post_status, $post_type, $page_template );
	}

	/**
	 * Create a page and store the ID in an option.
	 *
	 * @param mixed  $slug Slug for the new page.
	 * @param string $option Option name to store the page's ID.
	 * @param string $page_title (default: '') Title for the new page.
	 * @param string $page_content (default: '') Content for the new page.
	 * @param int    $post_parent (default: 0) Parent for the new page.
	 * @param string $post_status (default: publish) The post status of the new page.
	 * @param string $post_type (default: 'page') The post type of the new page.
	 *
	 * @return int page ID.
	 */
	public function create( $slug, $option = '', $page_title = '', $page_content = '', $post_parent = 0, $post_status = 'publish', $post_type = 'post', $page_template = null ) {
		$page_data = [
			'post_status'    => $post_status,
			'post_type'      => $post_type,
			'post_author'    => 1,
			'post_name'      => $slug,
			'post_title'     => $page_title,
			'post_content'   => $page_content,
			'post_parent'    => $post_parent,
			'comment_status' => 'closed',
			'page_template'  => $page_template,
		];

		$page_id = wp_insert_post( $page_data );

		do_action( 'surecart/post_created', $page_id, $page_data );

		if ( $option ) {
			update_option( $this->getOptionName( $option, $post_type ), $page_id );
		}

		return get_post( $page_id );
	}

	/**
	 * Check if the page is the customer dashboard page by current URL.
	 *
	 * @return boolean
	 */
	public function isCustomerDashboardPageByUrl(): bool {
		$customer_dashboard_url = $this->url( 'dashboard' );

		// If the customer dashboard URL is empty, return false.
		if ( empty( $customer_dashboard_url ) ) {
			return false;
		}

		// Get the current URL.
		$scheme      = is_ssl() ? 'https://' : 'http://';
		$host        = filter_input( INPUT_SERVER, 'HTTP_HOST', FILTER_SANITIZE_URL );
		$request_uri = filter_input( INPUT_SERVER, 'REQUEST_URI', FILTER_SANITIZE_URL );
		$current_url = $scheme . $host . $request_uri;

		// Check if the current URL is the customer dashboard URL.
		return untrailingslashit( $current_url ) === untrailingslashit( $customer_dashboard_url );
	}

	/**
	 * Get SureCart page screen ids.
	 *
	 * @return array
	 */
	public function getSureCartPageScreenIds(): array {
		return apply_filters(
			'sc_surecart_page_screen_ids',
			[
				'toplevel_page_sc-dashboard',
				'surecart_page_sc-orders',
				'surecart_page_sc-abandoned-checkouts',
				'surecart_page_sc-invoices',
				'sc_product',
				'surecart_page_sc-products',
				'surecart_page_sc-product-collections',
				'surecart_page_sc-bumps',
				'surecart_page_sc-upsell-funnels',
				'surecart_page_sc-product-groups',
				'surecart_page_sc-coupons',
				'surecart_page_sc-licenses',
				'surecart_page_sc-subscriptions',
				'surecart_page_sc-cancellation-insights',
				'surecart_page_sc-affiliates',
				'surecart_page_sc-affiliate-requests',
				'surecart_page_sc-affiliate-clicks',
				'surecart_page_sc-affiliate-referrals',
				'surecart_page_sc-affiliate-payouts',
				'surecart_page_sc-customers',
				'edit-sc_form',
				'sc_form',
				'surecart_page_sc-settings',
			]
		);
	}
}
