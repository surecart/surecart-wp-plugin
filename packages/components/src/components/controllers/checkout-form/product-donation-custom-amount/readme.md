# sc-custom-donation-amount



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                           | Type     | Default     |
| -------------- | --------------- | ------------------------------------- | -------- | ----------- |
| `currencyCode` | `currency-code` | Currency code for the donation.       | `string` | `'usd'`     |
| `productId`    | `product-id`    | Selected Product Id for the donation. | `string` | `undefined` |
| `value`        | `value`         | Custom Amount of the donation.        | `number` | `undefined` |


## Dependencies

### Depends on

- [sc-choice-container](../../../ui/choice-container)
- [sc-form](../../../ui/form)
- [sc-price-input](../../../ui/price-input)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-product-donation-custom-amount --> sc-choice-container
  sc-product-donation-custom-amount --> sc-form
  sc-product-donation-custom-amount --> sc-price-input
  sc-product-donation-custom-amount --> sc-button
  sc-product-donation-custom-amount --> sc-icon
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  style sc-product-donation-custom-amount fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
