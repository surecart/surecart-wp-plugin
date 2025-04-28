# sc-licenses-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                          | Type                                  | Default                                |
| ------------ | ------------- | ------------------------------------ | ------------------------------------- | -------------------------------------- |
| `allLink`    | `all-link`    | View all link                        | `string`                              | `undefined`                            |
| `heading`    | `heading`     | The heading of the licenses          | `string`                              | `__('Licenses', 'surecart')`           |
| `isCustomer` | `is-customer` | Whether the current user is customer | `boolean`                             | `undefined`                            |
| `licenses`   | --            |                                      | `License[]`                           | `[]`                                   |
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
- [sc-icon](../../../ui/icon)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-pagination](../../../ui/pagination)

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
  sc-licenses-list --> sc-icon
  sc-licenses-list --> sc-dashboard-module
  sc-licenses-list --> sc-button
  sc-licenses-list --> sc-pagination
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-pagination --> sc-visually-hidden
  sc-pagination --> sc-icon
  style sc-licenses-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
