# sc-order-bumps



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type       | Default     |
| ---------- | --------- | ----------- | ---------- | ----------- |
| `bumps`    | --        |             | `Bump[]`   | `undefined` |
| `checkout` | --        |             | `Checkout` | `undefined` |
| `help`     | `help`    |             | `string`   | `undefined` |
| `label`    | `label`   |             | `string`   | `undefined` |


## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-form-control](../../../ui/form-control)
- [sc-order-bump](../sc-order-bump)

### Graph
```mermaid
graph TD;
  sc-order-bumps --> sc-form-control
  sc-order-bumps --> sc-order-bump
  sc-form-control --> sc-tooltip
  sc-order-bump --> sc-format-number
  sc-order-bump --> sc-choice
  sc-order-bump --> sc-divider
  sc-form-components-validator --> sc-order-bumps
  style sc-order-bumps fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
