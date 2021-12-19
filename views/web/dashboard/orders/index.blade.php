@component('web.dashboard.templates.index')
    <x-slot name="heading">
        {{ __('Orders', 'checkout_engine') }}
    </x-slot>
    <x-slot name="end">
        {{ sprintf(__('%s total', 'checkout_engine'), $orders->pagination->count) }}
    </x-slot>

    <div>
        <ce-table>
            <ce-table-cell slot="head">{{ esc_html__('Number', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head">{{ esc_html__('Items', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head">{{ esc_html__('Total', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head" style="width:100px">{{ esc_html__('Status', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head" style="width:100px"></ce-table-cell>

            @forelse ($orders as $key => $order)
                <ce-table-row>
                    <ce-table-cell>
                        <ce-text truncate style="--font-weight: var(--ce-font-weight-semibold);">{{ $order->number }}
                        </ce-text>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-text truncate style="--color: var(--ce-color-gray-500);">
                            {{ sprintf(_n('%s item', '%s items', $order->line_items->pagination->count ?? 0, 'checkout_engine'), number_format_i18n($order->line_items->pagination->count ?? 0)) }}
                        </ce-text>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-format-number type="currency" currency={{ $order->currency }}
                            value={{ $order->total_amount }}>
                        </ce-format-number>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-session-status-badge status="{{ $order->status }}"></ce-session-status-badge>
                    </ce-table-cell>
                    <ce-table-cell>
                        <ce-button href="<?php echo esc_url(add_query_arg(['id' => $order->id])); ?>" size="small">{{ __('View', 'checkout_engine') }}
                        </ce-button>
                    </ce-table-cell>
                </ce-table-row>

            @empty
                <ce-table-row>
                    <ce-text style="padding: 1em;">{{ esc_html__('No orders found.', 'checkout_engine') }}</ce-text>
                </ce-table-row>
            @endforelse



        </ce-table>

        @if ($orders->hasPreviousPage())
            <ce-button href="<?php echo esc_url(add_query_arg(['current-page' => $orders->pagination->page - 1])); ?>">{{ __('Prev Page', 'checkout_engine') }}</ce-button>
        @endif

        @if ($orders->hasNextPage())
            <ce-button href="<?php echo esc_url(add_query_arg(['current-page' => $orders->pagination->page + 1])); ?>">{{ __('Next Page', 'checkout_engine') }}</ce-button>
        @endif
    </div>
@endcomponent
