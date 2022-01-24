# ce-payment-methods-list



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                   | Type     | Default     |
| -------- | --------- | ----------------------------- | -------- | ----------- |
| `query`  | --        | Query to fetch paymentMethods | `object` | `undefined` |


## Dependencies

### Depends on

- [ce-table-row](../../../ui/table-row)
- [ce-table-cell](../../../ui/table-cell)
- [ce-skeleton](../../../ui/skeleton)
- [ce-flex](../../../ui/flex)
- [ce-cc-logo](../../../ui/ce-cc-logo)
- [ce-format-date](../../../util/format-date)
- [ce-button](../../../ui/button)
- [ce-alert](../../../ui/alert)
- [ce-card](../../../ui/card)
- [ce-table](../../../ui/table)

### Graph
```mermaid
graph TD;
  ce-payment-methods-list --> ce-table-row
  ce-payment-methods-list --> ce-table-cell
  ce-payment-methods-list --> ce-skeleton
  ce-payment-methods-list --> ce-flex
  ce-payment-methods-list --> ce-cc-logo
  ce-payment-methods-list --> ce-format-date
  ce-payment-methods-list --> ce-button
  ce-payment-methods-list --> ce-alert
  ce-payment-methods-list --> ce-card
  ce-payment-methods-list --> ce-table
  ce-cc-logo --> ce-icon
  ce-button --> ce-spinner
  ce-alert --> ce-icon
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  style ce-payment-methods-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
