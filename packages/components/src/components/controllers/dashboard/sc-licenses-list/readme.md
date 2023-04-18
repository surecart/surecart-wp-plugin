# sc-licenses-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                          | Type                                  | Default                                |
| ------------ | ------------- | ------------------------------------ | ------------------------------------- | -------------------------------------- |
| `allLink`    | `all-link`    | View all link                        | `string`                              | `undefined`                            |
| `heading`    | `heading`     | The heading of the licenses          | `string`                              | `__('Licenses', 'surecart')`           |
| `isCustomer` | `is-customer` | Whether the current user is customer | `boolean`                             | `undefined`                            |
| `query`      | --            | Query to fetch licenses              | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Depends on

- [sc-tag](../../../ui/tag)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-divider](../../../ui/divider)
- [sc-empty](../../../ui/empty)
- [sc-table](../../../ui/table)
- [sc-table-cell](../../../ui/table-cell)
- [sc-table-row](../../../ui/table-row)
- [sc-input](../../../ui/input)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-dialog](../../../ui/sc-dialog)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-licenses-list --> sc-tag
  sc-licenses-list --> sc-card
  sc-licenses-list --> sc-stacked-list
  sc-licenses-list --> sc-stacked-list-row
  sc-licenses-list --> sc-skeleton
  sc-licenses-list --> sc-divider
  sc-licenses-list --> sc-empty
  sc-licenses-list --> sc-table
  sc-licenses-list --> sc-table-cell
  sc-licenses-list --> sc-table-row
  sc-licenses-list --> sc-input
  sc-licenses-list --> sc-button
  sc-licenses-list --> sc-icon
  sc-licenses-list --> sc-dialog
  sc-licenses-list --> sc-dashboard-module
  sc-licenses-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-licenses-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
