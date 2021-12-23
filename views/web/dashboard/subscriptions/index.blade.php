<ce-customer-subscriptions>
    <ce-customer-subscriptions-list></ce-customer-subscriptions-list>
    <ce-customer-subscription-edit></ce-customer-subscription-edit>
</ce-customer-subscriptions>

@php
// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
\CheckoutEngine::assets()->addComponentData('ce-customer-subscriptions', '', [
    'upgradeGroups' => [['912fb087-9e86-4db0-9ea6-dd8ed4f47126', 'b4b7fe58-ac35-4675-89f9-a6df757b3ddb']],
    'customerId' => $customer_id ?? '',
    'cancelBehavior' => $cancel_behavior ?? '',
]);
@endphp
