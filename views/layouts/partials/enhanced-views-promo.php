<?php
if ( ! current_user_can( 'manage_options' ) ) {
	return;
}

$is_enhanced  = (bool) get_option( 'surecart_enhanced_admin_views', false );
// The hidden `value` is pre-computed to the opposite of the current state so
// the checkbox itself stays purely visual — no need to read its submitted
// value. Toggling the form submits and the controller flips the option.
$target_value = $is_enhanced ? '0' : '1';
$toggle_id    = 'sc-enhanced-views-toggle';
?>

<form
	method="post"
	action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"
	class="sc-enhanced-views-promo"
>
	<?php wp_nonce_field( 'sc_set_enhanced_admin_views' ); ?>
	<input type="hidden" name="action" value="sc_set_enhanced_admin_views" />
	<input type="hidden" name="value" value="<?php echo esc_attr( $target_value ); ?>" />
	<input
		type="hidden"
		name="redirect_to"
		value="<?php echo esc_url( $return_url ?? admin_url() ); ?>"
	/>

	<label class="sc-enhanced-views-promo__control" for="<?php echo esc_attr( $toggle_id ); ?>">
		<span class="components-form-toggle<?php echo $is_enhanced ? ' is-checked' : ''; ?>">
			<input
				id="<?php echo esc_attr( $toggle_id ); ?>"
				type="checkbox"
				class="components-form-toggle__input"
				<?php checked( $is_enhanced ); ?>
				aria-label="<?php esc_attr_e( 'New experience', 'surecart' ); ?>"
				onchange="this.disabled = true; this.closest('form').classList.add('is-busy'); this.closest('form').submit();"
			/>
			<span class="components-form-toggle__track"></span>
			<span class="components-form-toggle__thumb"></span>
		</span>
		<span class="sc-enhanced-views-promo__label"><?php esc_html_e( 'New experience', 'surecart' ); ?></span>
	</label>
</form>

<style>
	.sc-enhanced-views-promo {
		margin: 0;
	}
	.sc-enhanced-views-promo__control {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		user-select: none;
	}
	.sc-enhanced-views-promo__label {
		font-size: 13px;
		color: #1e1e1e;
	}
	.sc-enhanced-views-promo.is-busy {
		opacity: 0.6;
		pointer-events: none;
	}
</style>
