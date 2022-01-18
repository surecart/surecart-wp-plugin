<ce-subscriptions-list>
    <span slot="empty"></span>
</ce-subscriptions-list>
@php
\CheckoutEngine::assets()->addComponentData('ce-subscriptions-list', '', [
    'query' => $query ?? [],
]);
@endphp
