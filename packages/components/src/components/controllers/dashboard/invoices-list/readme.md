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

- [ce-tag](../../../ui/tag)
- [ce-order-status-badge](../../../ui/order-status-badge)
- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/stacked-list)
- [ce-stacked-list-row](../../../ui/stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-divider](../../../ui/divider)
- [ce-empty](../../../ui/empty)
- [ce-format-date](../../../util/format-date)
- [ce-text](../../../ui/text)
- [ce-format-number](../../../util/format-number)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-button](../../../ui/button)
- [ce-icon](../../../ui/icon)
- [ce-pagination](../../../ui/pagination)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-invoices-list --> ce-tag
  ce-invoices-list --> ce-order-status-badge
  ce-invoices-list --> ce-card
  ce-invoices-list --> ce-stacked-list
  ce-invoices-list --> ce-stacked-list-row
  ce-invoices-list --> ce-skeleton
  ce-invoices-list --> ce-divider
  ce-invoices-list --> ce-empty
  ce-invoices-list --> ce-format-date
  ce-invoices-list --> ce-text
  ce-invoices-list --> ce-format-number
  ce-invoices-list --> ce-dashboard-module
  ce-invoices-list --> ce-button
  ce-invoices-list --> ce-icon
  ce-invoices-list --> ce-pagination
  ce-invoices-list --> ce-block-ui
  ce-order-status-badge --> ce-tag
  ce-empty --> ce-icon
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  ce-block-ui --> ce-spinner
  style ce-invoices-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
