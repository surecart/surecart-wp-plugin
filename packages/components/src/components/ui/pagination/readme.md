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
| `ceNextPage` |             | `CustomEvent<void>` |
| `cePrevPage` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [ce-charges-list](../../controllers/dashboard/charges-list)
 - [ce-downloads-list](../../controllers/dashboard/downloads-list)
 - [ce-invoices-list](../../controllers/dashboard/invoices-list)
 - [ce-orders-list](../../controllers/dashboard/orders-list)
 - [ce-subscriptions-list](../../controllers/dashboard/subscriptions-list)

### Depends on

- [ce-flex](../flex)
- [ce-button](../button)

### Graph
```mermaid
graph TD;
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  ce-button --> ce-spinner
  ce-charges-list --> ce-pagination
  ce-downloads-list --> ce-pagination
  ce-invoices-list --> ce-pagination
  ce-orders-list --> ce-pagination
  ce-subscriptions-list --> ce-pagination
  style ce-pagination fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
