<?php
if ( ! current_user_can( 'manage_options' ) ) {
	return;
}

$is_enhanced  = (bool) get_option( 'surecart_enhanced_admin_views', true );
$target_value = $is_enhanced ? '0' : '1';
$toggle_id    = 'sc-enhanced-views-toggle';
$aria_label   = $is_enhanced
	? __( 'Switch to classic view', 'surecart' )
	: __( 'Switch to modern view', 'surecart' );
?>

<form
	method="post"
	action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>"
	class="sc-enhanced-views-promo<?php echo $is_enhanced ? ' is-enhanced' : ''; ?>"
>
	<?php wp_nonce_field( 'sc_set_enhanced_admin_views' ); ?>
	<input type="hidden" name="action" value="sc_set_enhanced_admin_views" />
	<input type="hidden" name="value" value="<?php echo esc_attr( $target_value ); ?>" />
	<input
		type="hidden"
		name="redirect_to"
		value="<?php echo esc_url( $return_url ?? admin_url() ); ?>"
	/>

	<sc-tooltip
		class="sc-enhanced-views-promo__tooltip"
		text="<?php echo esc_attr( $aria_label ); ?>"
		placement="bottom"
		type="dark"
	>
		<button
			id="<?php echo esc_attr( $toggle_id ); ?>"
			class="sc-enhanced-views-promo__toggle"
			type="submit"
			aria-label="<?php echo esc_attr( $aria_label ); ?>"
			aria-pressed="<?php echo $is_enhanced ? 'true' : 'false'; ?>"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
				<path d="M15.5 9.2L14.8 8.5L16.8 6.5H14V5.5H16.8L14.8 3.5L15.5 2.8L17.5 4.8V2H18.5V4.8L20.5 2.8L21.2 3.5L19.2 5.5H22V6.5H19.2L21.2 8.5L20.5 9.2L18.5 7.2V10H17.5V7.2L15.5 9.2Z" fill="currentColor" />
				<path d="M13 3V4.5H5C4.7 4.5 4.5 4.7 4.5 5V8.5H13V13.5H19.5V11H21V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H13ZM4.5 15V19C4.5 19.3 4.7 19.5 5 19.5H11.5V15H4.5ZM13 15V19.5H19C19.3 19.5 19.5 19.3 19.5 19V15H13ZM4.5 10V13.5H11.5V10H4.5Z" fill="currentColor" />
			</svg>
		</button>
	</sc-tooltip>
</form>

<style>
	.sc-enhanced-views-promo { margin: 0; }
	.sc-enhanced-views-promo.is-busy { opacity: 0.6; pointer-events: none; }
	.sc-enhanced-views-promo__tooltip {
		display: inline-flex;
	}
	/* Default icon color stays neutral (#111827) regardless of which view
	   mode is active — the toggle is a switch, not a status indicator.
	   Only hover / focus / active interactions promote it to the primary
	   blue so users can tell it's interactive. */
	.sc-enhanced-views-promo__toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: #111827;
		cursor: pointer;
		transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
	}
	.sc-enhanced-views-promo__toggle:hover,
	.sc-enhanced-views-promo__toggle:focus-visible,
	.sc-enhanced-views-promo__toggle:active {
		color: #3858e9;
		background: rgba(56, 88, 233, 0.08);
		outline: none;
	}
	.sc-enhanced-views-promo__toggle:focus-visible {
		box-shadow: 0 0 0 2px rgba(56, 88, 233, 0.4);
	}
	/* Attention pulse — added by React when the modal closes so the user's
		eye is drawn to the toggle. The class is removed on animationend. */
	@keyframes sc-toggle-attract {
		0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(56, 88, 233, 0.45); }
		40%  { transform: scale(1.18); box-shadow: 0 0 0 8px rgba(56, 88, 233, 0.18); }
		100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(56, 88, 233, 0); }
	}
	.sc-enhanced-views-promo__toggle.is-attract {
		animation: sc-toggle-attract 0.7s ease-out;
	}
</style>
