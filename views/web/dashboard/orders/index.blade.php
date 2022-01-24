<ce-orders-list></ce-orders-list>
@php
\CheckoutEngine::assets()->addComponentData('ce-orders-list', '', [
    'query' => $query ?? [],
]);
@endphp
