# sc-subscription-payment-method



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description      | Type           | Default     |
| -------------- | --------- | ---------------- | -------------- | ----------- |
| `heading`      | `heading` | The heading      | `string`       | `undefined` |
| `subscription` | --        | The subscription | `Subscription` | `undefined` |


## Dependencies

### Depends on

- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-empty](../../../ui/empty)
- [sc-form](../../../ui/form)
- [sc-choices](../../../ui/choices)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-choice](../../../ui/choice)
- [sc-flex](../../../ui/flex)
- [sc-payment-method](../../../ui/sc-payment-method)
- [sc-tag](../../../ui/tag)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-payment-method --> sc-card
  sc-subscription-payment-method --> sc-stacked-list
  sc-subscription-payment-method --> sc-stacked-list-row
  sc-subscription-payment-method --> sc-skeleton
  sc-subscription-payment-method --> sc-empty
  sc-subscription-payment-method --> sc-form
  sc-subscription-payment-method --> sc-choices
  sc-subscription-payment-method --> sc-button
  sc-subscription-payment-method --> sc-icon
  sc-subscription-payment-method --> sc-choice
  sc-subscription-payment-method --> sc-flex
  sc-subscription-payment-method --> sc-payment-method
  sc-subscription-payment-method --> sc-tag
  sc-subscription-payment-method --> sc-dashboard-module
  sc-subscription-payment-method --> sc-block-ui
  sc-empty --> sc-icon
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-payment-method --> sc-tag
  sc-payment-method --> sc-cc-logo
  sc-payment-method --> sc-icon
  sc-payment-method --> sc-text
  sc-cc-logo --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-subscription-payment-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
