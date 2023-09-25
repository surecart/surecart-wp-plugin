# sc-donation-choices-new



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                 | Description                     | Type       | Default     |
| ------------------------- | ------------------------- | ------------------------------- | ---------- | ----------- |
| `amountcolumns`           | `amountcolumns`           | The label for the field.        | `string`   | `undefined` |
| `amountlabel`             | `amountlabel`             | The label for the field.        | `string`   | `undefined` |
| `busy`                    | `busy`                    |                                 | `boolean`  | `undefined` |
| `currencyCode`            | `currency-code`           | Currency code for the donation. | `string`   | `'usd'`     |
| `lineItem`                | --                        | Order line items.               | `LineItem` | `undefined` |
| `loading`                 | `loading`                 | Is this loading                 | `boolean`  | `undefined` |
| `nonrecurringchoicelabel` | `nonrecurringchoicelabel` |                                 | `string`   | `undefined` |
| `priceId`                 | `price-id`                | The price id for the fields.    | `string`   | `undefined` |
| `product`                 | `product`                 | The product id for the fields.  | `string`   | `undefined` |
| `recurringchoicelabel`    | `recurringchoicelabel`    |                                 | `string`   | `undefined` |
| `recurringlabel`          | `recurringlabel`          | The label for the field.        | `string`   | `undefined` |
| `selectedProduct`         | --                        |                                 | `Product`  | `undefined` |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scToggleLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Shadow Parts

| Part                  | Description |
| --------------------- | ----------- |
| `"recurring-choices"` |             |


## Dependencies

### Depends on

- [sc-skeleton](../../../ui/skeleton)
- [sc-choices](../../../ui/choices)
- [sc-donation-recurring-choices](../donation-recurring-choices)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-product-donation-choices --> sc-skeleton
  sc-product-donation-choices --> sc-choices
  sc-product-donation-choices --> sc-donation-recurring-choices
  sc-product-donation-choices --> sc-block-ui
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-donation-recurring-choices --> sc-skeleton
  sc-donation-recurring-choices --> sc-choices
  sc-donation-recurring-choices --> sc-recurring-price-choice-container
  sc-donation-recurring-choices --> sc-choice-container
  sc-donation-recurring-choices --> sc-block-ui
  sc-recurring-price-choice-container --> sc-format-number
  sc-recurring-price-choice-container --> sc-choice-container
  sc-recurring-price-choice-container --> sc-dropdown
  sc-recurring-price-choice-container --> sc-button
  sc-recurring-price-choice-container --> sc-menu
  sc-recurring-price-choice-container --> sc-menu-item
  sc-recurring-price-choice-container --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-product-donation-choices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
