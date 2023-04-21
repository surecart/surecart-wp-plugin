# sc-shipping-amount



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description               | Type       | Default     |
| --------- | --------- | ------------------------- | ---------- | ----------- |
| `label`   | `label`   | Label                     | `string`   | `undefined` |
| `loading` | `loading` | Whether parent is loading | `boolean`  | `undefined` |
| `order`   | --        | The order                 | `Checkout` | `undefined` |


## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-line-item-shipping --> sc-line-item
  sc-line-item-shipping --> sc-skeleton
  sc-line-item-shipping --> sc-format-number
  sc-form-components-validator --> sc-line-item-shipping
  style sc-line-item-shipping fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
