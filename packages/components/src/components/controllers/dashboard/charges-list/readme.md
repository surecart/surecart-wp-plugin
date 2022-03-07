# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description            | Type                                  | Default                                |
| ---------------- | ----------------- | ---------------------- | ------------------------------------- | -------------------------------------- |
| `allLink`        | `all-link`        |                        | `string`                              | `undefined`                            |
| `heading`        | `heading`         |                        | `string`                              | `undefined`                            |
| `query`          | --                | Query to fetch charges | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |
| `showPagination` | `show-pagination` |                        | `boolean`                             | `true`                                 |


## Dependencies

### Depends on

- [ce-tag](../../../ui/tag)
- [ce-stacked-list-row](../../../ui/ce-stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-format-date](../../../util/format-date)
- [ce-text](../../../ui/text)
- [ce-format-number](../../../util/format-number)
- [ce-dashboard-module](../../../ui/ce-dashboard-module)
- [ce-button](../../../ui/button)
- [ce-icon](../../../ui/icon)
- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/ce-stacked-list)
- [ce-pagination](../../../ui/ce-pagination)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-charges-list --> ce-tag
  ce-charges-list --> ce-stacked-list-row
  ce-charges-list --> ce-skeleton
  ce-charges-list --> ce-format-date
  ce-charges-list --> ce-text
  ce-charges-list --> ce-format-number
  ce-charges-list --> ce-dashboard-module
  ce-charges-list --> ce-button
  ce-charges-list --> ce-icon
  ce-charges-list --> ce-card
  ce-charges-list --> ce-stacked-list
  ce-charges-list --> ce-pagination
  ce-charges-list --> ce-block-ui
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  ce-block-ui --> ce-spinner
  style ce-charges-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
