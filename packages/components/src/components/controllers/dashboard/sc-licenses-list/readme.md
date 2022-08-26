# sc-licenses-list



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description | Type           | Default     |
| ------------- | --------- | ----------- | -------------- | ----------- |
| `activations` | --        |             | `Activation[]` | `[]`        |
| `copied`      | `copied`  |             | `boolean`      | `undefined` |
| `heading`     | `heading` |             | `string`       | `undefined` |
| `licenses`    | --        |             | `License[]`    | `[]`        |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Depends on

- [sc-tag](../../../ui/tag)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-table](../../../ui/table)
- [sc-table-cell](../../../ui/table-cell)
- [sc-table-row](../../../ui/table-row)
- [sc-input](../../../ui/input)
- [sc-button](../../../ui/button)

### Graph
```mermaid
graph TD;
  sc-licenses-list --> sc-tag
  sc-licenses-list --> sc-dashboard-module
  sc-licenses-list --> sc-card
  sc-licenses-list --> sc-table
  sc-licenses-list --> sc-table-cell
  sc-licenses-list --> sc-table-row
  sc-licenses-list --> sc-input
  sc-licenses-list --> sc-button
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  style sc-licenses-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
