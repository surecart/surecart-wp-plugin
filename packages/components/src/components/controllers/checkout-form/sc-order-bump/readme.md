# sc-order-bump



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                 | Type      | Default     |
| ------------- | -------------- | --------------------------- | --------- | ----------- |
| `bump`        | --             | The bump                    | `Bump`    | `undefined` |
| `showControl` | `show-control` | Should we show the controls | `boolean` | `undefined` |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"base-content"` |             |
| `"price"`        |             |


## Dependencies

### Used by

 - [sc-order-bumps](../sc-order-bumps)

### Depends on

- [sc-choice](../../../ui/choice)
- [sc-divider](../../../ui/divider)

### Graph
```mermaid
graph TD;
  sc-order-bump --> sc-choice
  sc-order-bump --> sc-divider
  sc-order-bumps --> sc-order-bump
  style sc-order-bump fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
