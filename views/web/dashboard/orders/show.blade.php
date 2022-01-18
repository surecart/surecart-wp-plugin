<ce-card
    style="--spacing: var(--ce-spacing-medium)"
    no-divider
>
    <ce-customer-order
        order-id={{ esc_attr($id) }}
        style="margin-bottom: 2em;"
    >
        <span slot="title">
            <?php echo __('Order Details', 'checkout_engine'); ?>
            <ce-divider></ce-divider>
        </span>
    </ce-customer-order>
    @php
        \CheckoutEngine::assets()->addComponentData('ce-order', '', [
            'query' => $order['query'] ?? [],
        ]);
    @endphp

    <ce-charges-list
        id="{{ esc_attr('charges' . $id) }}"
        style="margin-bottom: 2em;"
    >
        <span slot="title">
            <?php echo __('Payment', 'checkout_engine'); ?>
            <ce-divider></ce-divider>
        </span>
    </ce-charges-list>
    @php
        \CheckoutEngine::assets()->addComponentData('ce-charges-list', '#charges' . $id, [
            'query' => $charges['query'] ?? [],
        ]);
    @endphp

    <ce-subscriptions-list id="{{ esc_attr('list' . $id) }}">
        <span slot="title">
            <?php echo __('Subscriptions', 'checkout_engine'); ?>
            <ce-divider></ce-divider>
        </span>
        <span slot="empty"></span>
    </ce-subscriptions-list>
    @php
        \CheckoutEngine::assets()->addComponentData('ce-subscriptions-list', '#list' . $id, [
            'query' => $subscriptions['query'] ?? [],
        ]);
    @endphp
</ce-card>
