# sc-products-pagination



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default     |
| ------------- | -------------- | ----------- | -------- | ----------- |
| `currentPage` | `current-page` |             | `number` | `undefined` |
| `totalPages`  | `total-pages`  |             | `number` | `undefined` |


## Events

| Event         | Description | Type                  |
| ------------- | ----------- | --------------------- |
| `scPageClick` |             | `CustomEvent<number>` |


## Dependencies

### Used by

 - [sc-product-item-list](../sc-product-item-list)

### Depends on

- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)

### Graph
```mermaid
graph TD;
  sc-products-pagination --> sc-button
  sc-products-pagination --> sc-icon
  sc-button --> sc-spinner
  sc-product-item-list --> sc-products-pagination
  style sc-products-pagination fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
