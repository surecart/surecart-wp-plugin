# sc-payment-method



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute | Description | Type            | Default     |
| --------------- | --------- | ----------- | --------------- | ----------- |
| `paymentMethod` | --        |             | `PaymentMethod` | `undefined` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


## Dependencies

### Used by

 - [sc-order](../../controllers/dashboard/order)
 - [sc-payment-methods-list](../../controllers/dashboard/payment-methods-list)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [sc-tag](../tag)
- [sc-cc-logo](../cc-logo)
- [sc-tooltip](../tooltip)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-payment-method --> sc-tag
  sc-payment-method --> sc-cc-logo
  sc-payment-method --> sc-tooltip
  sc-payment-method --> sc-icon
  sc-cc-logo --> sc-icon
  sc-order --> sc-payment-method
  sc-payment-methods-list --> sc-payment-method
  sc-upcoming-invoice --> sc-payment-method
  style sc-payment-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
