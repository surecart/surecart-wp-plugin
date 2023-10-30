# sc-donation-choices-new



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                    | Description                                   | Type     | Default     |
| ------------------------- | ---------------------------- | --------------------------------------------- | -------- | ----------- |
| `amountColumns`           | `amount-columns`             | Number of columns for amounts.                | `string` | `undefined` |
| `amountLabel`             | `amount-label`               | The label for the field.                      | `string` | `undefined` |
| `nonRecurringChoiceLabel` | `non-recurring-choice-label` | The label for the non recurring choice field. | `string` | `undefined` |
| `productId`               | `product-id`                 | The product id for the fields.                | `string` | `undefined` |
| `recurringChoiceLabel`    | `recurring-choice-label`     | The label for the recurring choice field.     | `string` | `undefined` |
| `recurringLabel`          | `recurring-label`            | The label for the recurring fields.           | `string` | `undefined` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"base"`    |             |
| `"choice"`  |             |
| `"choices"` |             |


## Dependencies

### Depends on

- [sc-choices](../../../ui/choices)
- [sc-recurring-price-choice-container](../../../ui/sc-recurring-price-choice-container)
- [sc-choice-container](../../../ui/choice-container)

### Graph
```mermaid
graph TD;
  sc-product-donation-choices --> sc-choices
  sc-product-donation-choices --> sc-recurring-price-choice-container
  sc-product-donation-choices --> sc-choice-container
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
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
