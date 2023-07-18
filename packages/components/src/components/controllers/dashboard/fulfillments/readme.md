# sc-fulfillments



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default     |
| --------- | ---------- | ----------- | -------- | ----------- |
| `heading` | `heading`  |             | `string` | `undefined` |
| `orderId` | `order-id` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [sc-flex](../../../ui/flex)
- [sc-skeleton](../../../ui/skeleton)
- [sc-spacing](../../../ui/spacing)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-fulfillment-shipping-status-badge](../../../ui/fulfillment-shipping-status-badge)
- [sc-icon](../../../ui/icon)
- [sc-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  sc-fulfillments --> sc-flex
  sc-fulfillments --> sc-skeleton
  sc-fulfillments --> sc-spacing
  sc-fulfillments --> sc-dashboard-module
  sc-fulfillments --> sc-card
  sc-fulfillments --> sc-stacked-list
  sc-fulfillments --> sc-stacked-list-row
  sc-fulfillments --> sc-fulfillment-shipping-status-badge
  sc-fulfillments --> sc-icon
  sc-fulfillments --> sc-format-number
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-fulfillment-shipping-status-badge --> sc-tag
  style sc-fulfillments fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
