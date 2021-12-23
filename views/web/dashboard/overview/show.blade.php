<ce-spacing style="--spacing: var(--ce-spacing-xx-large)">
    {{-- <ce-customer-subscriptions
        customer-id="{{ $customer_id }}"
        cancel-behavior="immediate"
    ></ce-customer-subscriptions> --}}
    {{-- <ce-card>
        <ce-flex>
            <div>
                <ce-text
                    style="--font-weight: var(--ce-font-weight-bold); --font-size: var(--ce-font-size-large); --line-height: var(--ce-line-height-normal);"
                >
                    Typographic Starter
                </ce-text>
                <ce-text
                    style="--font-weight: var(--ce-font-weight-normal); --font-size: var(--ce-font-size-medium); --line-height: var(--ce-line-height-normal);"
                >$10.00 per month</ce-text>
                <ce-text
                    style="--font-weight: var(--ce-font-weight-normal); --font-size: var(--ce-font-size-medium); --line-height: var(--ce-line-height-normal); --color: var(--ce-color-gray-500);"
                >Your plan renews on January 21, 2022.</ce-text>
            </div>
            <ce-flex flex-direction="column">
                <ce-button type="primary">Update Plan</ce-button>
                <ce-button>Cancel Plan</ce-button>
            </ce-flex>
        </ce-flex>
    </ce-card> --}}

    <ce-card borderless>
        <ce-heading slot="title">Payment Methods</ce-heading>
        <ce-flex justify-content="flex-start">
            <div>•••• 4242</div>
            <div>Expires 4/2024</div>
            <div style="margin-left: auto;">
                <ce-button
                    size="small"
                    type="danger"
                    outline
                >Remove</ce-button>
            </div>
        </ce-flex>
        <ce-button size="small">
            <ce-icon
                slot="prefix"
                name="plus"
            ></ce-icon> New Payment Method
        </ce-button>
    </ce-card>

    <ce-card borderless>
        <ce-heading slot="title">Recent Orders</ce-heading>

        <ce-table>
            <ce-table-cell slot="head">{{ esc_html__('Number', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head">{{ esc_html__('Items', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head">{{ esc_html__('Total', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell
                slot="head"
                style="width:100px"
            >{{ esc_html__('Status', 'checkout_engine') }}</ce-table-cell>
            <ce-table-cell slot="head"></ce-table-cell>
            <ce-table-row>
                <ce-table-cell>
                    <ce-text
                        truncate
                        style="--font-weight: var(--ce-font-weight-semibold);"
                    >15AG68LR
                    </ce-text>
                </ce-table-cell>
                <ce-table-cell>
                    <ce-text
                        truncate
                        style="--color: var(--ce-color-gray-500);"
                    >
                        {{ sprintf(_n('%s item', '%s items', 2, 'checkout_engine'), number_format_i18n(2)) }}
                    </ce-text>
                </ce-table-cell>
                <ce-table-cell>
                    <ce-format-number
                        type="currency"
                        currency='usd'
                        value="2500"
                    >
                    </ce-format-number>
                </ce-table-cell>
                <ce-table-cell>
                    <ce-session-status-badge status="paid"></ce-session-status-badge>
                </ce-table-cell>
                <ce-table-cell>
                    <ce-button
                        href="<?php echo esc_url(add_query_arg(['id' => 'asdfasdf'])); ?>"
                        size="small"
                    >{{ __('View', 'checkout_engine') }}
                    </ce-button>
                </ce-table-cell>
            </ce-table-row>
        </ce-table>
    </ce-card>
</ce-spacing>
