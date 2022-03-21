<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\Customer;
use CheckoutEngine\Models\User;

/**
 * Payment method block controller class.
 */
class UserController extends BaseController {
	/**
	 * List all payment methods.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Block content.
	 *
	 * @return function
	 */
	public function show( $attributes, $content ) {
		$user = wp_get_current_user();
		if ( ! $user ) {
			return '';
		}
		$data = get_userdata( $user->ID );

		return wp_kses_post(
			Component::tag( 'ce-wordpress-user' )
			->id( 'wordpress-user-edit' )
			->with(
				[
					'heading' => __( 'Account Details', 'checkout-engine' ),
					'user'    => [
						'display_name' => $user->display_name,
						'email'        => $user->user_email,
						'first_name'   => $data->user_firstname,
						'last_name'    => $data->user_lastname,
					],
				]
			)->render()
		);
	}

	/**
	 * Show a view to add a payment method.
	 *
	 * @return function
	 */
	public function edit() {
		$user = wp_get_current_user();
		if ( ! $user ) {
			return '';
		}
		$data = get_userdata( $user->ID );
		$back = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );
		ob_start(); ?>

		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Account Details', 'surecart' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
				echo wp_kses_post(
					Component::tag( 'ce-wordpress-user-edit' )
					->id( 'wordpress-user-edit' )
					->with(
						[
							'heading'    => $attributes['title'] ?? __( 'Update Account Details', 'checkout-engine' ),
							'user'       => [
								'id'           => $user->ID,
								'display_name' => $user->display_name,
								'email'        => $user->user_email,
								'first_name'   => $data->user_firstname,
								'last_name'    => $data->user_lastname,
							],
							'successUrl' => esc_url( $back ),
						]
					)->render()
				);

			?>

		<?php
				echo wp_kses_post(
					Component::tag( 'ce-wordpress-password-edit' )
					->id( 'wordpress-password-edit' )
					->with(
						[
							'heading'    => $attributes['title'] ?? __( 'Update Password', 'checkout-engine' ),
							'user'       => [
								'id'           => $user->ID,
								'display_name' => $user->display_name,
								'email'        => $user->user_email,
								'first_name'   => $data->user_firstname,
								'last_name'    => $data->user_lastname,
							],
							'successUrl' => esc_url( $back ),
						]
					)->render()
				);

		?>
		</ce-spacing>

			<?php
			return ob_get_clean();
	}
}
