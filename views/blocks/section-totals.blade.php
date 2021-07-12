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

        <ce-total class="ce-subtotal"
            total="subtotal">
            <span slot="description">
                {{ __('Subtotal', 'checkout_engine') }}
            </span>
        </ce-total>

        <ce-coupon-form label="{{ __('Add Coupon Code') }}">
            {{ __('Apply Coupon', 'checkout_engine') }}
        </ce-coupon-form>

        <ce-divider></ce-divider>

        <ce-total class="ce-total"
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
        </ce-total>

        <?php do_action('checkout_engine/checkout/totals/after'); ?>

    </ce-order-summary>
@endcomponent
