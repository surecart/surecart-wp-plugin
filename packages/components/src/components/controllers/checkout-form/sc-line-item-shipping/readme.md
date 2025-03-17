# sc-shipping-amount



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `label`  | `label`   | Label       | `string` | `undefined` |


## Dependencies

### Used by

 - [sc-form-components-validator](../../../providers/form-components-validator)

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)

### Graph
```mermaid
graph TD;
  sc-line-item-shipping --> sc-line-item
  sc-line-item-shipping --> sc-skeleton
  sc-form-components-validator --> sc-line-item-shipping
  style sc-line-item-shipping fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
