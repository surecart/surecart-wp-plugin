<?php
if ( ! current_user_can( 'manage_options' ) ) {
	return;
}

$is_enhanced = (bool) get_option( 'surecart_enhanced_admin_views', true );
// The hidden `value` is pre-computed to the opposite of the current state so
// the submit button itself stays purely visual — toggling submits the form
// and the controller flips the option.
$target_value = $is_enhanced ? '0' : '1';
$toggle_id    = 'sc-enhanced-views-toggle';
$modal_id     = 'sc-modern-view-intro-modal';
$image_url    = trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/dataview/modern-view-change.svg';
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
	>
		<sc-button
			id="<?php echo esc_attr( $toggle_id ); ?>"
			class="sc-enhanced-views-promo__toggle"
			type="text"
			size="small"
			circle
			<?php echo $is_enhanced ? 'submit' : ''; ?>
			aria-label="<?php echo esc_attr( $aria_label ); ?>"
			<?php if ( ! $is_enhanced ) : ?>
				aria-haspopup="dialog"
				aria-controls="<?php echo esc_attr( $modal_id ); ?>"
			<?php endif; ?>
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
				<path d="M20 14H16C14.8954 14 14 14.8954 14 16V20C14 21.1046 14.8954 22 16 22H20C21.1046 22 22 21.1046 22 20V16C22 14.8954 21.1046 14 20 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M8 2H4C2.89543 2 2 2.89543 2 4V8C2 9.10457 2.89543 10 4 10H8C9.10457 10 10 9.10457 10 8V4C10 2.89543 9.10457 2 8 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M7 14V15C7 15.5304 7.21071 16.0391 7.58579 16.4142C7.96086 16.7893 8.46957 17 9 17H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M14 7H15C15.5304 7 16.0391 7.21071 16.4142 7.58579C16.7893 7.96086 17 8.46957 17 9V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</sc-button>
	</sc-tooltip>

	<?php if ( ! $is_enhanced ) : ?>
		<div
			id="<?php echo esc_attr( $modal_id ); ?>"
			class="sc-modern-view-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="<?php echo esc_attr( $modal_id ); ?>-title"
			aria-describedby="<?php echo esc_attr( $modal_id ); ?>-desc"
			hidden
		>
			<div class="sc-modern-view-modal__dialog" role="document">
				<button
					type="button"
					class="sc-modern-view-modal__close"
					aria-label="<?php esc_attr_e( 'Close', 'surecart' ); ?>"
					data-sc-modern-view-close
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
						<path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
					</svg>
				</button>

				<div class="sc-modern-view-modal__image">
					<img
						src="<?php echo esc_url( $image_url ); ?>"
						alt="<?php esc_attr_e( 'Preview of the modern data view', 'surecart' ); ?>"
					/>
				</div>

				<div class="sc-modern-view-modal__body">
					<h2 id="<?php echo esc_attr( $modal_id ); ?>-title" class="sc-modern-view-modal__title">
						<?php esc_html_e( 'Introducing Modern View', 'surecart' ); ?>
					</h2>
					<p id="<?php echo esc_attr( $modal_id ); ?>-desc" class="sc-modern-view-modal__description">
						<?php esc_html_e( "We've redesigned the data table experience. Your data stays exactly the same, just the presentation changes.", 'surecart' ); ?>
					</p>
					<div class="sc-modern-view-modal__actions">
						<button type="submit" class="button button-primary sc-modern-view-modal__confirm">
							<?php esc_html_e( 'Try now', 'surecart' ); ?>
						</button>
						<button type="button" class="sc-modern-view-modal__later" data-sc-modern-view-close>
							<?php esc_html_e( 'Maybe later', 'surecart' ); ?>
						</button>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>
</form>

