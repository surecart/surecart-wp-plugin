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

- [sc-divider](../../../ui/divider)
- [sc-empty](../../../ui/empty)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-subscription-details](../subscription-details)
- [sc-icon](../../../ui/icon)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-pagination](../../../ui/pagination)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscriptions-list --> sc-divider
  sc-subscriptions-list --> sc-empty
  sc-subscriptions-list --> sc-card
  sc-subscriptions-list --> sc-stacked-list
  sc-subscriptions-list --> sc-stacked-list-row
  sc-subscriptions-list --> sc-skeleton
  sc-subscriptions-list --> sc-subscription-details
  sc-subscriptions-list --> sc-icon
  sc-subscriptions-list --> sc-dashboard-module
  sc-subscriptions-list --> sc-button
  sc-subscriptions-list --> sc-pagination
  sc-subscriptions-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-subscription-details --> sc-subscription-status-badge
  sc-subscription-details --> sc-format-date
  sc-subscription-details --> sc-skeleton
  sc-subscription-details --> sc-text
  sc-subscription-details --> sc-tag
  sc-subscription-details --> sc-format-number
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-block-ui --> sc-spinner
  style sc-subscriptions-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
