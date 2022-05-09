# ce-order-summary



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type      | Default                          |
| ------------- | ------------- | ----------- | --------- | -------------------------------- |
| `closedText`  | `closed-text` |             | `string`  | `__('Show Summary', 'surecart')` |
| `collapsed`   | `collapsed`   |             | `boolean` | `undefined`                      |
| `collapsible` | `collapsible` |             | `boolean` | `false`                          |
| `empty`       | `empty`       |             | `boolean` | `undefined`                      |
| `loading`     | `loading`     |             | `boolean` | `undefined`                      |
| `openText`    | `open-text`   |             | `string`  | `__('Summary', 'surecart')`      |
| `order`       | --            |             | `Order`   | `undefined`                      |


## Dependencies

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-total](../total)

### Graph
```mermaid
graph TD;
  sc-order-summary --> sc-line-item
  sc-order-summary --> sc-skeleton
  sc-order-summary --> sc-total
  sc-total --> sc-format-number
  style sc-order-summary fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
