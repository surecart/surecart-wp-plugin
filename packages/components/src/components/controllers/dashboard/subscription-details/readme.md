# ce-subscription-details



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description | Type           | Default     |
| ----------------- | ------------------- | ----------- | -------------- | ----------- |
| `hideRenewalText` | `hide-renewal-text` |             | `boolean`      | `undefined` |
| `pendingPrice`    | --                  |             | `Price`        | `undefined` |
| `subscription`    | --                  |             | `Subscription` | `undefined` |


## Dependencies

### Used by

 - [ce-subscription](../subscription)
 - [ce-subscription-cancel](../subscription-cancel)
 - [ce-subscription-renew](../subscription-renew)
 - [ce-subscriptions-list](../subscriptions-list)

### Depends on

- [ce-subscription-status-badge](../../../ui/subscription-status-badge)
- [ce-format-date](../../../util/format-date)
- [ce-skeleton](../../../ui/skeleton)
- [ce-text](../../../ui/text)
- [ce-tag](../../../ui/tag)
- [ce-format-number](../../../util/format-number)

### Graph
```mermaid
graph TD;
  ce-subscription-details --> ce-subscription-status-badge
  ce-subscription-details --> ce-format-date
  ce-subscription-details --> ce-skeleton
  ce-subscription-details --> ce-text
  ce-subscription-details --> ce-tag
  ce-subscription-details --> ce-format-number
  ce-subscription-status-badge --> ce-format-date
  ce-subscription-status-badge --> ce-tag
  ce-subscription --> ce-subscription-details
  ce-subscription-cancel --> ce-subscription-details
  ce-subscription-renew --> ce-subscription-details
  ce-subscriptions-list --> ce-subscription-details
  style ce-subscription-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