<style>
	.sc-enhanced-views-promo {
		margin: 0;
	}
	.sc-enhanced-views-promo.is-busy {
		opacity: 0.6;
		pointer-events: none;
	}

	.sc-enhanced-views-promo__tooltip {
		display: inline-flex;
		/* Pin the tooltip to black/white explicitly — admin pages don't
		   always inherit the SureCart theme tokens, so relying on the
		   default `--sc-color-gray-900` can leak through as a light grey. */
		--sc-tooltip-background-color: #111827;
		--sc-tooltip-color: #ffffff;
	}
	/* Force the SureCart icon to inherit colour from the host so the
	   enhanced-mode tint and hover/focus rings work consistently. */
	.sc-enhanced-views-promo__toggle {
		color: #1e1e1e;
	}
	.sc-enhanced-views-promo.is-enhanced .sc-enhanced-views-promo__toggle {
		color: #3858e9;
	}

	.sc-modern-view-modal {
		position: fixed;
		inset: 0;
		z-index: 100100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: rgba(0, 0, 0, 0.5);
		box-sizing: border-box;
	}
	.sc-modern-view-modal[hidden] {
		display: none;
	}
	.sc-modern-view-modal__dialog {
		position: relative;
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: 560px;
		max-height: calc(100vh - 40px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		text-align: left;
	}
	/* Close sits in the top-right corner of the dialog (overlay on the image
		if needed) so it doesn't introduce a tall header row above the body. */
	.sc-modern-view-modal__close {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: #1e1e1e;
		cursor: pointer;
	}
	.sc-modern-view-modal__close:hover {
		background: rgba(0, 0, 0, 0.06);
	}
	/* The preview is intentionally cropped on the right and faded at the
	   bottom — Figma treats it as a peek into the new view, not a framed
	   thumbnail. Hence: no right padding (image overflows past the modal
	   edge), and a gradient overlay that bleeds from transparent into the
	   background to soften the bottom edge. */
	.sc-modern-view-modal__image {
		position: relative;
		background: #f3f4f6;
		padding: 56px 0 0 32px;
		overflow: hidden;
	}
	.sc-modern-view-modal__image img {
		display: block;
		width: calc(100% + 60px);
		max-width: none;
		height: auto;
		border-top-left-radius: 8px;
		box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04);
	}
	.sc-modern-view-modal__image::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 96px;
		background: linear-gradient(
			to bottom,
			rgba(243, 244, 246, 0) 0%,
			rgba(243, 244, 246, 0.85) 60%,
			#f3f4f6 100%
		);
		pointer-events: none;
	}
	.sc-modern-view-modal__body {
		padding: 24px 32px 28px;
	}
	.sc-modern-view-modal__title {
		font-size: 20px;
		font-weight: 600;
		line-height: 1.3;
		margin: 0 0 8px;
		color: #111827;
	}
	.sc-modern-view-modal__description {
		font-size: 14px;
		color: #4b5563;
		line-height: 1.5;
		margin: 0 0 20px;
	}
	.sc-modern-view-modal__actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.sc-modern-view-modal__confirm.button.button-primary {
		min-width: 100px;
	}
	.sc-modern-view-modal__later {
		background: transparent;
		border: none;
		color: #3858e9;
		text-decoration: underline;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		padding: 6px 8px;
	}
	.sc-modern-view-modal__later:hover {
		color: #1d3fc7;
	}
</style>

<?php if ( ! $is_enhanced ) : ?>
<script>
	( function () {
		var toggle = document.getElementById( '<?php echo esc_js( $toggle_id ); ?>' );
		var modal  = document.getElementById( '<?php echo esc_js( $modal_id ); ?>' );
		if ( ! toggle || ! modal ) {
			return;
		}
		var form        = toggle.closest( 'form' );
		var lastFocused = null;

		function openModal() {
			lastFocused  = document.activeElement;
			modal.hidden = false;
			document.body.style.overflow = 'hidden';
			var firstBtn = modal.querySelector( '.sc-modern-view-modal__confirm' );
			if ( firstBtn ) {
				firstBtn.focus();
			}
			document.addEventListener( 'keydown', onKeydown );
		}

		function closeModal() {
			modal.hidden = true;
			document.body.style.overflow = '';
			document.removeEventListener( 'keydown', onKeydown );
			if ( lastFocused && typeof lastFocused.focus === 'function' ) {
				lastFocused.focus();
			}
		}

		function onKeydown( e ) {
			if ( e.key === 'Escape' ) {
				closeModal();
			}
		}

		toggle.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			openModal();
		} );

		modal.addEventListener( 'click', function ( e ) {
			// Backdrop click (the overlay itself) or any element flagged as a
			// close trigger ([data-sc-modern-view-close]) closes the modal.
			if ( e.target === modal || e.target.closest( '[data-sc-modern-view-close]' ) ) {
				closeModal();
			}
		} );

		if ( form ) {
			form.addEventListener( 'submit', function () {
				form.classList.add( 'is-busy' );
			} );
		}
	} )();
</script>
<?php endif; ?>
