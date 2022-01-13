# ce-session-subscription



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

- [ce-line-item](../../ui/line-item)
- [ce-skeleton](../../ui/skeleton)
- [ce-product-line-item](../../ui/product-line-item)
- [ce-subscription-status-badge](../../ui/subscription-status-badge)
- [ce-format-number](../../util/format-number)
- [ce-divider](../../ui/divider)
- [ce-card](../../ui/card)
- [ce-tag](../../ui/tag)

### Graph
```mermaid
graph TD;
  ce-session-subscription --> ce-line-item
  ce-session-subscription --> ce-skeleton
  ce-session-subscription --> ce-product-line-item
  ce-session-subscription --> ce-subscription-status-badge
  ce-session-subscription --> ce-format-number
  ce-session-subscription --> ce-divider
  ce-session-subscription --> ce-card
  ce-session-subscription --> ce-tag
  ce-product-line-item --> ce-format-number
  ce-product-line-item --> ce-line-item
  ce-product-line-item --> ce-quantity-select
  ce-quantity-select --> ce-dropdown
  ce-quantity-select --> ce-menu
  ce-quantity-select --> ce-menu-item
  ce-subscription-status-badge --> ce-tag
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  style ce-session-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
