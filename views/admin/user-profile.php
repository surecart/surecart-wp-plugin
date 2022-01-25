<h2><?php esc_html_e( 'Checkout Engine', 'checkout_engine' ); ?></h2>

<table class="form-table">
	<tr>
		<th><?php esc_html_e( 'Customer', 'presto-player-pro' ); ?></th>
		<td>
			<?php if ( $customer ) : ?>
				<a href="<?php echo esc_url( $edit_link ); ?>">
					<?php echo wp_kses_post( $customer->name ?? $customer->email ); ?>
				</a>
			<?php else : ?>
				<?php esc_html_e( 'This user is not a customer.', 'checkout_engine' ); ?>
			<?php endif; ?>
		</td>
	</tr>
</table>
