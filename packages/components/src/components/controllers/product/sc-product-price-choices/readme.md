# sc-product-price-choices



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `label`  | `label`   |             | `string` | `undefined` |


## Dependencies

### Depends on

- [sc-format-number](../../../util/format-number)
- [sc-choices](../../../ui/choices)
- [sc-price-choice-container](../../../ui/sc-price-choice-container)

### Graph
```mermaid
graph TD;
  sc-product-price-choices --> sc-format-number
  sc-product-price-choices --> sc-choices
  sc-product-price-choices --> sc-price-choice-container
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-price-choice-container --> sc-format-number
  sc-price-choice-container --> sc-choice-container
  sc-price-choice-container --> sc-skeleton
  style sc-product-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
