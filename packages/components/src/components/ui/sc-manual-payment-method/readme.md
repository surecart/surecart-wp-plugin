# sc-manual-payment-method



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute | Description | Type                  | Default     |
| --------------- | --------- | ----------- | --------------------- | ----------- |
| `paymentMethod` | --        |             | `ManualPaymentMethod` | `undefined` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"card"` |             |


## Dependencies

### Used by

 - [sc-subscription-payment](../../controllers/dashboard/subscription-payment)
 - [sc-subscription-payment-method](../../controllers/dashboard/sc-subscription-payment-method)

### Depends on

- [sc-text](../text)

### Graph
```mermaid
graph TD;
  sc-manual-payment-method --> sc-text
  sc-subscription-payment --> sc-manual-payment-method
  sc-subscription-payment-method --> sc-manual-payment-method
  style sc-manual-payment-method fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
