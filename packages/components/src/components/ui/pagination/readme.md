# ce-pagination



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default |
| -------------- | --------------- | ----------- | -------- | ------- |
| `page`         | `page`          |             | `number` | `1`     |
| `perPage`      | `per-page`      |             | `number` | `0`     |
| `total`        | `total`         |             | `number` | `0`     |
| `totalPages`   | `total-pages`   |             | `number` | `0`     |
| `totalShowing` | `total-showing` |             | `number` | `0`     |


## Events

| Event        | Description | Type                |
| ------------ | ----------- | ------------------- |
| `scNextPage` |             | `CustomEvent<void>` |
| `scPrevPage` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [sc-charges-list](../../controllers/dashboard/charges-list)
 - [sc-dashboard-downloads-list](../../controllers/dashboard/dashboard-downloads-list)
 - [sc-downloads-list](../../controllers/dashboard/sc-downloads-list)
 - [sc-invoices-list](../../controllers/dashboard/invoices-list)
 - [sc-license](../../controllers/dashboard/sc-license)
 - [sc-licenses-list](../../controllers/dashboard/sc-licenses-list)
 - [sc-orders-list](../../controllers/dashboard/orders-list)
 - [sc-product-item-list](../../controllers/products/sc-product-item-list)
 - [sc-subscriptions-list](../../controllers/dashboard/subscriptions-list)

### Depends on

- [sc-flex](../flex)
- [sc-button](../button)
- [sc-visually-hidden](../../util/visually-hidden)
- [sc-icon](../icon)

### Graph
```mermaid
graph TD;
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-pagination --> sc-visually-hidden
  sc-pagination --> sc-icon
  sc-button --> sc-spinner
  sc-charges-list --> sc-pagination
  sc-dashboard-downloads-list --> sc-pagination
  sc-downloads-list --> sc-pagination
  sc-invoices-list --> sc-pagination
  sc-license --> sc-pagination
  sc-licenses-list --> sc-pagination
  sc-orders-list --> sc-pagination
  sc-product-item-list --> sc-pagination
  sc-subscriptions-list --> sc-pagination
  style sc-pagination fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
