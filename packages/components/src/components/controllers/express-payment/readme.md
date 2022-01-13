# ce-payment-request



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                   | Default     |
| ------------- | -------------- | ----------- | ---------------------- | ----------- |
| `dividerText` | `divider-text` |             | `string`               | `undefined` |
| `formId`      | `form-id`      |             | `number \| string`     | `undefined` |
| `order`       | --             |             | `Order`                | `undefined` |
| `processor`   | `processor`    |             | `"paypal" \| "stripe"` | `undefined` |


## Dependencies

### Depends on

- [ce-stripe-payment-request](../../ui/stripe-payment-request)
- [ce-divider](../../ui/divider)

### Graph
```mermaid
graph TD;
  ce-express-payment --> ce-stripe-payment-request
  ce-express-payment --> ce-divider
  style ce-express-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
