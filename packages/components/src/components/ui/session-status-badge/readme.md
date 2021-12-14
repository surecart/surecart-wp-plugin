# ce-subscription-status-badge



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                | Type                                              | Default     |
| ----------- | ----------- | ------------------------------------------ | ------------------------------------------------- | ----------- |
| `clearable` | `clearable` | Makes the tag clearable.                   | `boolean`                                         | `false`     |
| `pill`      | `pill`      | Draws a pill-style tag with rounded edges. | `boolean`                                         | `false`     |
| `size`      | `size`      | The tag's size.                            | `"large" \| "medium" \| "small"`                  | `'medium'`  |
| `status`    | `status`    | The tag's statux type.                     | `"completed" \| "draft" \| "finalized" \| "paid"` | `undefined` |


## Dependencies

### Depends on

- [ce-tag](../tag)

### Graph
```mermaid
graph TD;
  ce-session-status-badge --> ce-tag
  style ce-session-status-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
