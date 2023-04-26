# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description             | Type                                  | Default                                |
| --------- | ---------- | ----------------------- | ------------------------------------- | -------------------------------------- |
| `allLink` | `all-link` |                         | `string`                              | `undefined`                            |
| `heading` | `heading`  |                         | `string`                              | `undefined`                            |
| `query`   | --         | Query to fetch invoices | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |


## Dependencies

### Depends on

- [sc-tag](../../../ui/tag)
- [sc-order-status-badge](../../../ui/order-status-badge)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-divider](../../../ui/divider)
- [sc-empty](../../../ui/empty)
- [sc-format-date](../../../util/format-date)
- [sc-text](../../../ui/text)
- [sc-format-number](../../../util/format-number)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-pagination](../../../ui/pagination)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-invoices-list --> sc-tag
  sc-invoices-list --> sc-order-status-badge
  sc-invoices-list --> sc-card
  sc-invoices-list --> sc-stacked-list
  sc-invoices-list --> sc-stacked-list-row
  sc-invoices-list --> sc-skeleton
  sc-invoices-list --> sc-divider
  sc-invoices-list --> sc-empty
  sc-invoices-list --> sc-format-date
  sc-invoices-list --> sc-text
  sc-invoices-list --> sc-format-number
  sc-invoices-list --> sc-dashboard-module
  sc-invoices-list --> sc-button
  sc-invoices-list --> sc-icon
  sc-invoices-list --> sc-pagination
  sc-invoices-list --> sc-block-ui
  sc-order-status-badge --> sc-tag
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-block-ui --> sc-spinner
  style sc-invoices-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
