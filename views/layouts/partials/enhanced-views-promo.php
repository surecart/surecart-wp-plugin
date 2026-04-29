<?php
if ( ! current_user_can( 'manage_options' ) ) {
	return;
}

$is_enhanced  = (bool) get_option( 'surecart_enhanced_admin_views', false );
$target_value = $is_enhanced ? '0' : '1';
$label        = $is_enhanced ? __( 'Use classic view', 'surecart' ) : __( 'Try the new experience', 'surecart' );
?>

<form
	method="post"
	action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"
	class="sc-enhanced-views-promo"
	onsubmit="this.querySelector('.components-button').classList.add('is-busy');"
>
	<?php wp_nonce_field( 'sc_set_enhanced_admin_views' ); ?>
	<input type="hidden" name="action" value="sc_set_enhanced_admin_views" />
	<input type="hidden" name="value" value="<?php echo esc_attr( $target_value ); ?>" />
	<input
		type="hidden"
		name="redirect_to"
		value="<?php echo esc_url( $return_url ?? admin_url() ); ?>"
	/>
	<button type="submit" class="components-button is-secondary">
		<?php echo esc_html( $label ); ?>
	</button>
</form>
