# sc-payment-method-details



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute | Description | Type            | Default     |
| --------------- | --------- | ----------- | --------------- | ----------- |
| `editHandler`   | --        |             | `() => void`    | `undefined` |
| `paymentMethod` | --        |             | `PaymentMethod` | `undefined` |


## Dependencies

### Depends on

- [sc-card](../card)
- [sc-flex](../flex)
- [sc-payment-method](../sc-payment-method)
- [sc-button](../button)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-payment-method-details --> sc-card
  sc-payment-method-details --> sc-flex
  sc-payment-method-details --> sc-payment-method
  sc-payment-method-details --> sc-button
  sc-payment-method-details --> sc-icon
  sc-payment-method --> sc-tooltip
  sc-payment-method --> sc-button
  sc-payment-method --> sc-icon
  sc-payment-method --> sc-tag
  sc-payment-method --> sc-cc-logo
  sc-payment-method --> sc-text
  sc-button --> sc-spinner
  sc-cc-logo --> sc-icon
  style sc-payment-method-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
