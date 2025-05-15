<?php

namespace SureCart\Integrations\HelpWidget;

/**
 * Checklist.
 */
class Checklist {
	/**
	 * Account.
	 *
	 * @var \SureCart\Models\Account
	 */
	protected $account;

	/**
	 * Load.
	 *
	 * @var bool
	 */
	protected $checklist;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Account\AccountService $account Account.
	 */
	public function __construct( \SureCart\Account\AccountService $account ) {
		$this->account = $account;
	}

	/**
	 * Has Checklist.
	 *
	 * @return bool
	 */
	public function exists() {
		return $this->account->has_checklist;
	}

	/**
	 * Configure.
	 *
	 * @return void
	 */
	public function configure() { ?>
		<script>
			if ( typeof Gleap !== 'undefined' ) {
				Gleap.on("initialized", () => {
					Gleap.setUrlHandler((url) => {
						if ( url.includes('set-up-your-branding') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-settings&tab=brand'); ?>';
							return;
						}
						if ( url.includes('create-product') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-products&action=edit'); ?>';
							return;
						}
						if ( url.includes('processor_types') ) {
							window.open('https://app.surecart.com/processor_types?switch_account_id=<?php echo $this->account->id; ?>', '_blank');
							return;
						}
						if ( url.includes('abandoned-checkout') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-settings&tab=abandoned_checkout'); ?>';
							return;
						}
						if ( url.includes('create-coupons') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-coupons&action=edit'); ?>';
							return;
						}
						if ( url.includes('create-coupons') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-coupons&action=edit'); ?>';
							return;
						}
						if ( url.includes('order-bumps') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-bumps&action=edit'); ?>';
							return;
						}
						if ( url.includes('upsell-funnels') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-upsell-funnels&action=edit'); ?>';
							return;
						}
						if ( url.includes('subscription-saver') ) {
							location.href = '<?php echo admin_url('admin.php?page=sc-settings&tab=subscription_preservation'); ?>';
							return;
						}
						window.open(url, '_blank');
					});
				});
			}
		</script>
		<?php
	}

	/**
	 * Render Checklist.
	 *
	 * @return void
	 */
	public function render( $args = [] ) {
		// if the account is not connected, don't show the checklist.
		if ( ! $this->account->is_connected ) {
			return;
		}

		// if the checklist is not set, don't show the checklist.
		if ( empty( $this->account->gleap_checklist->gleap_id ) ) {
			return;
		}

		$args = wp_parse_args(
			$args,
			[
				'floating' => false,
				'checklistid' => $this->account->gleap_checklist->gleap_id,
				'sharedKey' => $this->account->gleap_checklist->shared_key,
			]
		);

		// convert to a string of html attributes.
		$attributes = '';
		foreach ( $args as $key => $value ) {
			if ( is_bool( $value ) ) {
				$value = $value ? 'true' : 'false';
			}
			$attributes .= $key . '="' . esc_attr( $value ) . '" ';
		}
		?>
			<style>
				gleap-checklist::part(sender){
					display:none
				}
				gleap-checklist {
					--color-gray-light: var(--sc-color-brand-stroke);
					--color-gray-dark: var(--sc-color-brand-body);
					--color-font-title: var(--sc-color-brand-heading);
					--color-success: var(--sc-color-brand-primary);
					--color-gray-lighter: var(--sc-color-gray-50);
				}
			</style>
			<gleap-checklist <?php echo $attributes;?>></gleap-checklist>
		<?php

		// configure the checklist urls.
		add_action( 'surecart/help_widget/loaded', [ $this, 'configure' ] );
	}

	/**
	 * Get property from the checklist.
	 *
	 * @param string $key Key.
	 * @return mixed
	 */
	public function __get( $key ) {
		return isset( $this->account->gleap_checklist->$key ) ? $this->account->gleap_checklist->$key : null;
	}
}