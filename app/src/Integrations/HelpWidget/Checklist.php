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
						if ( url.includes('set-up-your-payment-methods') ) {
							location.href = 'https://app.surecart.com/processor_types?switch_account_id=<?php echo $this->account->id; ?>';
							return;
						}
						location.href = url;
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
		if ( empty( $this->account->onboarding_checklist->id ) ) {
			return;
		}

		$args = wp_parse_args(
			$args,
			[
				'floating' => false,
				'checklistid' => $this->account->onboarding_checklist->id,
				'sharedKey' => $this->account->onboarding_checklist->sharedKey,
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
		return $this->account->onboarding_checklist->$key;
	}
}