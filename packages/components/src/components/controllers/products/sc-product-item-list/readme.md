# sc-product-item-list



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute              | Description            | Type                                        | Default             |
| --------------------- | ---------------------- | ---------------------- | ------------------------------------------- | ------------------- |
| `ajaxPagination`      | `ajax-pagination`      | Should we paginate?    | `boolean`                                   | `true`              |
| `ids`                 | --                     | Limit to a set of ids. | `string[]`                                  | `undefined`         |
| `layoutConfig`        | --                     |                        | `{ blockName: string; attributes: any; }[]` | `undefined`         |
| `limit`               | `limit`                |                        | `number`                                    | `15`                |
| `paginationAlignment` | `pagination-alignment` |                        | `string`                                    | `'center'`          |
| `paginationEnabled`   | `pagination-enabled`   | Should we paginate?    | `boolean`                                   | `true`              |
| `query`               | `query`                | Query to search for    | `string`                                    | `undefined`         |
| `searchEnabled`       | `search-enabled`       | Should allow search    | `boolean`                                   | `true`              |
| `sort`                | `sort`                 | Sort                   | `string`                                    | `'created_at:desc'` |
| `sortEnabled`         | `sort-enabled`         | Should allow search    | `boolean`                                   | `true`              |


## Dependencies

### Depends on

- [sc-dropdown](../../../ui/dropdown)
- [sc-button](../../../ui/button)
- [sc-menu](../../../ui/menu)
- [sc-menu-item](../../../ui/menu-item)
- [sc-input](../../../ui/input)
- [sc-icon](../../../ui/icon)
- [sc-empty](../../../ui/empty)
- [sc-skeleton](../../../ui/skeleton)
- [sc-product-item](../sc-product-item)
- [sc-pagination](../../../ui/pagination)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-product-item-list --> sc-dropdown
  sc-product-item-list --> sc-button
  sc-product-item-list --> sc-menu
  sc-product-item-list --> sc-menu-item
  sc-product-item-list --> sc-input
  sc-product-item-list --> sc-icon
  sc-product-item-list --> sc-empty
  sc-product-item-list --> sc-skeleton
  sc-product-item-list --> sc-product-item
  sc-product-item-list --> sc-pagination
  sc-product-item-list --> sc-block-ui
  sc-button --> sc-spinner
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-empty --> sc-icon
  sc-product-item --> sc-product-item-title
  sc-product-item --> sc-product-item-image
  sc-product-item --> sc-product-item-price
  sc-product-item-price --> sc-format-number
  sc-product-item-price --> sc-price-range
  sc-price-range --> sc-format-number
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-pagination --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-product-item-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
