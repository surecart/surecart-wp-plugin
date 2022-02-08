# ce-order-summary



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type      | Default     |
| ------------- | ------------- | ----------- | --------- | ----------- |
| `collapsed`   | `collapsed`   |             | `boolean` | `undefined` |
| `collapsible` | `collapsible` |             | `boolean` | `false`     |
| `empty`       | `empty`       |             | `boolean` | `undefined` |
| `loading`     | `loading`     |             | `boolean` | `undefined` |
| `order`       | --            |             | `Order`   | `undefined` |


## Dependencies

### Depends on

- [ce-line-item](../../ui/line-item)
- [ce-skeleton](../../ui/skeleton)
- [ce-total](../total)

### Graph
```mermaid
graph TD;
  ce-order-summary --> ce-line-item
  ce-order-summary --> ce-skeleton
  ce-order-summary --> ce-total
  ce-total --> ce-format-number
  style ce-order-summary fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
