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

- [sc-tag](../../../ui/tag)
- [sc-stacked-list-row](../../../ui/stacked-list-row)
- [sc-skeleton](../../../ui/skeleton)
- [sc-format-date](../../../util/format-date)
- [sc-text](../../../ui/text)
- [sc-format-number](../../../util/format-number)
- [sc-dashboard-module](../../../ui/dashboard-module)
- [sc-button](../../../ui/button)
- [sc-icon](../../../ui/icon)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-pagination](../../../ui/pagination)
- [sc-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-charges-list --> sc-tag
  sc-charges-list --> sc-stacked-list-row
  sc-charges-list --> sc-skeleton
  sc-charges-list --> sc-format-date
  sc-charges-list --> sc-text
  sc-charges-list --> sc-format-number
  sc-charges-list --> sc-dashboard-module
  sc-charges-list --> sc-button
  sc-charges-list --> sc-icon
  sc-charges-list --> sc-card
  sc-charges-list --> sc-stacked-list
  sc-charges-list --> sc-pagination
  sc-charges-list --> sc-block-ui
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  sc-block-ui --> sc-spinner
  style sc-charges-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
