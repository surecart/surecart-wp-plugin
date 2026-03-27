# sc-product-prices



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description           | Type      | Default     |
| ----------- | ------------ | --------------------- | --------- | ----------- |
| `prices`    | --           | The product's prices. | `Price[]` | `undefined` |
| `productId` | `product-id` | The product id        | `string`  | `undefined` |
| `saleText`  | `sale-text`  | The sale text         | `string`  | `undefined` |


## Dependencies

### Depends on

- [sc-price](../../../ui/price)

### Graph
```mermaid
graph TD;
  sc-product-price --> sc-price
  sc-price --> sc-visually-hidden
  sc-price --> sc-format-number
  sc-price --> sc-tag
  style sc-product-price fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
