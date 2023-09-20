# sc-donation-recurring-choices-new



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute  | Description                    | Type      | Default     |
| ----------------- | ---------- | ------------------------------ | --------- | ----------- |
| `busy`            | `busy`     |                                | `boolean` | `undefined` |
| `label`           | `label`    | The label for the field.       | `string`  | `undefined` |
| `loading`         | `loading`  | Is this loading                | `boolean` | `undefined` |
| `priceId`         | `price-id` | The price id for the fields.   | `string`  | `undefined` |
| `prices`          | --         |                                | `Price[]` | `undefined` |
| `product`         | `product`  | The product id for the fields. | `string`  | `undefined` |
| `selectedProduct` | --         |                                | `Product` | `undefined` |


## Events

| Event              | Description            | Type                             |
| ------------------ | ---------------------- | -------------------------------- |
| `scChange`         |                        | `CustomEvent<boolean \| string>` |
| `scUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>`      |


## Dependencies

### Used by

 - [sc-donation-choices-new](../donation-choices-new)

### Depends on

- [sc-skeleton](../../../ui/skeleton)
- [sc-choices](../../../ui/choices)
- [sc-recurring-price-choice-container](../../../ui/sc-recurring-price-choice-container)
- [sc-choice](../../../ui/choice)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-donation-recurring-choices-new --> sc-skeleton
  sc-donation-recurring-choices-new --> sc-choices
  sc-donation-recurring-choices-new --> sc-recurring-price-choice-container
  sc-donation-recurring-choices-new --> sc-choice
  sc-donation-recurring-choices-new --> sc-block-ui
  sc-choices --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-recurring-price-choice-container --> sc-format-number
  sc-recurring-price-choice-container --> sc-choice-container
  sc-recurring-price-choice-container --> sc-dropdown
  sc-recurring-price-choice-container --> sc-button
  sc-recurring-price-choice-container --> sc-menu
  sc-recurring-price-choice-container --> sc-menu-item
  sc-recurring-price-choice-container --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-donation-choices-new --> sc-donation-recurring-choices-new
  style sc-donation-recurring-choices-new fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
