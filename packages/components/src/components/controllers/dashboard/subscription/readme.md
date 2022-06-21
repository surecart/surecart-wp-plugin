# ce-subscription



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                        | Type           | Default     |
| ---------------- | ----------------- | ---------------------------------- | -------------- | ----------- |
| `heading`        | `heading`         |                                    | `string`       | `undefined` |
| `query`          | --                |                                    | `object`       | `undefined` |
| `showCancel`     | `show-cancel`     |                                    | `boolean`      | `undefined` |
| `subscription`   | --                |                                    | `Subscription` | `undefined` |
| `subscriptionId` | `subscription-id` | Customer id to fetch subscriptions | `string`       | `undefined` |


## Dependencies

### Depends on

- [sc-subscription-status-badge](../../../ui/subscription-status-badge)
- [sc-format-date](../../../util/format-date)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-subscription-details](../subscription-details)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription --> sc-subscription-status-badge
  sc-subscription --> sc-format-date
  sc-subscription --> sc-stacked-list-row
  sc-subscription --> sc-skeleton
  sc-subscription --> sc-subscription-details
  sc-subscription --> sc-dashboard-module
  sc-subscription --> sc-flex
  sc-subscription --> sc-button
  sc-subscription --> sc-icon
  sc-subscription --> sc-card
  sc-subscription --> sc-stacked-list
  sc-subscription --> sc-block-ui
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-subscription-details --> sc-subscription-status-badge
  sc-subscription-details --> sc-format-date
  sc-subscription-details --> sc-skeleton
  sc-subscription-details --> sc-format-number
  sc-subscription-details --> sc-text
  sc-subscription-details --> sc-tag
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
