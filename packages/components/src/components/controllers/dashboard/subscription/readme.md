# ce-customer-subscription



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute | Description | Type           | Default     |
| --------------- | --------- | ----------- | -------------- | ----------- |
| `subscription`  | --        |             | `Subscription` | `undefined` |
| `upgradeGroups` | --        |             | `string[][]`   | `undefined` |


## Events

| Event                  | Description | Type                        |
| ---------------------- | ----------- | --------------------------- |
| `ceUpdateSubscription` |             | `CustomEvent<Subscription>` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"actions"` |             |
| `"card"`    |             |
| `"details"` |             |
| `"name"`    |             |
| `"price"`   |             |
| `"renewal"` |             |


## Dependencies

### Used by

 - [ce-subscriptions-list](../subscriptions-list)

### Depends on

- [ce-format-date](../../../util/format-date)
- [ce-subscription-status-badge](../../../ui/subscription-status-badge)
- [ce-card](../../../ui/card)
- [ce-flex](../../../ui/flex)
- [ce-format-number](../../../util/format-number)
- [ce-text](../../../ui/text)
- [ce-button](../../../ui/button)
- [ce-alert](../../../ui/alert)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-subscription --> ce-format-date
  ce-subscription --> ce-subscription-status-badge
  ce-subscription --> ce-card
  ce-subscription --> ce-flex
  ce-subscription --> ce-format-number
  ce-subscription --> ce-text
  ce-subscription --> ce-button
  ce-subscription --> ce-alert
  ce-subscription --> ce-block-ui
  ce-subscription-status-badge --> ce-tag
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-button --> ce-spinner
  ce-alert --> ce-icon
  ce-block-ui --> ce-spinner
  ce-subscriptions-list --> ce-subscription
  style ce-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
