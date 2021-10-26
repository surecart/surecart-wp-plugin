@component('components.form-section', [
    'label' => $label ?? '',
    'description' => $description ?? '',
    ])
    <ce-order-summary>
        <ce-divider></ce-divider>

        <?php do_action('checkout-engine/checkout/line-items/before'); ?>

        <ce-line-items></ce-line-items>

        <?php do_action('checkout-engine/checkout/line-items/after'); ?>

        <ce-divider></ce-divider>

        <?php do_action('checkout-engine/checkout/totals/before'); ?>

        <ce-line-item-total class="ce-subtotal"
            total="subtotal">
            <span slot="description">
                {{ __('Subtotal', 'checkout_engine') }}
            </span>
        </ce-line-item-total>

        <ce-coupon-form label="{{ __('Add Coupon Code') }}">
            {{ __('Apply Coupon', 'checkout_engine') }}
        </ce-coupon-form>

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
                {{ __('Total Due Today', 'checkout_engine') }}
            </span>
        </ce-line-item-total>

        <?php do_action('checkout_engine/checkout/totals/after'); ?>

    </ce-order-summary>
@endcomponent
