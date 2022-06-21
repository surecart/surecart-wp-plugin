<?php

namespace SureCart\WordPress\Admin\Notices;

/**
 * Admin notices service
 */
class AdminNoticesService {
	/**
	 * Notice key.
	 *
	 * @var string
	 */
	protected $notice_key = 'surecart_dismissed_notice';

	/**
	 * Showing the response notice?
	 *
	 * @var boolean
	 */
	protected $showing_response_notice = false;

	/**
	 * Bootstrap notice dismissal.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'dismiss' ] );
	}

	/**
	 * Is the notice dismissed.
	 *
	 * @param string $name Notice name.
	 *
	 * @return boolean
	 */
	public function isDismissed( $name ) {
		return (bool) get_option( $this->notice_key . '_' . sanitize_text_field( $name ), false );
	}

	/**
	 * Dismiss the notice.
	 *
	 * @return void
	 */
	public function dismiss() {
		// permissions check.
		if ( ! current_user_can( 'install_plugins' ) ) {
			return;
		}

		// not our notices, bail.
		if ( ! isset( $_GET['surecart_action'] ) || 'dismiss_notices' !== $_GET['surecart_action'] ) {
			return;
		}

		// get notice.
		$notice = ! empty( $_GET['surecart_notice'] ) ? sanitize_text_field( $_GET['surecart_notice'] ) : '';
		if ( ! $notice ) {
			return;
		}

		// verify nonce.
		if ( ! wp_verify_nonce( $_GET['surecart_nonce'], 'surecart_notice_nonce' ) ) {
			wp_die( esc_html__( 'Your session expired - please try again.', 'surecart' ) );
			exit;
		}

		// notice is dismissed.
		update_option( $this->notice_key . '_' . sanitize_text_field( $notice ), 1 );
	}

	/**
	 * Show the response notice.
	 *
	 * @param array $notice Notice data to show.
	 *
	 * @return void
	 */
	public function showResponseNotice( $notice = [] ) {
		// already showing it.
		if ( $this->showing_response_notice ) {
			return;
		}

		// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode
		$notice_data = json_decode( base64_decode( implode( '', (array) $notice ) ) );
		if ( empty( $notice_data->message ) ) {
			return;
		}

		$this->showing_response_notice = true;

		add_action(
			'admin_notices',
			function() use ( $notice_data ) {
				echo wp_kses_post(
					$this->render(
						[
							'name'  => 'update_notice_' . \SureCart::plugin()->version(),
							'type'  => sanitize_text_field( $notice_data->type ),
							'title' => esc_html__( 'SureCart', 'surecart' ),
							'text'  => esc_html( $notice_data->message ),
						]
					)
				);
			}
		);
	}

	/**
	 * Render the notice
	 *
	 * @return string
	 */
	public function render( $args = [] ) {
		$args = wp_parse_args(
			$args,
			[
				'title' => '',
				'type'  => 'info',
				'text'  => '',
				'name'  => '',
			]
		);

		if ( $this->isDismissed( $args['name'] ) ) {
			return '';
		}

		ob_start(); ?>

		<div class="notice notice-<?php echo sanitize_html_class( $args['type'] ); ?>">
			<p>
				<strong>
					<?php echo esc_html( $args['title'] ); ?>
				</strong>
			</p>

			<?php echo wp_kses_post( $args['text'] ); ?>

			<?php if ( ! empty( $args['name'] ) ) : ?>
				<p>
					<a href="
						<?php
						echo esc_url(
							add_query_arg(
								[
									'surecart_action' => 'dismiss_notices',
									'surecart_notice' => sanitize_text_field( $args['name'] ),
									'surecart_nonce'  => wp_create_nonce( 'surecart_notice_nonce' ),
								]
							)
						);
						?>
					">
						<?php esc_html_e( 'Dismiss Notice', 'surecart' ); ?>
					</a>
				</p>
			<?php endif; ?>
		</div>

		<?php
		return ob_get_clean();
	}
}
