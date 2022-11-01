# sc-order-manual-instructions



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                     | Description | Type     | Default     |
| --------------------------- | ----------------------------- | ----------- | -------- | ----------- |
| `manualPaymentInstructions` | `manual-payment-instructions` |             | `string` | `undefined` |
| `manualPaymentTitle`        | `manual-payment-title`        |             | `string` | `undefined` |


## Dependencies

### Used by

 - [sc-order-confirm-components-validator](../../../providers/sc-order-confirm-components-validator)

### Depends on

- [sc-alert](../../../ui/alert)

### Graph
```mermaid
graph TD;
  sc-order-manual-instructions --> sc-alert
  sc-alert --> sc-icon
  sc-order-confirm-components-validator --> sc-order-manual-instructions
  style sc-order-manual-instructions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
