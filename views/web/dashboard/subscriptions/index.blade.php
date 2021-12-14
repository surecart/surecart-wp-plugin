@component('web.dashboard.templates.index', [
    'tab' => $tab,
    'heading' => __('Subscriptions', 'checkout_engine'),
    ])
    <div>
        <ce-table>
            <ce-table-cell slot="head">{{ esc_html__('Started', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head">{{ esc_html__('Items', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head">{{ esc_html__('Total', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head" style="width:100px">{{ esc_html__('Status', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head" style="width:100px"></ce-table-cell>

            @foreach ($subscriptions as $key => $subscription)
                <ce-table-row>
                    <ce-table-cell>
                        {{ wp_date(get_option('date_format'), $subscription->created_at) }}
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-text truncate style="--color: var(--ce-color-gray-500);">
                            {{ sprintf(_n('%s item', '%s items', $subscription->subscription_items->pagination->count ?? 0, 'checkout_engine'), number_format_i18n($subscription->subscription_items->pagination->count ?? 0)) }}
                        </ce-text>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-format-number type="currency" currency={{ $subscription->currency }}
                            value={{ $subscription->total_amount }}>
                        </ce-format-number>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-subscription-status-badge status="{{ $subscription->status }}"></ce-subscription-status-badge>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-button href="<?php echo esc_url(add_query_arg(['id' => $order->id])); ?>" size="small">{{ esc_html__('View', 'checkout_engine') }}
                        </ce-button>
                    </ce-table-cell>
                </ce-table-row>
            @endforeach
    </div>
@endcomponent
