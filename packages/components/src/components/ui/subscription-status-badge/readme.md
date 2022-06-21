# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute   | Description                                | Type                                                                                            | Default     |
| -------------- | ----------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------- |
| `clearable`    | `clearable` | Makes the tag clearable.                   | `boolean`                                                                                       | `false`     |
| `pill`         | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                                                                                       | `false`     |
| `size`         | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`                                                                | `'medium'`  |
| `status`       | `status`    | Subscription status                        | `"active" \| "canceled" \| "completed" \| "incomplete" \| "past_due" \| "trialing" \| "unpaid"` | `undefined` |
| `subscription` | --          | The tag's status type.                     | `Subscription`                                                                                  | `undefined` |


## Dependencies

### Used by

 - [sc-subscription](../../controllers/dashboard/subscription)
 - [sc-subscription-details](../../controllers/dashboard/subscription-details)

### Depends on

- [sc-format-date](../../util/format-date)
- [sc-tag](../tag)

### Graph
```mermaid
graph TD;
  sc-subscription-status-badge --> sc-format-date
  sc-subscription-status-badge --> sc-tag
  sc-subscription --> sc-subscription-status-badge
  sc-subscription-details --> sc-subscription-status-badge
  style sc-subscription-status-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
