# ce-cart-provider



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description  | Type    | Default     |
| -------- | --------- | ------------ | ------- | ----------- |
| `order`  | --        | Order Object | `Order` | `undefined` |


## Events

| Event               | Description             | Type                          |
| ------------------- | ----------------------- | ----------------------------- |
| `ceUpdateLineItems` | Update line items event | `CustomEvent<LineItemData[]>` |


## Dependencies

### Used by

 - [ce-session-provider](../session-provider)

### Graph
```mermaid
graph TD;
  ce-session-provider --> ce-line-items-provider
  style ce-line-items-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
