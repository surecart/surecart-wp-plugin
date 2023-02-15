# ce-subscription



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                        | Type                   | Default     |
| ---------------- | ----------------- | ---------------------------------- | ---------------------- | ----------- |
| `heading`        | `heading`         |                                    | `string`               | `undefined` |
| `protocol`       | --                |                                    | `SubscriptionProtocol` | `undefined` |
| `query`          | --                |                                    | `object`               | `undefined` |
| `showCancel`     | `show-cancel`     |                                    | `boolean`              | `undefined` |
| `subscription`   | --                |                                    | `Subscription`         | `undefined` |
| `subscriptionId` | `subscription-id` | Customer id to fetch subscriptions | `string`               | `undefined` |


## Dependencies

### Depends on

- [sc-subscription-status-badge](../../../ui/subscription-status-badge)
- [sc-format-date](../../../util/format-date)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-subscription-next-payment](../subscription-details)
- [sc-subscription-details](../subscription-details)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-flex](../../../ui/flex)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-block-ui](../../../ui/block-ui)
- [sc-cancel-dialog](../sc-cancel-dialog)

### Graph
```mermaid
graph TD;
  sc-subscription --> sc-subscription-status-badge
  sc-subscription --> sc-format-date
  sc-subscription --> sc-stacked-list-row
  sc-subscription --> sc-skeleton
  sc-subscription --> sc-subscription-next-payment
  sc-subscription --> sc-subscription-details
  sc-subscription --> sc-dashboard-module
  sc-subscription --> sc-flex
  sc-subscription --> sc-button
  sc-subscription --> sc-icon
  sc-subscription --> sc-card
  sc-subscription --> sc-block-ui
  sc-subscription --> sc-cancel-dialog
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-subscription-next-payment --> sc-toggle
  sc-subscription-next-payment --> sc-flex
  sc-subscription-next-payment --> sc-skeleton
  sc-subscription-next-payment --> sc-subscription-details
  sc-subscription-next-payment --> sc-format-number
  sc-subscription-next-payment --> sc-card
  sc-subscription-next-payment --> sc-product-line-item
  sc-subscription-next-payment --> sc-line-item
  sc-subscription-next-payment --> sc-divider
  sc-subscription-next-payment --> sc-payment-method
  sc-subscription-next-payment --> sc-icon
  sc-toggle --> sc-icon
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
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-product-line-item --> sc-line-item
  sc-quantity-select --> sc-icon
  sc-payment-method --> sc-tooltip
  sc-payment-method --> sc-button
  sc-payment-method --> sc-icon
  sc-payment-method --> sc-tag
  sc-payment-method --> sc-cc-logo
  sc-payment-method --> sc-text
  sc-cc-logo --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  sc-cancel-dialog --> sc-dialog
  sc-cancel-dialog --> sc-button
  sc-cancel-dialog --> sc-icon
  sc-cancel-dialog --> sc-subscription-cancel
  sc-cancel-dialog --> sc-cancel-survey
  sc-cancel-dialog --> sc-cancel-discount
  sc-subscription-cancel --> sc-format-date
  sc-subscription-cancel --> sc-skeleton
  sc-subscription-cancel --> sc-dashboard-module
  sc-subscription-cancel --> sc-flex
  sc-subscription-cancel --> sc-button
  sc-subscription-cancel --> sc-block-ui
  sc-cancel-survey --> sc-choice
  sc-cancel-survey --> sc-skeleton
  sc-cancel-survey --> sc-dashboard-module
  sc-cancel-survey --> sc-form
  sc-cancel-survey --> sc-choices
  sc-cancel-survey --> sc-textarea
  sc-cancel-survey --> sc-flex
  sc-cancel-survey --> sc-button
  sc-cancel-survey --> sc-icon
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-textarea --> sc-form-control
  sc-cancel-discount --> sc-dashboard-module
  sc-cancel-discount --> sc-flex
  sc-cancel-discount --> sc-button
  sc-cancel-discount --> sc-block-ui
  style sc-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
