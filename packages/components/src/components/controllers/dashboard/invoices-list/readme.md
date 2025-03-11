# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description             | Type                                  | Default                                |
| ------------ | ------------- | ----------------------- | ------------------------------------- | -------------------------------------- |
| `allLink`    | `all-link`    |                         | `string`                              | `undefined`                            |
| `heading`    | `heading`     |                         | `string`                              | `undefined`                            |
| `isCustomer` | `is-customer` |                         | `boolean`                             | `undefined`                            |
| `query`      | --            | Query to fetch invoices | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |


## Dependencies

### Depends on

- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-divider](../../../ui/divider)
- [sc-empty](../../../ui/empty)
- [sc-invoice-status-badge](../../../ui/invoice-status-badge)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-pagination](../../../ui/pagination)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-invoices-list --> sc-card
  sc-invoices-list --> sc-stacked-list
  sc-invoices-list --> sc-stacked-list-row
  sc-invoices-list --> sc-skeleton
  sc-invoices-list --> sc-divider
  sc-invoices-list --> sc-empty
  sc-invoices-list --> sc-invoice-status-badge
  sc-invoices-list --> sc-dashboard-module
  sc-invoices-list --> sc-button
  sc-invoices-list --> sc-icon
  sc-invoices-list --> sc-pagination
  sc-invoices-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-invoice-status-badge --> sc-tag
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-pagination --> sc-visually-hidden
  sc-pagination --> sc-icon
  sc-block-ui --> sc-spinner
  style sc-invoices-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
