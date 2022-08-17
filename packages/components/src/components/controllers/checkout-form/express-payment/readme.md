# ce-payment-request



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type                   | Default     |
| ------------------- | --------------------- | ----------- | ---------------------- | ----------- |
| `busy`              | `busy`                |             | `boolean`              | `undefined` |
| `debug`             | `debug`               |             | `boolean`              | `undefined` |
| `dividerText`       | `divider-text`        |             | `string`               | `undefined` |
| `formId`            | `form-id`             |             | `number \| string`     | `undefined` |
| `hasPaymentOptions` | `has-payment-options` |             | `boolean`              | `undefined` |
| `order`             | --                    |             | `Checkout`             | `undefined` |
| `processor`         | `processor`           |             | `"paypal" \| "stripe"` | `undefined` |


## Dependencies

### Depends on

- [sc-stripe-payment-request](../../../ui/stripe-payment-request)
- [sc-divider](../../../ui/divider)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-express-payment --> sc-stripe-payment-request
  sc-express-payment --> sc-divider
  sc-express-payment --> sc-block-ui
  sc-stripe-payment-request --> sc-alert
  sc-alert --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-express-payment fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
