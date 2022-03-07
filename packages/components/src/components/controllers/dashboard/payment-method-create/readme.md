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

- [ce-card](../../../ui/card)
- [ce-form](../../../ui/form)
- [ce-alert](../../../ui/alert)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-payment-method-create --> ce-card
  ce-payment-method-create --> ce-form
  ce-payment-method-create --> ce-alert
  ce-payment-method-create --> ce-button
  ce-payment-method-create --> ce-block-ui
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-payment-method-create fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
