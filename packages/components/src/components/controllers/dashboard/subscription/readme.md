# ce-subscription



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                        | Type           | Default     |
| ---------------- | ----------------- | ---------------------------------- | -------------- | ----------- |
| `heading`        | `heading`         |                                    | `string`       | `undefined` |
| `query`          | --                |                                    | `object`       | `undefined` |
| `subscription`   | --                |                                    | `Subscription` | `undefined` |
| `subscriptionId` | `subscription-id` | Customer id to fetch subscriptions | `string`       | `undefined` |


## Dependencies

### Depends on

- [ce-subscription-status-badge](../../../ui/subscription-status-badge)
- [ce-format-date](../../../util/format-date)
- [ce-stacked-list-row](../../../ui/ce-stacked-list-row)
- [ce-skeleton](../../../ui/skeleton)
- [ce-subscription-details](../ce-subscription-details)
- [ce-dashboard-module](../../../ui/ce-dashboard-module)
- [ce-flex](../../../ui/flex)
- [ce-button](../../../ui/button)
- [ce-icon](../../../ui/icon)
- [ce-card](../../../ui/card)
- [ce-stacked-list](../../../ui/ce-stacked-list)

### Graph
```mermaid
graph TD;
  ce-subscription --> ce-subscription-status-badge
  ce-subscription --> ce-format-date
  ce-subscription --> ce-stacked-list-row
  ce-subscription --> ce-skeleton
  ce-subscription --> ce-subscription-details
  ce-subscription --> ce-dashboard-module
  ce-subscription --> ce-flex
  ce-subscription --> ce-button
  ce-subscription --> ce-icon
  ce-subscription --> ce-card
  ce-subscription --> ce-stacked-list
  ce-subscription-status-badge --> ce-format-date
  ce-subscription-status-badge --> ce-tag
  ce-subscription-details --> ce-subscription-status-badge
  ce-subscription-details --> ce-format-date
  ce-subscription-details --> ce-skeleton
  ce-subscription-details --> ce-text
  ce-subscription-details --> ce-tag
  ce-subscription-details --> ce-format-number
  ce-dashboard-module --> ce-alert
  ce-alert --> ce-icon
  ce-button --> ce-spinner
  style ce-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
