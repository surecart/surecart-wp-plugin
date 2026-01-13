# ce-line-item-total



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type                    | Default     |
| ---------- | --------- | ----------- | ----------------------- | ----------- |
| `checkout` | --        |             | `Checkout`              | `undefined` |
| `size`     | `size`    |             | `"large" \| "medium"`   | `undefined` |
| `total`    | `total`   |             | `"subtotal" \| "total"` | `'total'`   |


## Dependencies

### Depends on

- [sc-divider](../../../ui/divider)
- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-total](../total)
- [sc-tooltip](../../../ui/tooltip)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-line-item-total --> sc-divider
  sc-line-item-total --> sc-line-item
  sc-line-item-total --> sc-skeleton
  sc-line-item-total --> sc-total
  sc-line-item-total --> sc-tooltip
  sc-line-item-total --> sc-icon
  style sc-line-item-total fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
