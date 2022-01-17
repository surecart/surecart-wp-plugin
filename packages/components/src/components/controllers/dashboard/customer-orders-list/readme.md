# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                        | Type     | Default     |
| ------------ | ------------- | ---------------------------------- | -------- | ----------- |
| `customerId` | `customer-id` | Customer id to fetch subscriptions | `string` | `undefined` |
| `page`       | `page`        |                                    | `number` | `undefined` |


## Dependencies

### Depends on

- [ce-table](../../../ui/table)
- [ce-table-cell](../../../ui/table-cell)
- [ce-table-row](../../../ui/table-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-alert](../../../ui/alert)
- [ce-text](../../../ui/text)
- [ce-format-number](../../../util/format-number)
- [ce-session-status-badge](../../../ui/session-status-badge)
- [ce-button](../../../ui/button)

### Graph
```mermaid
graph TD;
  ce-customer-orders-list --> ce-table
  ce-customer-orders-list --> ce-table-cell
  ce-customer-orders-list --> ce-table-row
  ce-customer-orders-list --> ce-skeleton
  ce-customer-orders-list --> ce-alert
  ce-customer-orders-list --> ce-text
  ce-customer-orders-list --> ce-format-number
  ce-customer-orders-list --> ce-session-status-badge
  ce-customer-orders-list --> ce-button
  ce-session-status-badge --> ce-tag
  ce-button --> ce-spinner
  style ce-customer-orders-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
