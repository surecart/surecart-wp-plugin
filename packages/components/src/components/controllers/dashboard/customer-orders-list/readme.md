# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                        | Type     | Default     |
| ------------ | ------------- | ---------------------------------- | -------- | ----------- |
| `customerId` | `customer-id` | Customer id to fetch subscriptions | `string` | `undefined` |
| `page`       | `page`        |                                    | `number` | `undefined` |


## Dependencies

### Depends on

- [ce-table-row](../../../ui/table-row)
- [ce-table-cell](../../../ui/table-cell)
- [ce-skeleton](../../../ui/skeleton)
- [ce-text](../../../ui/text)
- [ce-format-number](../../../util/format-number)
- [ce-format-date](../../../util/format-date)
- [ce-order-status-badge](../../../ui/order-status-badge)
- [ce-button](../../../ui/button)
- [ce-alert](../../../ui/alert)
- [ce-card](../../../ui/card)
- [ce-table](../../../ui/table)

### Graph
```mermaid
graph TD;
  ce-customer-orders-list --> ce-table-row
  ce-customer-orders-list --> ce-table-cell
  ce-customer-orders-list --> ce-skeleton
  ce-customer-orders-list --> ce-text
  ce-customer-orders-list --> ce-format-number
  ce-customer-orders-list --> ce-format-date
  ce-customer-orders-list --> ce-order-status-badge
  ce-customer-orders-list --> ce-button
  ce-customer-orders-list --> ce-alert
  ce-customer-orders-list --> ce-card
  ce-customer-orders-list --> ce-table
  ce-order-status-badge --> ce-tag
  ce-button --> ce-spinner
  ce-alert --> ce-icon
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  style ce-customer-orders-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
