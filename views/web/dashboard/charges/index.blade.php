<ce-charges-list></ce-charges-list>
@php
\CheckoutEngine::assets()->addComponentData('ce-charges-list', '', [
    'query' => $query ?? [],
]);
@endphp
