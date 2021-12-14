@component('web.dashboard.templates.index', [
    'tab' => $tab,
    ])
    <x-slot name="heading">
        {{ sprintf(__('Order #%s', 'checkout_engine'), $order->number) }}
    </x-slot>

    <x-slot name="end">
        <ce-session-status-badge status="{{ $order->status }}"></ce-session-status-badge>
    </x-slot>

    <ce-card borderless>
        <ce-order-confirmation-line-items></ce-order-confirmation-line-items>
        <script>
            var component = document.querySelector('ce-order-confirmation-line-items');
            component.checkoutSession = <?php echo wp_json_encode($order); ?>;
        </script>
    </ce-card>

    <ce-card borderless>
        <span slot="title"><?php _e('Totals', 'checkout_engine'); ?></span>
        <ce-order-confirmation-totals></ce-order-confirmation-totals>
        <script>
            var component = document.querySelector('ce-order-confirmation-totals');
            component.checkoutSession = <?php echo wp_json_encode($order); ?>;
        </script>
    </ce-card>
@endcomponent
