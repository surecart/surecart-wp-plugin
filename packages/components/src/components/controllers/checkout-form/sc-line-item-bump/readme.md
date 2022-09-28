# sc-line-item-bump



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type       | Default     |
| --------- | --------- | ----------- | ---------- | ----------- |
| `label`   | `label`   |             | `string`   | `undefined` |
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
  sc-line-item-bump --> sc-line-item
  sc-line-item-bump --> sc-format-number
  sc-form-components-validator --> sc-line-item-bump
  style sc-line-item-bump fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
