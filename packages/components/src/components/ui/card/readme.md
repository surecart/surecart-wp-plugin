# ce-card



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description | Type      | Default     |
| ------------ | ------------ | ----------- | --------- | ----------- |
| `borderless` | `borderless` |             | `boolean` | `undefined` |
| `loading`    | `loading`    |             | `boolean` | `undefined` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"base"`   |             |
| `"border"` |             |


## Dependencies

### Used by

 - [ce-session-subscription](../../controllers/session-subscription)

### Depends on

- [ce-skeleton](../skeleton)
- [ce-divider](../divider)

### Graph
```mermaid
graph TD;
  ce-card --> ce-skeleton
  ce-card --> ce-divider
  ce-session-subscription --> ce-card
  style ce-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
