<?php
wp_head(); ?>

<div style="height: 100%; display: grid;">
	<ce-card style="max-width: 600px; margin: auto; width:100%;">
		<ce-form-section label="Totals">
		<ce-purchase>
			<ce-order-summary>

					<ce-line-items edit="false"></ce-line-items>

					<ce-divider></ce-divider>

					<ce-line-item-total class="ce-subtotal"
						total="subtotal">
						<span slot="description">
							{{ __('Subtotal', 'checkout_engine') }}
						</span>
					</ce-line-item-total>

					<ce-divider></ce-divider>

					<ce-line-item-total class="ce-line-item-total"
					total="total"
					size="large"
					show-currency>
						{{-- Shown by default --}}
						<span slot="title">
							{{ __('Total', 'checkout_engine') }}
						</span>
						{{-- Shown when a subscription is selected --}}
						<span slot="subscription-title">
							{{ __('Total', 'checkout_engine') }}
						</span>
					</ce-line-item-total>

			</ce-order-summary>
		</ce-purchase>
	</ce-form-section>
	</ce-card>
</div>
<?php wp_footer(); ?>
