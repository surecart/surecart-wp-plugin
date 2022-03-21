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

- [sc-line-item](../../../ui/line-item)
- [sc-skeleton](../../../ui/skeleton)
- [sc-product-line-item](../../../ui/product-line-item)

### Graph
```mermaid
graph TD;
  sc-order-confirmation-line-items --> sc-line-item
  sc-order-confirmation-line-items --> sc-skeleton
  sc-order-confirmation-line-items --> sc-product-line-item
  sc-product-line-item --> sc-format-number
  sc-product-line-item --> sc-line-item
  sc-product-line-item --> sc-quantity-select
  sc-quantity-select --> sc-dropdown
  sc-quantity-select --> sc-menu
  sc-quantity-select --> sc-menu-item
  style sc-order-confirmation-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
