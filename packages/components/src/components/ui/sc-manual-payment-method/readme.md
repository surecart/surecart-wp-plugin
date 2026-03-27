# sc-manual-payment-method



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type                  | Default     |
| ----------------- | ------------------ | ----------- | --------------------- | ----------- |
| `paymentMethod`   | --                 |             | `ManualPaymentMethod` | `undefined` |
| `showDescription` | `show-description` |             | `boolean`             | `false`     |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"card"` |             |


## Dependencies

### Used by

 - [sc-subscription-next-payment](../../controllers/dashboard/subscription-details)
 - [sc-subscription-payment](../../controllers/dashboard/subscription-payment)
 - [sc-subscription-payment-method](../../controllers/dashboard/sc-subscription-payment-method)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)

### Depends on

- [sc-prose](../sc-prose)

### Graph
```mermaid
graph TD;
  sc-manual-payment-method --> sc-prose
  sc-subscription-next-payment --> sc-manual-payment-method
  sc-subscription-payment --> sc-manual-payment-method
  sc-subscription-payment-method --> sc-manual-payment-method
  sc-upcoming-invoice --> sc-manual-payment-method
  style sc-manual-payment-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
