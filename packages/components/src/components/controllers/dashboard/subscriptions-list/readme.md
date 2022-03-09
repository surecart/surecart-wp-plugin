# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                        | Type                                  | Default                                |
| ---------------- | ----------------- | ---------------------------------- | ------------------------------------- | -------------------------------------- |
| `allLink`        | `all-link`        |                                    | `string`                              | `undefined`                            |
| `cancelBehavior` | `cancel-behavior` |                                    | `"immediate" \| "period_end"`         | `'period_end'`                         |
| `heading`        | `heading`         |                                    | `string`                              | `undefined`                            |
| `query`          | --                | Customer id to fetch subscriptions | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |


## Dependencies

### Depends on

- [ce-divider](../../../ui/divider)
- [ce-empty](../../../ui/empty)
- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/stacked-list)
- [ce-stacked-list-row](../../../ui/stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-subscription-details](../subscription-details)
- [ce-icon](../../../ui/icon)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-button](../../../ui/button)
- [ce-pagination](../../../ui/pagination)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-subscriptions-list --> ce-divider
  ce-subscriptions-list --> ce-empty
  ce-subscriptions-list --> ce-card
  ce-subscriptions-list --> ce-stacked-list
  ce-subscriptions-list --> ce-stacked-list-row
  ce-subscriptions-list --> ce-skeleton
  ce-subscriptions-list --> ce-subscription-details
  ce-subscriptions-list --> ce-icon
  ce-subscriptions-list --> ce-dashboard-module
  ce-subscriptions-list --> ce-button
  ce-subscriptions-list --> ce-pagination
  ce-subscriptions-list --> ce-block-ui
  ce-empty --> ce-icon
  ce-subscription-details --> ce-subscription-status-badge
  ce-subscription-details --> ce-format-date
  ce-subscription-details --> ce-skeleton
  ce-subscription-details --> ce-text
  ce-subscription-details --> ce-tag
  ce-subscription-details --> ce-format-number
  ce-subscription-status-badge --> ce-format-date
  ce-subscription-status-badge --> ce-tag
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  ce-block-ui --> ce-spinner
  style ce-subscriptions-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
