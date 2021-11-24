# ce-payment-request



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type                   | Default     |
| ----------- | ----------- | ----------- | ---------------------- | ----------- |
| `processor` | `processor` |             | `"paypal" \| "stripe"` | `undefined` |


## Dependencies

### Depends on

- [ce-stripe-payment-request](../../ui/stripe-payment-request)
- [ce-divider](../../ui/divider)

### Graph
```mermaid
graph TD;
  ce-payment-request --> ce-stripe-payment-request
  ce-payment-request --> ce-divider
  style ce-payment-request fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
