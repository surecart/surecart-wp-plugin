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

- [sc-downloads-list](../../../ui/downloads-list)
- [sc-pagination](../../../ui/pagination)

### Graph
```mermaid
graph TD;
  sc-dashboard-downloads-list --> sc-downloads-list
  sc-dashboard-downloads-list --> sc-pagination
  sc-downloads-list --> sc-divider
  sc-downloads-list --> sc-empty
  sc-downloads-list --> sc-card
  sc-downloads-list --> sc-stacked-list
  sc-downloads-list --> sc-stacked-list-row
  sc-downloads-list --> sc-skeleton
  sc-downloads-list --> sc-spacing
  sc-downloads-list --> sc-format-bytes
  sc-downloads-list --> sc-icon
  sc-downloads-list --> sc-dashboard-module
  sc-downloads-list --> sc-button
  sc-downloads-list --> sc-block-ui
  sc-empty --> sc-icon
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-button --> sc-spinner
  sc-block-ui --> sc-spinner
  sc-pagination --> sc-flex
  sc-pagination --> sc-button
  style sc-dashboard-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
