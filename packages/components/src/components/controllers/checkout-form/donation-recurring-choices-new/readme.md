# sc-donation-recurring-choices-new



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute        | Description                               | Type         | Default     |
| ----------------- | ---------------- | ----------------------------------------- | ------------ | ----------- |
| `busy`            | `busy`           |                                           | `boolean`    | `undefined` |
| `currencyCode`    | `currency-code`  | Currency code for the donation.           | `string`     | `'usd'`     |
| `defaultAmount`   | `default-amount` | The default amount to load the page with. | `string`     | `undefined` |
| `label`           | `label`          | The label for the field.                  | `string`     | `undefined` |
| `lineItems`       | --               | Order line items.                         | `LineItem[]` | `[]`        |
| `loading`         | `loading`        | Is this loading                           | `boolean`    | `undefined` |
| `priceId`         | `price-id`       | The price id for the fields.              | `string`     | `undefined` |
| `prices`          | --               |                                           | `Price[]`    | `undefined` |
| `product`         | `product`        | The product id for the fields.            | `string`     | `undefined` |
| `removeInvalid`   | `remove-invalid` |                                           | `boolean`    | `true`      |
| `selectedProduct` | --               |                                           | `Product`    | `undefined` |


## Events

| Event              | Description            | Type                        |
| ------------------ | ---------------------- | --------------------------- |
| `scAddLineItem`    | Toggle line item event | `CustomEvent<LineItemData>` |
| `scRemoveLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |
| `scUpdateLineItem` | Toggle line item event | `CustomEvent<LineItemData>` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

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
  style sc-donation-recurring-choices-new fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
