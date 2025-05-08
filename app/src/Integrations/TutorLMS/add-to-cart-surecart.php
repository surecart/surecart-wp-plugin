<?php
use SureCart\Support\Currency;

foreach ( $prices as $price ) : ?>
	<a class="tutor-btn tutor-btn-primary tutor-btn-lg tutor-btn-block tutor-mt-24 tutor-add-to-cart-button"
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
		<span>
			<?php esc_html_e( 'Purchase', 'surecart' ); ?>&nbsp;
			<?php if ( $price->scratch_amount > 0 ) : ?>
				<del><?php echo esc_html( Currency::format( $price->scratch_amount ?? 0, $price->currency ) ); ?></del>&nbsp;
			<?php endif; ?>
			<?php echo esc_html( Currency::format( $price->amount ?? 0, $price->currency ) ); ?>
			&nbsp;
			<sc-format-interval value="<?php echo (int) $price->recurring_interval_count; ?>" interval="<?php echo esc_attr( $price->recurring_interval ); ?>"></sc-format-interval>
		</span>
	</a>
<?php endforeach; ?>
