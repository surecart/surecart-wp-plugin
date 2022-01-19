# ce-customer-order



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default     |
| --------- | ---------- | ----------- | -------- | ----------- |
| `orderId` | `order-id` |             | `string` | `undefined` |


## Shadow Parts

| Part           | Description |
| -------------- | ----------- |
| `"line-items"` |             |


## Dependencies

### Depends on

- [ce-tag](../../../ui/tag)
- [ce-skeleton](../../../ui/skeleton)
- [ce-format-number](../../../util/format-number)
- [ce-order-status-badge](../../../ui/order-status-badge)
- [ce-format-date](../../../util/format-date)
- [ce-card](../../../ui/card)
- [ce-product-line-item](../../../ui/product-line-item)
- [ce-divider](../../../ui/divider)
- [ce-spacing](../../../ui/spacing)
- [ce-line-item](../../../ui/line-item)

### Graph
```mermaid
graph TD;
  ce-customer-order --> ce-tag
  ce-customer-order --> ce-skeleton
  ce-customer-order --> ce-format-number
  ce-customer-order --> ce-order-status-badge
  ce-customer-order --> ce-format-date
  ce-customer-order --> ce-card
  ce-customer-order --> ce-product-line-item
  ce-customer-order --> ce-divider
  ce-customer-order --> ce-spacing
  ce-customer-order --> ce-line-item
  ce-order-status-badge --> ce-tag
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-product-line-item --> ce-format-number
  ce-product-line-item --> ce-line-item
  ce-product-line-item --> ce-quantity-select
  ce-quantity-select --> ce-dropdown
  ce-quantity-select --> ce-menu
  ce-quantity-select --> ce-menu-item
  style ce-customer-order fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
