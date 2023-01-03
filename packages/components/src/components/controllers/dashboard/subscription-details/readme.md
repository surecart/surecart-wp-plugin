# ce-subscription-details



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type           | Default     |
| -------------- | --------- | ----------- | -------------- | ----------- |
| `subscription` | --        |             | `Subscription` | `undefined` |


## Dependencies

### Used by

 - [sc-subscription](../subscription)

### Depends on

- [sc-toggle](../../../ui/sc-toggle)
- [sc-flex](../../../ui/flex)
- [sc-skeleton](../../../ui/skeleton)
- [sc-subscription-details](.)
- [sc-format-number](../../../util/format-number)
- [sc-card](../../../ui/card)
- [sc-product-line-item](../../../ui/product-line-item)
- [sc-line-item](../../../ui/line-item)
- [sc-divider](../../../ui/divider)
- [sc-payment-method](../../../ui/sc-payment-method)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
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
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-quantity-select --> sc-icon
  sc-payment-method --> sc-tooltip
  sc-payment-method --> sc-button
  sc-payment-method --> sc-icon
  sc-payment-method --> sc-tag
  sc-payment-method --> sc-cc-logo
  sc-payment-method --> sc-text
  sc-cc-logo --> sc-icon
  sc-subscription --> sc-subscription-next-payment
  style sc-subscription-next-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
