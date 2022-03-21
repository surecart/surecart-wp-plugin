# ce-payment-method-create



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `clientSecret` | `client-secret` |             | `string` | `undefined` |
| `error`        | `error`         |             | `string` | `undefined` |
| `successUrl`   | `success-url`   |             | `string` | `undefined` |


## Dependencies

### Depends on

- [sc-card](../../../ui/card)
- [sc-form](../../../ui/form)
- [sc-alert](../../../ui/alert)
- [sc-button](../../../ui/button)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-payment-method-create --> sc-card
  sc-payment-method-create --> sc-form
  sc-payment-method-create --> sc-alert
  sc-payment-method-create --> sc-button
  sc-payment-method-create --> sc-block-ui
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  style sc-payment-method-create fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
