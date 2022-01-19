# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description            | Type     | Default     |
| -------- | --------- | ---------------------- | -------- | ----------- |
| `query`  | --        | Query to fetch charges | `object` | `undefined` |


## Dependencies

### Depends on

- [ce-tag](../../../ui/tag)
- [ce-card](../../../ui/card)
- [ce-flex](../../../ui/flex)
- [ce-skeleton](../../../ui/skeleton)
- [ce-alert](../../../ui/alert)
- [ce-table](../../../ui/table)
- [ce-table-cell](../../../ui/table-cell)
- [ce-table-row](../../../ui/table-row)
- [ce-format-number](../../../util/format-number)
- [ce-format-date](../../../util/format-date)
- [ce-cc-logo](../../../ui/ce-cc-logo)

### Graph
```mermaid
graph TD;
  ce-charges-list --> ce-tag
  ce-charges-list --> ce-card
  ce-charges-list --> ce-flex
  ce-charges-list --> ce-skeleton
  ce-charges-list --> ce-alert
  ce-charges-list --> ce-table
  ce-charges-list --> ce-table-cell
  ce-charges-list --> ce-table-row
  ce-charges-list --> ce-format-number
  ce-charges-list --> ce-format-date
  ce-charges-list --> ce-cc-logo
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-alert --> ce-icon
  ce-cc-logo --> ce-icon
  style ce-charges-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
