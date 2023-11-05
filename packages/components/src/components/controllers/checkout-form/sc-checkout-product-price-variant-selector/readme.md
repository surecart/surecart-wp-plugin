# sc-checkout-product-price-variant-selector



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description              | Type      | Default     |
| --------- | --------- | ------------------------ | --------- | ----------- |
| `label`   | `label`   | The label for the price. | `string`  | `undefined` |
| `product` | --        | The product.             | `Product` | `undefined` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [sc-form-control](../../../ui/form-control)
- [sc-pill-option](../../../ui/pill-option)
- [sc-choices](../../../ui/choices)
- [sc-price-choice-container](../../../ui/sc-price-choice-container)

### Graph
```mermaid
graph TD;
  sc-checkout-product-price-variant-selector --> sc-form-control
  sc-checkout-product-price-variant-selector --> sc-pill-option
  sc-checkout-product-price-variant-selector --> sc-choices
  sc-checkout-product-price-variant-selector --> sc-price-choice-container
  sc-choices --> sc-form-control
  sc-price-choice-container --> sc-format-number
  sc-price-choice-container --> sc-choice-container
  sc-price-choice-container --> sc-skeleton
  style sc-checkout-product-price-variant-selector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
