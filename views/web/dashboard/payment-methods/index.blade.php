<ce-payment-methods-list></ce-payment-methods-list>
@php
\CheckoutEngine::assets()->addComponentData('ce-payment-methods-list', '', [
    'query' => $query ?? [],
]);
@endphp
