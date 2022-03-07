# ce-payment-methods-list



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                   | Type     | Default     |
| --------- | --------- | ----------------------------- | -------- | ----------- |
| `heading` | `heading` |                               | `string` | `undefined` |
| `query`   | --        | Query to fetch paymentMethods | `object` | `undefined` |


## Dependencies

### Depends on

- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/ce-stacked-list)
- [ce-stacked-list-row](../../../ui/ce-stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-divider](../../../ui/divider)
- [ce-empty](../../../ui/ce-empty)
- [ce-flex](../../../ui/flex)
- [ce-cc-logo](../../../ui/ce-cc-logo)
- [ce-tag](../../../ui/tag)
- [ce-dropdown](../../../ui/dropdown)
- [ce-icon](../../../ui/icon)
- [ce-menu](../../../ui/menu)
- [ce-menu-item](../../../ui/menu-item)
- [ce-dashboard-module](../../../ui/ce-dashboard-module)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-payment-methods-list --> ce-card
  ce-payment-methods-list --> ce-stacked-list
  ce-payment-methods-list --> ce-stacked-list-row
  ce-payment-methods-list --> ce-skeleton
  ce-payment-methods-list --> ce-divider
  ce-payment-methods-list --> ce-empty
  ce-payment-methods-list --> ce-flex
  ce-payment-methods-list --> ce-cc-logo
  ce-payment-methods-list --> ce-tag
  ce-payment-methods-list --> ce-dropdown
  ce-payment-methods-list --> ce-icon
  ce-payment-methods-list --> ce-menu
  ce-payment-methods-list --> ce-menu-item
  ce-payment-methods-list --> ce-dashboard-module
  ce-payment-methods-list --> ce-button
  ce-payment-methods-list --> ce-block-ui
  ce-empty --> ce-icon
  ce-cc-logo --> ce-icon
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-payment-methods-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
