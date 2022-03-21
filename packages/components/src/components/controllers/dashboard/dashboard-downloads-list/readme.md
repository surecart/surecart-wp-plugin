# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                        | Type                                  | Default                                |
| -------------- | --------------- | ---------------------------------- | ------------------------------------- | -------------------------------------- |
| `allLink`      | `all-link`      |                                    | `string`                              | `undefined`                            |
| `heading`      | `heading`       |                                    | `string`                              | `undefined`                            |
| `query`        | --              | Customer id to fetch subscriptions | `{ page: number; per_page: number; }` | `{     page: 1,     per_page: 10,   }` |
| `requestNonce` | `request-nonce` |                                    | `string`                              | `undefined`                            |


## Dependencies

### Depends on

- [ce-downloads-list](../../../ui/downloads-list)
- [ce-pagination](../../../ui/pagination)

### Graph
```mermaid
graph TD;
  ce-dashboard-downloads-list --> ce-downloads-list
  ce-dashboard-downloads-list --> ce-pagination
  ce-downloads-list --> ce-divider
  ce-downloads-list --> ce-empty
  ce-downloads-list --> ce-card
  ce-downloads-list --> ce-stacked-list
  ce-downloads-list --> ce-stacked-list-row
  ce-downloads-list --> ce-skeleton
  ce-downloads-list --> ce-spacing
  ce-downloads-list --> ce-format-bytes
  ce-downloads-list --> ce-icon
  ce-downloads-list --> ce-dashboard-module
  ce-downloads-list --> ce-button
  ce-downloads-list --> ce-block-ui
  ce-empty --> ce-icon
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  ce-pagination --> ce-flex
  ce-pagination --> ce-button
  style ce-dashboard-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
