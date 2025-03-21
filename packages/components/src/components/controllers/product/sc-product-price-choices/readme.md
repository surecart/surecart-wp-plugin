# sc-product-price-choices



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                    | Type      | Default     |
| ----------- | ------------ | ------------------------------ | --------- | ----------- |
| `label`     | `label`      | The product price choice label | `string`  | `undefined` |
| `productId` | `product-id` | The product id                 | `string`  | `undefined` |
| `showPrice` | `show-price` | Whether to show the price      | `boolean` | `undefined` |


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
  sc-form-control --> sc-visually-hidden
  sc-price-choice-container --> sc-choice-container
  sc-price-choice-container --> sc-skeleton
  sc-price-choice-container --> sc-visually-hidden
  style sc-product-price-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
