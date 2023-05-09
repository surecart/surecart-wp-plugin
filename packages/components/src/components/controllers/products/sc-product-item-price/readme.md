# sc-product-item-price



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description       | Type      | Default     |
| -------- | --------- | ----------------- | --------- | ----------- |
| `prices` | --        |                   | `Price[]` | `undefined` |
| `range`  | `range`   | Show price range? | `boolean` | `true`      |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Used by

 - [sc-product-item](../sc-product-item)

### Depends on

- [sc-format-number](../../../util/format-number)
- [sc-price-range](../../../ui/sc-price-range)

### Graph
```mermaid
graph TD;
  sc-product-item-price --> sc-format-number
  sc-product-item-price --> sc-price-range
  sc-price-range --> sc-format-number
  sc-product-item --> sc-product-item-price
  style sc-product-item-price fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
