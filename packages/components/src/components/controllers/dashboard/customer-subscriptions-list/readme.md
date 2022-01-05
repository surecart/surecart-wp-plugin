# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                        | Type                          | Default        |
| ---------------- | ----------------- | ---------------------------------- | ----------------------------- | -------------- |
| `cancelBehavior` | `cancel-behavior` |                                    | `"immediate" \| "period_end"` | `'period_end'` |
| `customerId`     | `customer-id`     | Customer id to fetch subscriptions | `string`                      | `undefined`    |
| `error`          | `error`           |                                    | `string`                      | `undefined`    |
| `isIndex`        | `is-index`        |                                    | `boolean`                     | `undefined`    |
| `loading`        | `loading`         |                                    | `boolean`                     | `undefined`    |
| `subscriptions`  | --                |                                    | `Subscription[]`              | `undefined`    |


## Events

| Event                  | Description | Type                  |
| ---------------------- | ----------- | --------------------- |
| `ceFetchSubscriptions` |             | `CustomEvent<object>` |


## Dependencies

### Depends on

- [ce-card](../../../ui/card)
- [ce-flex](../../../ui/flex)
- [ce-skeleton](../../../ui/skeleton)
- [ce-alert](../../../ui/alert)
- [ce-spacing](../../../ui/spacing)
- [ce-customer-subscription](../customer-subscription)

### Graph
```mermaid
graph TD;
  ce-customer-subscriptions-list --> ce-card
  ce-customer-subscriptions-list --> ce-flex
  ce-customer-subscriptions-list --> ce-skeleton
  ce-customer-subscriptions-list --> ce-alert
  ce-customer-subscriptions-list --> ce-spacing
  ce-customer-subscriptions-list --> ce-customer-subscription
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-customer-subscription --> ce-format-date
  ce-customer-subscription --> ce-subscription-status-badge
  ce-customer-subscription --> ce-card
  ce-customer-subscription --> ce-flex
  ce-customer-subscription --> ce-format-number
  ce-customer-subscription --> ce-text
  ce-customer-subscription --> ce-button
  ce-customer-subscription --> ce-alert
  ce-customer-subscription --> ce-block-ui
  ce-subscription-status-badge --> ce-tag
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-customer-subscriptions-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
