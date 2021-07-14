# ce-payment



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                | Description | Type     | Default     |
| ---------------------- | ------------------------ | ----------- | -------- | ----------- |
| `paymentMethod`        | `payment-method`         |             | `string` | `'stripe'`  |
| `stripePublishableKey` | `stripe-publishable-key` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [ce-stripe-element](../../ui/stripe-element)

### Graph
```mermaid
graph TD;
  ce-payment --> ce-stripe-element
  ce-stripe-element --> ce-input
  ce-input --> ce-form-control
  style ce-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
