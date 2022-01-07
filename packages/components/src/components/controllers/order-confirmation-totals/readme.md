# ce-order-confirmation-totals



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute | Description | Type              | Default     |
| ----------------- | --------- | ----------- | ----------------- | ----------- |
| `order` | --        |             | `Order` | `undefined` |


## Dependencies

### Depends on

- [ce-line-item](../../ui/line-item)
- [ce-tag](../../ui/tag)
- [ce-format-number](../../util/format-number)
- [ce-line-item-total](../line-item-total)
- [ce-divider](../../ui/divider)

### Graph
```mermaid
graph TD;
  ce-order-confirmation-totals --> ce-line-item
  ce-order-confirmation-totals --> ce-tag
  ce-order-confirmation-totals --> ce-format-number
  ce-order-confirmation-totals --> ce-line-item-total
  ce-order-confirmation-totals --> ce-divider
  ce-line-item-total --> ce-line-item
  ce-line-item-total --> ce-skeleton
  ce-line-item-total --> ce-total
  ce-total --> ce-format-number
  style ce-order-confirmation-totals fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
