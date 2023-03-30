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

- [sc-price-range](../../../ui/sc-price-range)
- [sc-format-number](../../../util/format-number)
- [sc-tag](../../../ui/tag)

### Graph
```mermaid
graph TD;
  sc-product-price --> sc-price-range
  sc-product-price --> sc-format-number
  sc-product-price --> sc-tag
  sc-price-range --> sc-format-number
  style sc-product-price fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
