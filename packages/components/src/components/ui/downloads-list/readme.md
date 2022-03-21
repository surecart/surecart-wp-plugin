# ce-customer-subscriptions-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type         | Default     |
| -------------- | --------------- | ----------- | ------------ | ----------- |
| `allLink`      | `all-link`      |             | `string`     | `undefined` |
| `busy`         | `busy`          |             | `boolean`    | `undefined` |
| `error`        | `error`         |             | `string`     | `undefined` |
| `heading`      | `heading`       |             | `string`     | `undefined` |
| `loading`      | `loading`       |             | `boolean`    | `undefined` |
| `purchases`    | --              |             | `Purchase[]` | `[]`        |
| `requestNonce` | `request-nonce` |             | `string`     | `undefined` |


## Dependencies

### Used by

 - [ce-dashboard-downloads-list](../../controllers/dashboard/dashboard-downloads-list)

### Depends on

- [ce-divider](../divider)
- [ce-empty](../empty)
- [ce-card](../card)
- [ce-stacked-list](../stacked-list)
- [ce-stacked-list-row](../stacked-list-row)
- [ce-skeleton](../skeleton)
- [ce-spacing](../spacing)
- [ce-format-bytes](../../util/format-bytes)
- [ce-icon](../icon)
- [ce-dashboard-module](../dashboard-module)
- [ce-button](../button)
- [ce-block-ui](../block-ui)

### Graph
```mermaid
graph TD;
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
  ce-dashboard-downloads-list --> ce-downloads-list
  style ce-downloads-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
