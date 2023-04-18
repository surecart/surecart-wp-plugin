<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Activation;
use SureCart\Models\Component;
use SureCart\Models\User;

/**
 * The subscription controller.
 */
class LicenseController extends BaseController
{
    /**
     * Preview.
     *
     * @param array $attributes Block attributes.
     */
    public function preview($attributes = [])
    {
        if (!is_user_logged_in()) {
            return;
        }

        return wp_kses_post(
            Component::tag('sc-licenses-list')
                ->id('customer-licenses-preview')
                ->with(
                    [
						'isCustomer' => User::current()->isCustomer(),
						'heading'=> $attributes['title'],
                        'query' => [
                            'customer_ids' => array_values(User::current()->customerIds()),
							'page'         => 1,
							'per_page'     => 5,
                        ],
						'allLink' => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'license',
							'action' => 'index',
						]
					),
                    ]
                )
				->render()
        );
    }

    /**
     * Index.
     */
    public function index()
    {
        if (!is_user_logged_in()) {
            return;
        }

        ob_start();
		?>

		<sc-spacing style="--spacing: var(--sc-spacing-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], remove_query_arg( array_keys( $_GET ) ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Licenses', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

		<?php
		echo wp_kses_post(
			Component::tag( 'sc-licenses-list' )
			->id( 'customer-licenses-index' )
			->with(
				[
					'heading' => __( 'Licenses', 'surecart' ),
					'isCustomer' => User::current()->isCustomer(),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'page'         => 1,
						'per_page'     => 10,
					],
				]
			)->render()
		);
		?>
		</sc-spacing>

		<?php
		return ob_get_clean();
    }

    public function show()
    {
        if (!is_user_logged_in()) {
            return;
        }

        $customer = $this->getParam('customer');

        if (!User::current()->hasCustomerId($customer)) {
            return;
        }

        $license = $this->getParam('license');
        $rows_html = '';

        $activations = Activation::where([
            'license_ids' => [$license],
        ])->paginate([
            'page' => 1,
            'per_page' => 20,
        ]);

        if (!is_array($activations->data) || !empty($activations->data)) {
            return;
        }

        foreach ($activations->data as $activation) {

            $rows_html .= '<sc-stacked-list-row style="--columns: 3;">';
            $rows_html .= '<span>' . $activation->name . '</span>';
            $rows_html .= '<span>' . $activation->fingerprint . '</span>';
            $rows_html .= '<a href="' . esc_url(
                add_query_arg(
                    [
                        'id' => $activation->id,
                        'model' => 'license',
                        'action' => 'delete',
                        'license' => $license,
                        'customer' => $customer,
                        'nonce' => wp_create_nonce('customer-delete-activation'),
                    ],
                    remove_query_arg(array_keys($_GET)) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
                )
            ) . '"><span>' . __('Delete', 'surecart') . '</span></a>';
            $rows_html .= '</sc-stacked-list-row>';
        }

        ob_start()
        ?>
		<sc-heading><?php echo sprintf(__('Activations : %s', 'surecart'), $license); ?></sc-heading>
		<sc-card no-padding>
			<sc-stacked-list>
				<?php echo $rows_html; ?>
			</sc-stacked-list>
		</sc-card>
		<?php

        return ob_get_clean();
    }

    public function delete()
    {
        if (!is_user_logged_in()) {
            return;
        }

        $customer = $this->getParam('customer');
        $license = $this->getParam('license');

        if (!User::current()->hasCustomerId($customer)) {
            return;
        }

        $back_url = esc_url(
            add_query_arg(
                [
                    'license' => $license,
                    'model' => 'license',
                    'action' => 'show',
                    'customer' => $customer,
                    'nonce' => wp_create_nonce('customer-license'),
                ],
                remove_query_arg(array_keys($_GET)) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            )
        );

        return '<a href=' . $back_url . '>' . __('Back to Activations', 'surecart') . '</a>';
    }
}
