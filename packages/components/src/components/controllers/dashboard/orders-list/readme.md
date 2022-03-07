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

- [ce-tag](../../../ui/tag)
- [ce-order-status-badge](../../../ui/order-status-badge)
- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/ce-stacked-list)
- [ce-stacked-list-row](../../../ui/ce-stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-divider](../../../ui/divider)
- [ce-empty](../../../ui/ce-empty)
- [ce-format-date](../../../util/format-date)
- [ce-text](../../../ui/text)
- [ce-format-number](../../../util/format-number)
- [ce-dashboard-module](../../../ui/ce-dashboard-module)
- [ce-button](../../../ui/button)
- [ce-icon](../../../ui/icon)
- [ce-pagination](../../../ui/ce-pagination)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-orders-list --> ce-tag
  ce-orders-list --> ce-order-status-badge
  ce-orders-list --> ce-card
  ce-orders-list --> ce-stacked-list
  ce-orders-list --> ce-stacked-list-row
  ce-orders-list --> ce-skeleton
  ce-orders-list --> ce-divider
  ce-orders-list --> ce-empty
  ce-orders-list --> ce-format-date
  ce-orders-list --> ce-text
  ce-orders-list --> ce-format-number
  ce-orders-list --> ce-dashboard-module
  ce-orders-list --> ce-button
  ce-orders-list --> ce-icon
  ce-orders-list --> ce-pagination
  ce-orders-list --> ce-block-ui
  ce-order-status-badge --> ce-tag
  ce-empty --> ce-icon
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  ce-block-ui --> ce-spinner
  style ce-orders-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
