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

// Will remove this from this branch & provide BSF Bundle Team.

// Do not display the cancel, update/add payment method buttons, restore/resubscribe buttons if current purchase is a BSF Vault purchase.
add_filter(
	'surecart_plan_show_action_buttons',
	function ( $subscription = null ) {
		if ( empty( $subscription ) || empty( $subscription->current_period ) ) {
			return true;
		}
		$current_period = $subscription->current_period;

		if ( empty( $current_period->checkout ) || empty( $current_period->checkout->metadata ) || empty( $current_period->checkout->metadata->wp_created_by ) ) {
			return true;
		}

		return false;
	},
	10,
	1
);

// Do not display the Update Plan/ Change Plan section if current purchase is a BSF Vault purchase.
add_filter(
	'surecart/subscription/can_be_changed',
	function ( $can_be_switched = true, $subscription = null ) {
		if ( empty( $can_be_switched ) || empty( $subscription ) || empty( $subscription->current_period ) ) {
			return $can_be_switched;
		}
		$current_period = $subscription->current_period;

		if ( empty( $current_period->checkout ) || empty( $current_period->checkout->metadata ) || empty( $current_period->checkout->metadata->wp_created_by ) ) {
			return $can_be_switched;
		}

		return false;
	},
	10,
	2
);

add_filter(
	'surecart_after_current_plan_details',
	function ( $content = '', $subscription = null ) {
		if ( empty( $subscription ) || empty( $subscription->current_period ) ) {
			return null;
		}
		$current_period = $subscription->current_period;

		if ( empty( $current_period->checkout ) || empty( $current_period->checkout->metadata ) || empty( $current_period->checkout->metadata->wp_created_by ) ) {
			return null;
		}

		ob_start();
		?>
		<sc-button type="primary" href="https://vault.brainstormforce.com/customer-dashboard" target="_blank">
			<sc-icon name="inbox" slot="prefix"></sc-icon>
			<?php echo __( 'Manage from Vault', 'surecart' ); ?>
		</sc-button>
		<?php
		return ob_get_clean();
	},
	10,
	2
);
