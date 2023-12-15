# sc-price-choice-container



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute      | Description                       | Type      | Default     |
| --------------- | -------------- | --------------------------------- | --------- | ----------- |
| `label`         | `label`        | Label for the choice.             | `string`  | `undefined` |
| `prices`        | --             | The prices to choose from.        | `Price[]` | `undefined` |
| `product`       | --             | The product.                      | `Product` | `undefined` |
| `selectedPrice` | --             | The currently selected price      | `Price`   | `undefined` |
| `showAmount`    | `show-amount`  | Should we show the price?         | `boolean` | `true`      |
| `showControl`   | `show-control` | Show the radio/checkbox control   | `boolean` | `false`     |
| `showDetails`   | `show-details` | Should we show the price details? | `boolean` | `true`      |


## Events

| Event      | Description   | Type                  |
| ---------- | ------------- | --------------------- |
| `scChange` | Change event. | `CustomEvent<string>` |


## Dependencies

### Used by

 - [sc-product-donation-choices](../../controllers/checkout-form/product-donation-choices)
 - [sc-product-price-choices](../../controllers/product/sc-product-price-choices)

### Depends on

- [sc-format-number](../../util/format-number)
- [sc-choice-container](../choice-container)
- [sc-dropdown](../dropdown)
- [sc-icon](../icon)
- [sc-menu](../menu)
- [sc-menu-item](../menu-item)

### Graph
```mermaid
graph TD;
  sc-recurring-price-choice-container --> sc-format-number
  sc-recurring-price-choice-container --> sc-choice-container
  sc-recurring-price-choice-container --> sc-dropdown
  sc-recurring-price-choice-container --> sc-icon
  sc-recurring-price-choice-container --> sc-menu
  sc-recurring-price-choice-container --> sc-menu-item
  sc-product-donation-choices --> sc-recurring-price-choice-container
  sc-product-price-choices --> sc-recurring-price-choice-container
  style sc-recurring-price-choice-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
