# sc-custom-donation-amount



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                     | Type     | Default     |
| -------------- | --------------- | ------------------------------- | -------- | ----------- |
| `currencyCode` | `currency-code` | Currency code for the donation. | `string` | `'usd'`     |
| `value`        | `value`         | Custom Amount of the donation.  | `string` | `undefined` |


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
  sc-custom-donation-amount --> sc-choice-container
  sc-custom-donation-amount --> sc-form
  sc-custom-donation-amount --> sc-price-input
  sc-custom-donation-amount --> sc-button
  sc-custom-donation-amount --> sc-icon
  sc-price-input --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-button --> sc-spinner
  style sc-custom-donation-amount fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
