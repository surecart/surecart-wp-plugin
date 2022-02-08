# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                        | Type                          | Default        |
| ---------------- | ----------------- | ---------------------------------- | ----------------------------- | -------------- |
| `cancelBehavior` | `cancel-behavior` |                                    | `"immediate" \| "period_end"` | `'period_end'` |
| `query`          | --                | Customer id to fetch subscriptions | `object`                      | `undefined`    |


## Dependencies

### Depends on

- [ce-card](../../../ui/card)
- [ce-flex](../../../ui/flex)
- [ce-skeleton](../../../ui/skeleton)
- [ce-alert](../../../ui/alert)
- [ce-spacing](../../../ui/spacing)
- [ce-subscription](../subscription)

### Graph
```mermaid
graph TD;
  ce-subscriptions-list --> ce-card
  ce-subscriptions-list --> ce-flex
  ce-subscriptions-list --> ce-skeleton
  ce-subscriptions-list --> ce-alert
  ce-subscriptions-list --> ce-spacing
  ce-subscriptions-list --> ce-subscription
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-alert --> ce-icon
  ce-subscription --> ce-format-date
  ce-subscription --> ce-subscription-status-badge
  ce-subscription --> ce-card
  ce-subscription --> ce-flex
  ce-subscription --> ce-format-number
  ce-subscription --> ce-text
  ce-subscription --> ce-button
  ce-subscription --> ce-alert
  ce-subscription --> ce-block-ui
  ce-subscription-status-badge --> ce-format-date
  ce-subscription-status-badge --> ce-tag
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-subscriptions-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
