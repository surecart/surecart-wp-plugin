<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Component;
use SureCart\Models\User;

class ChargeController extends BaseController {
	/**
	 * List all charges and paginate.
	 *
	 * @return function
	 */
	public function index() {
		ob_start(); ?>

		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Payment History', 'surecart' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-charges-list' )
					->id( 'ce-customer-charges' )
					->with(
						[
							'heading' => __( 'Payment History', 'surecart' ),
							'query'   => [
								'customer_ids' => array_values( User::current()->customerIds() ),
								'page'         => $this->getPage(),
								'per_page'     => 10,
							],
						]
					)->render()
			);
			?>

		</ce-spacing>

		<?php
		return ob_get_clean();
	}
}
