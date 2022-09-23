# ce-line-item-tax



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type       | Default     |
| --------- | --------- | ----------- | ---------- | ----------- |
| `loading` | `loading` |             | `boolean`  | `undefined` |
| `order`   | --        |             | `Checkout` | `undefined` |


## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-line-item-tax --> sc-line-item
  sc-line-item-tax --> sc-format-number
  sc-form-components-validator --> sc-line-item-tax
  style sc-line-item-tax fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
