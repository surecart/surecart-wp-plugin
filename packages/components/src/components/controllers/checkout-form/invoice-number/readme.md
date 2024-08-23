# sc-line-item-invoice-number



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description        | Type       | Default     |
| ---------- | --------- | ------------------ | ---------- | ----------- |
| `checkout` | --        |                    | `Checkout` | `undefined` |
| `number`   | `number`  | The invoice number | `string`   | `undefined` |


## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)

### Graph
```mermaid
graph TD;
  sc-line-item-invoice-number --> sc-line-item
  sc-line-item-invoice-number --> sc-skeleton
  sc-form-components-validator --> sc-line-item-invoice-number
  style sc-line-item-invoice-number fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
