# sc-donation-choices-new



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                    | Description                     | Type       | Default     |
| ------------------------- | ---------------------------- | ------------------------------- | ---------- | ----------- |
| `amountColumns`           | `amount-columns`             | The label for the field.        | `string`   | `undefined` |
| `amountLabel`             | `amount-label`               | The label for the field.        | `string`   | `undefined` |
| `busy`                    | `busy`                       |                                 | `boolean`  | `undefined` |
| `currencyCode`            | `currency-code`              | Currency code for the donation. | `string`   | `'usd'`     |
| `lineItem`                | --                           | Order line items.               | `LineItem` | `undefined` |
| `loading`                 | `loading`                    | Is this loading                 | `boolean`  | `undefined` |
| `nonRecurringChoiceLabel` | `non-recurring-choice-label` |                                 | `string`   | `undefined` |
| `priceId`                 | `price-id`                   | The price id for the fields.    | `string`   | `undefined` |
| `product`                 | `product`                    | The product id for the fields.  | `string`   | `undefined` |
| `recurringChoiceLabel`    | `recurring-choice-label`     |                                 | `string`   | `undefined` |
| `recurringLabel`          | `recurring-label`            | The label for the field.        | `string`   | `undefined` |
| `selectedProduct`         | --                           |                                 | `Product`  | `undefined` |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scToggleLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"base"`    |             |
| `"choice"`  |             |
| `"choices"` |             |


## Dependencies

### Depends on

- [sc-skeleton](../../../ui/skeleton)
- [sc-choices](../../../ui/choices)
- [sc-recurring-price-choice-container](../../../ui/sc-recurring-price-choice-container)
- [sc-choice-container](../../../ui/choice-container)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-product-donation-choices --> sc-skeleton
  sc-product-donation-choices --> sc-choices
  sc-product-donation-choices --> sc-recurring-price-choice-container
  sc-product-donation-choices --> sc-choice-container
  sc-product-donation-choices --> sc-block-ui
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-recurring-price-choice-container --> sc-format-number
  sc-recurring-price-choice-container --> sc-choice-container
  sc-recurring-price-choice-container --> sc-dropdown
  sc-recurring-price-choice-container --> sc-icon
  sc-recurring-price-choice-container --> sc-menu
  sc-recurring-price-choice-container --> sc-menu-item
  sc-block-ui --> sc-spinner
  style sc-product-donation-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
