@component('web.dashboard.templates.index')
    <x-slot name="heading">
        {{ sprintf(__('Order #%s', 'checkout_engine'), $order->number) }}
    </x-slot>

    <x-slot name="end">
        <ce-session-status-badge status="{{ $order->status }}"></ce-session-status-badge>
        @php
            // This dynamically adds prop data to a component since we cannot pass objects data as a prop.
            \CheckoutEngine::assets()->addComponentData('ce-order-confirmation-line-items', '', [
                'checkoutSession' => $order,
            ]);
        @endphp
    </x-slot>

    <ce-card borderless>
        <ce-order-confirmation-line-items></ce-order-confirmation-line-items>
    </ce-card>

    <ce-card borderless>
        <span slot="title"><?php _e('Totals', 'checkout_engine'); ?></span>
        <ce-order-confirmation-totals></ce-order-confirmation-totals>
        @php
            // This dynamically adds prop data to a component since we cannot pass objects data as a prop.
            \CheckoutEngine::assets()->addComponentData('ce-order-confirmation-totals', '', [
                'checkoutSession' => $order,
            ]);
        @endphp
    </ce-card>
@endcomponent
