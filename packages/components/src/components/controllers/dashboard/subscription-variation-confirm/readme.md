# sc-subscription-ad-hoc-confirm



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type           | Default     |
| -------------- | --------- | ----------- | -------------- | ----------- |
| `heading`      | `heading` |             | `string`       | `undefined` |
| `price`        | --        |             | `Price`        | `undefined` |
| `product`      | --        |             | `Product`      | `undefined` |
| `subscription` | --        |             | `Subscription` | `undefined` |


## Shadow Parts

| Part            | Description |
| --------------- | ----------- |
| `"name__input"` |             |


## Dependencies

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-select](../../../ui/select)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-subscription-variation-confirm --> sc-dashboard-module
  sc-subscription-variation-confirm --> sc-card
  sc-subscription-variation-confirm --> sc-form
  sc-subscription-variation-confirm --> sc-select
  sc-subscription-variation-confirm --> sc-button
  sc-subscription-variation-confirm --> sc-icon
  sc-subscription-variation-confirm --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-select --> sc-icon
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-input --> sc-form-control
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-subscription-variation-confirm fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
