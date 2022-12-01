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

 - [sc-subscription](../subscription)
 - [sc-subscription-cancel](../subscription-cancel)
 - [sc-subscription-renew](../subscription-renew)
 - [sc-subscriptions-list](../subscriptions-list)

### Depends on

- [sc-subscription-status-badge](../../../ui/subscription-status-badge)
- [sc-format-date](../../../util/format-date)
- [sc-skeleton](../../../ui/skeleton)
- [sc-format-number](../../../util/format-number)
- [sc-flex](../../../ui/flex)
- [sc-tag](../../../ui/tag)
- [sc-text](../../../ui/text)
- [sc-dialog](../../../ui/sc-dialog)
- [sc-card](../../../ui/card)
- [sc-stacked-list](../../../ui/stacked-list)
- [sc-stacked-list-row](../../../ui/stacked-list-row)

### Graph
```mermaid
graph TD;
  sc-subscription-details --> sc-subscription-status-badge
  sc-subscription-details --> sc-format-date
  sc-subscription-details --> sc-skeleton
  sc-subscription-details --> sc-format-number
  sc-subscription-details --> sc-flex
  sc-subscription-details --> sc-tag
  sc-subscription-details --> sc-text
  sc-subscription-details --> sc-dialog
  sc-subscription-details --> sc-card
  sc-subscription-details --> sc-stacked-list
  sc-subscription-details --> sc-stacked-list-row
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-subscription --> sc-subscription-details
  sc-subscription-cancel --> sc-subscription-details
  sc-subscription-renew --> sc-subscription-details
  sc-subscriptions-list --> sc-subscription-details
  style sc-subscription-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
