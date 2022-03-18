# ce-order-confirmation-line-items



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type      | Default     |
| --------- | --------- | ----------- | --------- | ----------- |
| `loading` | `loading` |             | `boolean` | `undefined` |
| `order`   | --        |             | `Order`   | `undefined` |


## Shadow Parts

| Part           | Description |
| -------------- | ----------- |
| `"line-items"` |             |


## Dependencies

### Depends on

- [ce-line-item](../../../ui/line-item)
- [ce-skeleton](../../../ui/skeleton)
- [ce-product-line-item](../../../ui/product-line-item)

### Graph
```mermaid
graph TD;
  ce-order-confirmation-line-items --> ce-line-item
  ce-order-confirmation-line-items --> ce-skeleton
  ce-order-confirmation-line-items --> ce-product-line-item
  ce-product-line-item --> ce-format-number
  ce-product-line-item --> ce-line-item
  ce-product-line-item --> ce-quantity-select
  ce-quantity-select --> ce-dropdown
  ce-quantity-select --> ce-menu
  ce-quantity-select --> ce-menu-item
  style ce-order-confirmation-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
