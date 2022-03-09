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

- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-tag](../../../ui/tag)
- [ce-card](../../../ui/card)
- [ce-form](../../../ui/form)
- [ce-input](../../../ui/input)
- [ce-columns](../../../ui/columns)
- [ce-column](../../../ui/column)
- [ce-address](../../../ui/address)
- [ce-switch](../../../ui/switch)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-customer-edit --> ce-dashboard-module
  ce-customer-edit --> ce-tag
  ce-customer-edit --> ce-card
  ce-customer-edit --> ce-form
  ce-customer-edit --> ce-input
  ce-customer-edit --> ce-columns
  ce-customer-edit --> ce-column
  ce-customer-edit --> ce-address
  ce-customer-edit --> ce-switch
  ce-customer-edit --> ce-button
  ce-customer-edit --> ce-block-ui
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-address --> ce-form-control
  ce-address --> ce-select
  ce-address --> ce-input
  ce-select --> ce-menu-label
  ce-select --> ce-menu-item
  ce-select --> ce-form-control
  ce-select --> ce-dropdown
  ce-select --> ce-icon
  ce-select --> ce-input
  ce-select --> ce-spinner
  ce-select --> ce-menu
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-customer-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
