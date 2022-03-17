# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description                        | Type                                  | Default                                |
| --------- | ---------- | ---------------------------------- | ------------------------------------- | -------------------------------------- |
| `allLink` | `all-link` |                                    | `string`                              | `undefined`                            |
| `heading` | `heading`  |                                    | `string`                              | `undefined`                            |
| `query`   | --         | Customer id to fetch subscriptions | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |


## Dependencies

### Depends on

- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/stacked-list)
- [ce-stacked-list-row](../../../ui/stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-spacing](../../../ui/spacing)
- [ce-format-bytes](../../../util/format-bytes)
- [ce-icon](../../../ui/icon)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-button](../../../ui/button)
- [ce-pagination](../../../ui/pagination)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-downloads-list --> ce-card
  ce-downloads-list --> ce-stacked-list
  ce-downloads-list --> ce-stacked-list-row
  ce-downloads-list --> ce-skeleton
  ce-downloads-list --> ce-spacing
  ce-downloads-list --> ce-format-bytes
  ce-downloads-list --> ce-icon
  ce-downloads-list --> ce-dashboard-module
  ce-downloads-list --> ce-button
  ce-downloads-list --> ce-pagination
  ce-downloads-list --> ce-block-ui
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  ce-block-ui --> ce-spinner
  style ce-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
