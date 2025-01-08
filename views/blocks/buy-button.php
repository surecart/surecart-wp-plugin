<div class="wp-block-button">
	<a
		class="<?php echo esc_attr( $class ); ?>"
		href="<?php echo esc_url( $href ); ?>"
		style="<?php echo esc_attr( $style ); ?>"
	>
		<?php if ( ! empty( $amount ) && 'before' === $amount_placement ) : ?>
			<span class="sc-button__link-text">
				<?php echo esc_html( $amount ); ?>
			</span>
		<?php endif; ?>

		<span class="sc-button__link-text">
			<?php echo wp_kses_post( $label ); ?>
		</span>

		<?php if ( ! empty( $amount ) && 'after' === $amount_placement ) : ?>
			<span class="sc-button__link-text">
				<?php echo esc_html( $amount ); ?>
			</span>
		<?php endif; ?>
	</a>
</div>