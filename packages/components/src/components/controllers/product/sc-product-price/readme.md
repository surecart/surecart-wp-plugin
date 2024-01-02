# sc-product-prices



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description           | Type      | Default     |
| ----------- | ------------ | --------------------- | --------- | ----------- |
| `prices`    | --           | The product's prices. | `Price[]` | `undefined` |
| `productId` | `product-id` | The product id        | `string`  | `undefined` |
| `saleText`  | `sale-text`  | The sale text         | `string`  | `undefined` |


## Shadow Parts

| Part               | Description |
| ------------------ | ----------- |
| `"price__scratch"` |             |


## Dependencies

### Depends on

- [sc-price-range](../../../ui/sc-price-range)
- [sc-visually-hidden](../../../util/visually-hidden)
- [sc-format-number](../../../util/format-number)
- [sc-tag](../../../ui/tag)

### Graph
```mermaid
graph TD;
  sc-product-price --> sc-price-range
  sc-product-price --> sc-visually-hidden
  sc-product-price --> sc-format-number
  sc-product-price --> sc-tag
  sc-price-range --> sc-format-number
  sc-price-range --> sc-visually-hidden
  style sc-product-price fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
