# sc-product-item-list



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute              | Description | Type                                        | Default     |
| --------------------- | ---------------------- | ----------- | ------------------------------------------- | ----------- |
| `itemStyles`          | `item-styles`          |             | `any`                                       | `{}`        |
| `layoutConfig`        | --                     |             | `{ blockName: string; attributes: any; }[]` | `undefined` |
| `limit`               | `limit`                |             | `number`                                    | `15`        |
| `paginationAlignment` | `pagination-alignment` |             | `string`                                    | `'center'`  |


## Dependencies

### Depends on

- [sc-skeleton](../../../ui/skeleton)
- [sc-product-item](../sc-product-item)
- [sc-pagination](../../../ui/pagination)

### Graph
```mermaid
graph TD;
  sc-product-item-list --> sc-skeleton
  sc-product-item-list --> sc-product-item
  sc-product-item-list --> sc-pagination
  sc-product-item --> sc-product-item-title
  sc-product-item --> sc-product-item-image
  sc-product-item --> sc-product-item-price
  sc-product-item-price --> sc-price-range
  sc-price-range --> sc-format-number
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-button --> sc-spinner
  style sc-product-item-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
