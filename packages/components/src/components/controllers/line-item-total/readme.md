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

 - [ce-order-confirmation-totals](../order-confirmation-totals)

### Depends on

- [ce-line-item](../../ui/line-item)
- [ce-skeleton](../../ui/skeleton)
- [ce-total](../ce-total)

### Graph
```mermaid
graph TD;
  ce-line-item-total --> ce-line-item
  ce-line-item-total --> ce-skeleton
  ce-line-item-total --> ce-total
  ce-total --> ce-format-number
  ce-order-confirmation-totals --> ce-line-item-total
  style ce-line-item-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
