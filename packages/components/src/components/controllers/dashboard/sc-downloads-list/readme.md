# sc-downloads-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type         | Default     |
| ------------ | ------------- | ----------- | ------------ | ----------- |
| `customerId` | `customer-id` |             | `string`     | `undefined` |
| `downloads`  | --            |             | `Download[]` | `undefined` |
| `heading`    | `heading`     |             | `string`     | `undefined` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Depends on

- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-flex](../../../ui/flex)
- [sc-format-bytes](../../../util/format-bytes)
- [sc-tag](../../../ui/tag)
- [sc-button](../../../ui/button)

### Graph
```mermaid
graph TD;
  sc-downloads-list --> sc-dashboard-module
  sc-downloads-list --> sc-card
  sc-downloads-list --> sc-stacked-list
  sc-downloads-list --> sc-stacked-list-row
  sc-downloads-list --> sc-flex
  sc-downloads-list --> sc-format-bytes
  sc-downloads-list --> sc-tag
  sc-downloads-list --> sc-button
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  style sc-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
