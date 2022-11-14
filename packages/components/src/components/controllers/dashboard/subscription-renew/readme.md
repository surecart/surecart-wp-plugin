# ce-subscription-renew



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type           | Default     |
| ---------------- | ----------------- | ----------- | -------------- | ----------- |
| `backUrl`        | `back-url`        |             | `string`       | `undefined` |
| `heading`        | `heading`         |             | `string`       | `undefined` |
| `subscription`   | --                |             | `Subscription` | `undefined` |
| `subscriptionId` | `subscription-id` |             | `string`       | `undefined` |
| `successUrl`     | `success-url`     |             | `string`       | `undefined` |


## Dependencies

### Depends on

- [sc-subscription-details](../subscription-details)
- [sc-alert](../../../ui/alert)
- [sc-format-date](../../../util/format-date)
- [sc-skeleton](../../../ui/skeleton)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-renew --> sc-subscription-details
  sc-subscription-renew --> sc-alert
  sc-subscription-renew --> sc-format-date
  sc-subscription-renew --> sc-skeleton
  sc-subscription-renew --> sc-dashboard-module
  sc-subscription-renew --> sc-card
  sc-subscription-renew --> sc-button
  sc-subscription-renew --> sc-block-ui
  sc-subscription-details --> sc-subscription-status-badge
  sc-subscription-details --> sc-format-date
  sc-subscription-details --> sc-skeleton
  sc-subscription-details --> sc-format-number
  sc-subscription-details --> sc-flex
  sc-subscription-details --> sc-tag
  sc-subscription-details --> sc-text
  sc-subscription-details --> sc-dialog
  sc-subscription-details --> sc-card
  sc-subscription-details --> sc-stacked-list
  sc-subscription-details --> sc-stacked-list-row
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-alert --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-block-ui --> sc-spinner
  style sc-subscription-renew fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
