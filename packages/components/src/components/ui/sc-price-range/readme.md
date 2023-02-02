# sc-price-range



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                | Type      | Default     |
| -------- | --------- | -------------------------- | --------- | ----------- |
| `prices` | --        | The array of price objects | `Price[]` | `undefined` |


## Dependencies

### Used by

 - [sc-product-prices](../../controllers/product/sc-product-prices)

### Depends on

- [sc-format-number](../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-price-range --> sc-format-number
  sc-product-prices --> sc-price-range
  style sc-price-range fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
