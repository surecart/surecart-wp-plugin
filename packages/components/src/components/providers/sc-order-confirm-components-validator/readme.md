# sc-order-confirm-components-validator



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description  | Type       | Default     |
| ---------- | --------- | ------------ | ---------- | ----------- |
| `checkout` | --        | The checkout | `Checkout` | `undefined` |


## Dependencies

### Used by

 - [sc-order-confirmation](../../controllers/confirmation/order-confirmation)

### Depends on

- [sc-order-manual-instructions](../../controllers/confirmation/manual-instructions)

### Graph
```mermaid
graph TD;
  sc-order-confirm-components-validator --> sc-order-manual-instructions
  sc-order-manual-instructions --> sc-alert
  sc-alert --> sc-icon
  sc-order-confirmation --> sc-order-confirm-components-validator
  style sc-order-confirm-components-validator fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
