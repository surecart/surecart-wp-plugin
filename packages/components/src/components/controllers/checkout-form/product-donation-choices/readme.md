# sc-donation-choices-new



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                    | Type      | Default     |
| ----------- | ------------ | ------------------------------ | --------- | ----------- |
| `label`     | `label`      | The label for the field.       | `string`  | `undefined` |
| `productId` | `product-id` | The product id for the fields. | `string`  | `undefined` |
| `recurring` | `recurring`  |                                | `boolean` | `undefined` |


## Dependencies

### Depends on

- [sc-recurring-price-choice-container](../../../ui/sc-recurring-price-choice-container)

### Graph
```mermaid
graph TD;
  sc-product-donation-choices --> sc-recurring-price-choice-container
  sc-recurring-price-choice-container --> sc-format-number
  sc-recurring-price-choice-container --> sc-choice-container
  sc-recurring-price-choice-container --> sc-dropdown
  sc-recurring-price-choice-container --> sc-icon
  sc-recurring-price-choice-container --> sc-menu
  sc-recurring-price-choice-container --> sc-menu-item
  style sc-product-donation-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
