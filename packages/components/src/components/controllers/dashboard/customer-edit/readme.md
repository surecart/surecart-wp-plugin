# ce-customer-edit



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type       | Default     |
| ------------ | ------------- | ----------- | ---------- | ----------- |
| `customer`   | --            |             | `Customer` | `undefined` |
| `heading`    | `heading`     |             | `string`   | `undefined` |
| `successUrl` | `success-url` |             | `string`   | `undefined` |


## Dependencies

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-tag](../../../ui/tag)
- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-input](../../../ui/input)
- [sc-columns](../../../ui/columns)
- [sc-column](../../../ui/column)
- [sc-address](../../../ui/address)
- [sc-switch](../../../ui/switch)
- [sc-tax-id-input](../../../ui/tax-id-input)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-customer-edit --> sc-dashboard-module
  sc-customer-edit --> sc-tag
  sc-customer-edit --> sc-card
  sc-customer-edit --> sc-form
  sc-customer-edit --> sc-input
  sc-customer-edit --> sc-columns
  sc-customer-edit --> sc-column
  sc-customer-edit --> sc-address
  sc-customer-edit --> sc-switch
  sc-customer-edit --> sc-tax-id-input
  sc-customer-edit --> sc-button
  sc-customer-edit --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-address --> sc-form-control
  sc-address --> sc-input
  sc-address --> sc-select
  sc-address --> sc-block-ui
  sc-select --> sc-icon
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-block-ui --> sc-spinner
  sc-tax-id-input --> sc-input
  sc-tax-id-input --> sc-dropdown
  sc-tax-id-input --> sc-button
  sc-tax-id-input --> sc-menu
  sc-tax-id-input --> sc-menu-item
  sc-button --> sc-spinner
  style sc-customer-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
