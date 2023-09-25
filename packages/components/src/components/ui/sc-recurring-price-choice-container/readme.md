# sc-price-choice-container



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description                     | Type                    | Default     |
| ------------------ | -------------------- | ------------------------------- | ----------------------- | ----------- |
| `label`            | `label`              | Label for the choice.           | `string`                | `undefined` |
| `prices`           | --                   |                                 | `Price[]`               | `undefined` |
| `product`          | --                   |                                 | `Product`               | `undefined` |
| `selectedPrice`    | --                   |                                 | `Price`                 | `undefined` |
| `showControl`      | `show-control`       | Show the radio/checkbox control | `boolean`               | `false`     |
| `showPrice`        | `show-price`         |                                 | `boolean`               | `true`      |
| `showPriceDetails` | `show-price-details` |                                 | `boolean`               | `true`      |
| `type`             | `type`               | Choice Type                     | `"checkbox" \| "radio"` | `undefined` |


## Events

| Event      | Description | Type                  |
| ---------- | ----------- | --------------------- |
| `scChange` |             | `CustomEvent<string>` |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"checked-icon"` |             |
| `"label"`        |             |


## Dependencies

### Used by

 - [sc-donation-recurring-choices](../../controllers/checkout-form/donation-recurring-choices)
 - [sc-product-price-choices](../../controllers/product/sc-product-price-choices)

### Depends on

- [sc-format-number](../../util/format-number)
- [sc-choice-container](../choice-container)
- [sc-dropdown](../dropdown)
- [sc-button](../button)
- [sc-menu](../menu)
- [sc-menu-item](../menu-item)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-recurring-price-choice-container --> sc-format-number
  sc-recurring-price-choice-container --> sc-choice-container
  sc-recurring-price-choice-container --> sc-dropdown
  sc-recurring-price-choice-container --> sc-button
  sc-recurring-price-choice-container --> sc-menu
  sc-recurring-price-choice-container --> sc-menu-item
  sc-recurring-price-choice-container --> sc-icon
  sc-button --> sc-spinner
  sc-donation-recurring-choices --> sc-recurring-price-choice-container
  sc-product-price-choices --> sc-recurring-price-choice-container
  style sc-recurring-price-choice-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
