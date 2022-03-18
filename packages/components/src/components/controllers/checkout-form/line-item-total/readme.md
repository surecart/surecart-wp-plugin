# ce-line-item-total



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                    | Default     |
| -------------- | --------------- | ----------- | ----------------------- | ----------- |
| `loading`      | `loading`       |             | `boolean`               | `undefined` |
| `order`        | --              |             | `Order`                 | `undefined` |
| `showCurrency` | `show-currency` |             | `boolean`               | `undefined` |
| `size`         | `size`          |             | `"large" \| "medium"`   | `undefined` |
| `total`        | `total`         |             | `"subtotal" \| "total"` | `'total'`   |


## Dependencies

### Used by

 - [ce-order-confirmation-totals](../../confirmation/order-confirmation-totals)

### Depends on

- [ce-line-item](../../../ui/line-item)
- [ce-skeleton](../../../ui/skeleton)
- [ce-total](../total)
- [ce-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  ce-line-item-total --> ce-line-item
  ce-line-item-total --> ce-skeleton
  ce-line-item-total --> ce-total
  ce-line-item-total --> ce-format-number
  ce-total --> ce-format-number
  ce-order-confirmation-totals --> ce-line-item-total
  style ce-line-item-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
