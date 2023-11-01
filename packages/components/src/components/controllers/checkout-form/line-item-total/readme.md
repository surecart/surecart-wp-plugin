# ce-line-item-total



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type                    | Default     |
| --------- | --------- | ----------- | ----------------------- | ----------- |
| `loading` | `loading` |             | `boolean`               | `undefined` |
| `order`   | --        |             | `Checkout`              | `undefined` |
| `size`    | `size`    |             | `"large" \| "medium"`   | `undefined` |
| `total`   | `total`   |             | `"subtotal" \| "total"` | `'total'`   |


## Dependencies

### Used by

 - [sc-order-confirmation-totals](../../confirmation/order-confirmation-totals)

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-total](../total)
- [sc-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-line-item-total --> sc-line-item
  sc-line-item-total --> sc-skeleton
  sc-line-item-total --> sc-total
  sc-line-item-total --> sc-format-number
  sc-total --> sc-format-number
  sc-order-confirmation-totals --> sc-line-item-total
  style sc-line-item-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
