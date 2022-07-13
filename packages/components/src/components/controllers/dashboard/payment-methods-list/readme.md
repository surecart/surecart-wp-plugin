# ce-payment-methods-list



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                   | Type     | Default     |
| --------- | --------- | ----------------------------- | -------- | ----------- |
| `heading` | `heading` |                               | `string` | `undefined` |
| `query`   | --        | Query to fetch paymentMethods | `object` | `undefined` |


## Dependencies

### Depends on

- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-divider](../../../ui/divider)
- [sc-empty](../../../ui/empty)
- [sc-flex](../../../ui/flex)
- [sc-cc-logo](../../../ui/cc-logo)
- [sc-icon](../../../ui/icon)
- [sc-tag](../../../ui/tag)
- [sc-dropdown](../../../ui/dropdown)
- [sc-menu](../../../ui/menu)
- [sc-menu-item](../../../ui/menu-item)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-payment-methods-list --> sc-card
  sc-payment-methods-list --> sc-stacked-list
  sc-payment-methods-list --> sc-stacked-list-row
  sc-payment-methods-list --> sc-skeleton
  sc-payment-methods-list --> sc-divider
  sc-payment-methods-list --> sc-empty
  sc-payment-methods-list --> sc-flex
  sc-payment-methods-list --> sc-cc-logo
  sc-payment-methods-list --> sc-icon
  sc-payment-methods-list --> sc-tag
  sc-payment-methods-list --> sc-dropdown
  sc-payment-methods-list --> sc-menu
  sc-payment-methods-list --> sc-menu-item
  sc-payment-methods-list --> sc-dashboard-module
  sc-payment-methods-list --> sc-button
  sc-payment-methods-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-cc-logo --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-payment-methods-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
