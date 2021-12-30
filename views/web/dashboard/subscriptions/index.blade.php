<ce-router autoScroll>
    <ce-customer-subscriptions>
        <ce-route default>
            @php do_action('checkout_engine/templates/after_subscription_edit') @endphp

            <ce-customer-subscriptions-list></ce-customer-subscriptions-list>

            @php do_action('checkout_engine/templates/after_subscription_edit') @endphp
        </ce-route>

        <ce-route query-var='subscription.edit'>
            @php do_action('checkout_engine/templates/before_subscription_edit') @endphp

            <ce-customer-subscription-edit></ce-customer-subscription-edit>

            @php do_action('checkout_engine/templates/after_subscription_edit') @endphp
        </ce-route>
    </ce-customer-subscriptions>
</ce-router>


@php
// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
\CheckoutEngine::assets()->addComponentData(
    'ce-customer-subscriptions',
    '',
    apply_filters('checkout_engine/templates/data/ce-customer-subscriptions', [
        'upgradeGroups' => [['912fb087-9e86-4db0-9ea6-dd8ed4f47126', 'b4b7fe58-ac35-4675-89f9-a6df757b3ddb']],
        'customerId' => $customer_id ?? '',
        'cancelBehavior' => $cancel_behavior ?? '',
    ]),
);
@endphp
