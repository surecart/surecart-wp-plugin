# sc-subscription-ad-hoc-confirm



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type     | Default     |
| --------- | --------- | ----------- | -------- | ----------- |
| `heading` | `heading` |             | `string` | `undefined` |
| `price`   | --        |             | `Price`  | `undefined` |


## Dependencies

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-price-input](../../../ui/price-input)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-ad-hoc-confirm --> sc-dashboard-module
  sc-subscription-ad-hoc-confirm --> sc-card
  sc-subscription-ad-hoc-confirm --> sc-form
  sc-subscription-ad-hoc-confirm --> sc-price-input
  sc-subscription-ad-hoc-confirm --> sc-button
  sc-subscription-ad-hoc-confirm --> sc-icon
  sc-subscription-ad-hoc-confirm --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-subscription-ad-hoc-confirm fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
