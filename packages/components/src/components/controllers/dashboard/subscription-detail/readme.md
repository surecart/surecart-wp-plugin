# ce-customer-subscription



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute         | Description | Type             | Default     |
| ----------------- | ----------------- | ----------- | ---------------- | ----------- |
| `isIndex`         | `is-index`        |             | `boolean`        | `undefined` |
| `loading`         | `loading`         |             | `boolean`        | `undefined` |
| `subscription_id` | `subscription_id` |             | `string`         | `undefined` |
| `subscriptions`   | --                |             | `Subscription[]` | `undefined` |
| `upgradeGroups`   | --                |             | `string[][]`     | `undefined` |


## Events

| Event                 | Description | Type                                           |
| --------------------- | ----------- | ---------------------------------------------- |
| `ceFetchSubscription` |             | `CustomEvent<{ id: string; props?: object; }>` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"name"`  |             |
| `"plans"` |             |
| `"price"` |             |


## Dependencies

### Depends on

- [ce-format-date](../../../util/format-date)
- [ce-subscription-status-badge](../../../ui/subscription-status-badge)
- [ce-card](../../../ui/card)
- [ce-flex](../../../ui/flex)
- [ce-skeleton](../../../ui/skeleton)
- [ce-heading](../../../ui/heading)
- [ce-divider](../../../ui/divider)
- [ce-format-number](../../../util/format-number)
- [ce-customer-subscription-plan](../subscription-plan)
- [ce-button](../../../ui/button)
- [ce-icon](../../../ui/icon)
- [ce-block-ui](../../../ui/block-ui)

### Graph
```mermaid
graph TD;
  ce-customer-subscription-edit --> ce-format-date
  ce-customer-subscription-edit --> ce-subscription-status-badge
  ce-customer-subscription-edit --> ce-card
  ce-customer-subscription-edit --> ce-flex
  ce-customer-subscription-edit --> ce-skeleton
  ce-customer-subscription-edit --> ce-heading
  ce-customer-subscription-edit --> ce-divider
  ce-customer-subscription-edit --> ce-format-number
  ce-customer-subscription-edit --> ce-customer-subscription-plan
  ce-customer-subscription-edit --> ce-button
  ce-customer-subscription-edit --> ce-icon
  ce-customer-subscription-edit --> ce-block-ui
  ce-subscription-status-badge --> ce-tag
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-customer-subscription-plan --> ce-skeleton
  ce-customer-subscription-plan --> ce-format-number
  ce-button --> ce-spinner
  ce-block-ui --> ce-spinner
  style ce-customer-subscription-edit fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
