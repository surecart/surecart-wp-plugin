# sc-cart-session-provider



<!-- Auto Generated Below -->


## Events

| Event        | Description   | Type                                                         |
| ------------ | ------------- | ------------------------------------------------------------ |
| `scSetState` | Set the state | `CustomEvent<"busy" \| "idle" \| "loading" \| "navigating">` |


## Dependencies

### Used by

 - [sc-cart](../../controllers/cart/sc-cart)

### Depends on

- [sc-line-items-provider](../line-items-provider)

### Graph
```mermaid
graph TD;
  sc-cart-session-provider --> sc-line-items-provider
  sc-cart --> sc-cart-session-provider
  style sc-cart-session-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
