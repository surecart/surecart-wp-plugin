# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                                    | Default     |
| ----------- | ----------- | ------------------------------------------ | --------------------------------------- | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                               | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                               | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`        | `'medium'`  |
| `status`    | `status`    | The tag's statux type.                     | `"delivered" \| "pending" \| "shipped"` | `undefined` |


## Dependencies

### Used by

 - [sc-fulfillments](../../controllers/dashboard/fulfillments)

### Depends on

- [sc-tag](../tag)

### Graph
```mermaid
graph TD;
  sc-fulfillment-shipping-status-badge --> sc-tag
  sc-fulfillments --> sc-fulfillment-shipping-status-badge
  style sc-fulfillment-shipping-status-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
