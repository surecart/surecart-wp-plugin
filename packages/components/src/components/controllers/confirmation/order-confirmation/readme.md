# ce-order-confirmation



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type       | Default     |
| -------- | --------- | ----------- | ---------- | ----------- |
| `order`  | --        |             | `Checkout` | `undefined` |


## Dependencies

### Depends on

- [sc-alert](../../../ui/alert)
- [sc-order-confirm-components-validator](../../../providers/sc-order-confirm-components-validator)
- [sc-heading](../../../ui/heading)

### Graph
```mermaid
graph TD;
  sc-order-confirmation --> sc-alert
  sc-order-confirmation --> sc-order-confirm-components-validator
  sc-order-confirmation --> sc-heading
  sc-alert --> sc-icon
  sc-order-confirm-components-validator --> sc-order-manual-instructions
  sc-order-manual-instructions --> sc-alert
  style sc-order-confirmation fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
