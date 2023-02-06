# sc-product-prices



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type      | Default     |
| -------- | --------- | ----------- | --------- | ----------- |
| `prices` | --        |             | `Price[]` | `undefined` |


## Shadow Parts

| Part               | Description |
| ------------------ | ----------- |
| `"price__scratch"` |             |


## Dependencies

### Depends on

- [sc-format-number](../../../util/format-number)
- [sc-tag](../../../ui/tag)
- [sc-price-range](../../../ui/sc-price-range)

### Graph
```mermaid
graph TD;
  sc-product-prices --> sc-format-number
  sc-product-prices --> sc-tag
  sc-product-prices --> sc-price-range
  sc-price-range --> sc-format-number
  style sc-product-prices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
