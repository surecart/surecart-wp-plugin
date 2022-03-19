# ce-payment-request



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                   | Default     |
| ------------- | -------------- | ----------- | ---------------------- | ----------- |
| `busy`        | `busy`         |             | `boolean`              | `undefined` |
| `debug`       | `debug`        |             | `boolean`              | `undefined` |
| `dividerText` | `divider-text` |             | `string`               | `undefined` |
| `formId`      | `form-id`      |             | `number \| string`     | `undefined` |
| `order`       | --             |             | `Order`                | `undefined` |
| `processor`   | `processor`    |             | `"paypal" \| "stripe"` | `undefined` |


## Dependencies

### Depends on

- [ce-stripe-payment-request](../../../ui/stripe-payment-request)
- [ce-divider](../../../ui/divider)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-express-payment --> ce-stripe-payment-request
  ce-express-payment --> ce-divider
  ce-express-payment --> ce-block-ui
  ce-stripe-payment-request --> ce-alert
  ce-alert --> ce-icon
  ce-block-ui --> ce-spinner
  style ce-express-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
