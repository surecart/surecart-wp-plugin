# ce-order-confirmation-totals



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type       | Default     |
| -------- | --------- | ----------- | ---------- | ----------- |
| `order`  | --        |             | `Checkout` | `undefined` |


## Dependencies

### Used by

 - [sc-order-confirmation-details](../order-confirmation-details)

### Depends on

- [sc-line-item](../../../ui/line-item)
- [sc-tag](../../../ui/tag)
- [sc-format-number](../../../util/format-number)
- [sc-line-item-total](../../checkout-form/line-item-total)
- [sc-divider](../../../ui/divider)

### Graph
```mermaid
graph TD;
  sc-order-confirmation-totals --> sc-line-item
  sc-order-confirmation-totals --> sc-tag
  sc-order-confirmation-totals --> sc-format-number
  sc-order-confirmation-totals --> sc-line-item-total
  sc-order-confirmation-totals --> sc-divider
  sc-line-item-total --> sc-line-item
  sc-line-item-total --> sc-skeleton
  sc-line-item-total --> sc-total
  sc-line-item-total --> sc-format-number
  sc-total --> sc-format-number
  sc-order-confirmation-details --> sc-order-confirmation-totals
  style sc-order-confirmation-totals fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
