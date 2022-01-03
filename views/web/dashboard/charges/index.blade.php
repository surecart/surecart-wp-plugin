{{-- <ce-table>
    <ce-table-cell slot="head">
        {{ esc_html__('Date', 'checkout_engine') }}
    </ce-table-cell>
    <ce-table-cell slot="head">
        {{ esc_html__('Amount', 'checkout_engine') }}
    </ce-table-cell>
    <ce-table-cell
        slot="head"
        style="width:100px"
    >
        {{ esc_html__('Status', 'checkout_engine') }}
    </ce-table-cell>
    <ce-table-cell
        slot="head"
        style="width:100px"
    ></ce-table-cell>

    @forelse ($charges->data as $key => $charge)
        <ce-table-row>
            <ce-table-cell>
                {{ wp_date(get_option('date_format'), $charge->created_at) }}
            </ce-table-cell>
            <ce-table-cell>
                <ce-format-number
                    type="currency"
                    currency={{ $charge->currency }}
                    value={{ $charge->amount }}
                >
                </ce-format-number>
            </ce-table-cell>
            <ce-table-cell>
                @if ($charge->fully_refunded)
                    <ce-tag type="danger">{{ esc_html__('Refunded', 'checkout_engine') }}</ce-tag>
                @elseif ($charge->refunded_amount)
                    <ce-tag type="warning">{{ esc_html__('Partial Refund', 'checkout_engine') }}</ce-tag>
                @else
                    <ce-tag type="success">{{ esc_html__('Succeeded', 'checkout_engine') }}</ce-tag>
                @endif
            </ce-table-cell>
            <ce-table-cell>
                <ce-button
                    href="<?php echo esc_url(add_query_arg(['id' => $charge->id])); ?>"
                    size="small"
                >{{ esc_html__('Details', 'checkout_engine') }}
                </ce-button>
            </ce-table-cell>
        </ce-table-row>
    @empty
        <ce-table-row>
            <ce-text style="padding: 1em;">{{ esc_html__('No charges found.', 'checkout_engine') }}</ce-text>
        </ce-table-row>
    @endforelse
    </div> --}}
