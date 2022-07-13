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

### Used by

 - [sc-order-confirmation-details](../order-confirmation-details)

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
  sc-product-line-item --> sc-quantity-select
  sc-product-line-item --> sc-icon
  sc-quantity-select --> sc-icon
  sc-order-confirmation-details --> sc-order-confirmation-line-items
  style sc-order-confirmation-line-items fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
