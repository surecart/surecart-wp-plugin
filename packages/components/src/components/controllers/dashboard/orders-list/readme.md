# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description           | Type                                  | Default                                |
| --------- | ---------- | --------------------- | ------------------------------------- | -------------------------------------- |
| `allLink` | `all-link` |                       | `string`                              | `undefined`                            |
| `heading` | `heading`  |                       | `string`                              | `undefined`                            |
| `query`   | --         | Query to fetch orders | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |


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
  sc-orders-list --> sc-tag
  sc-orders-list --> sc-order-status-badge
  sc-orders-list --> sc-card
  sc-orders-list --> sc-stacked-list
  sc-orders-list --> sc-stacked-list-row
  sc-orders-list --> sc-skeleton
  sc-orders-list --> sc-divider
  sc-orders-list --> sc-empty
  sc-orders-list --> sc-format-date
  sc-orders-list --> sc-text
  sc-orders-list --> sc-format-number
  sc-orders-list --> sc-dashboard-module
  sc-orders-list --> sc-button
  sc-orders-list --> sc-icon
  sc-orders-list --> sc-pagination
  sc-orders-list --> sc-block-ui
  sc-order-status-badge --> sc-tag
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-block-ui --> sc-spinner
  style sc-orders-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
