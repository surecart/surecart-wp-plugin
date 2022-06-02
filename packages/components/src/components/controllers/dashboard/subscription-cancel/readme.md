# ce-subscription-cancel



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
  sc-subscription-cancel --> sc-subscription-details
  sc-subscription-cancel --> sc-alert
  sc-subscription-cancel --> sc-format-date
  sc-subscription-cancel --> sc-skeleton
  sc-subscription-cancel --> sc-dashboard-module
  sc-subscription-cancel --> sc-card
  sc-subscription-cancel --> sc-button
  sc-subscription-cancel --> sc-block-ui
  sc-subscription-details --> sc-subscription-status-badge
  sc-subscription-details --> sc-format-date
  sc-subscription-details --> sc-skeleton
  sc-subscription-details --> sc-format-number
  sc-subscription-details --> sc-text
  sc-subscription-details --> sc-tag
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-alert --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-subscription-cancel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
