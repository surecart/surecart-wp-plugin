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

 - [ce-customer-subscriptions-list](../customer-subscriptions-list)

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
  ce-customer-subscription --> ce-format-date
  ce-customer-subscription --> ce-subscription-status-badge
  ce-customer-subscription --> ce-card
  ce-customer-subscription --> ce-flex
  ce-customer-subscription --> ce-format-number
  ce-customer-subscription --> ce-text
  ce-customer-subscription --> ce-button
  ce-customer-subscription --> ce-alert
  ce-customer-subscription --> ce-block-ui
  ce-subscription-status-badge --> ce-tag
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  ce-customer-subscriptions-list --> ce-customer-subscription
  style ce-customer-subscription fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
