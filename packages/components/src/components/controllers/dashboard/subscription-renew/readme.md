# ce-subscription-renew



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type           | Default     |
| ---------------- | ----------------- | ----------- | -------------- | ----------- |
| `backUrl`        | `back-url`        |             | `string`       | `undefined` |
| `heading`        | `heading`         |             | `string`       | `undefined` |
| `subscription`   | --                |             | `Subscription` | `undefined` |
| `subscriptionId` | `subscription-id` |             | `string`       | `undefined` |
| `successUrl`     | `success-url`     |             | `string`       | `undefined` |


## Dependencies

### Depends on

- [ce-subscription-details](../subscription-details)
- [ce-alert](../../../ui/alert)
- [ce-format-date](../../../util/format-date)
- [ce-skeleton](../../../ui/skeleton)
- [ce-dashboard-module](../../../ui/dashboard-module)
- [ce-card](../../../ui/card)
- [ce-button](../../../ui/button)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-subscription-renew --> ce-subscription-details
  ce-subscription-renew --> ce-alert
  ce-subscription-renew --> ce-format-date
  ce-subscription-renew --> ce-skeleton
  ce-subscription-renew --> ce-dashboard-module
  ce-subscription-renew --> ce-card
  ce-subscription-renew --> ce-button
  ce-subscription-renew --> ce-block-ui
  ce-subscription-details --> ce-subscription-status-badge
  ce-subscription-details --> ce-format-date
  ce-subscription-details --> ce-skeleton
  ce-subscription-details --> ce-text
  ce-subscription-details --> ce-tag
  ce-subscription-details --> ce-format-number
  ce-subscription-status-badge --> ce-format-date
  ce-subscription-status-badge --> ce-tag
  ce-alert --> ce-icon
  ce-dashboard-module --> ce-alert
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-subscription-renew fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
