<?php
$is_logged_in             = is_user_logged_in();
$enable_guest_course_cart = tutor_utils()->get_option( 'enable_guest_course_cart' );
$required_loggedin_class  = '';
if ( ! $is_logged_in && ! $enable_guest_course_cart ) {
	$required_loggedin_class = apply_filters( 'tutor_enroll_required_login_class', 'tutor-open-login-modal' );
}
?>


<?php foreach ( $products as $product ) : ?>
	<?php
	// need prices.
	if ( empty( $product->prices->data ) ) {
		continue;
	}
	?>
	<?php foreach ( $product->prices->data as $price ) : ?>
		<a class="tutor-btn tutor-btn-primary tutor-btn-lg tutor-btn-block tutor-mt-24 tutor-add-to-cart-button <?php echo sanitize_html_class( $required_loggedin_class ); ?>"
			href="
			<?php
			echo esc_url(
				add_query_arg(
					[
						'line_items' => [
							[
								'price_id' => $price->id,
								'quantity' => 1,
							],
						],
					],
					\SureCart::pages()->url( 'checkout' )
				)
			);
			?>
		">
		<sc-format-number type="currency" currency="<?php echo esc_attr( $price->currency ); ?>" value="<?php echo (int) $price->amount; ?>">
			<?php esc_html_e( 'Purchase', 'surecart' ); ?>
		</sc-format-number>
		&nbsp;
		<sc-format-interval value="<?php echo (int) $price->recurring_interval_count; ?>" interval="<?php echo esc_attr( $price->recurring_interval ); ?>"></sc-format-interval>
	</a>
	<?php endforeach; ?>
<?php endforeach; ?>
