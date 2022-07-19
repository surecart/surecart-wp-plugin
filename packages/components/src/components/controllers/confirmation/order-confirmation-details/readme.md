# sc-order-confirmation-details



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type      | Default     |
| --------- | --------- | ----------- | --------- | ----------- |
| `loading` | `loading` |             | `boolean` | `undefined` |
| `order`   | --        |             | `Order`   | `undefined` |


## Dependencies

### Depends on

- [sc-tag](../../../ui/tag)
- [sc-order-status-badge](../../../ui/order-status-badge)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-skeleton](../../../ui/skeleton)
- [sc-card](../../../ui/card)
- [sc-line-item](../../../ui/line-item)
- [sc-divider](../../../ui/divider)
- [sc-order-confirmation-line-items](../order-confirmation-line-items)
- [sc-order-confirmation-totals](../order-confirmation-totals)

### Graph
```mermaid
graph TD;
  sc-order-confirmation-details --> sc-tag
  sc-order-confirmation-details --> sc-order-status-badge
  sc-order-confirmation-details --> sc-dashboard-module
  sc-order-confirmation-details --> sc-skeleton
  sc-order-confirmation-details --> sc-card
  sc-order-confirmation-details --> sc-line-item
  sc-order-confirmation-details --> sc-divider
  sc-order-confirmation-details --> sc-order-confirmation-line-items
  sc-order-confirmation-details --> sc-order-confirmation-totals
  sc-order-status-badge --> sc-tag
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-order-confirmation-line-items --> sc-line-item
  sc-order-confirmation-line-items --> sc-skeleton
  sc-order-confirmation-line-items --> sc-product-line-item
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-quantity-select --> sc-icon
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
  style sc-order-confirmation-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
