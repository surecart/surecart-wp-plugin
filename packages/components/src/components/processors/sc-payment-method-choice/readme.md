# sc-payment-method-choice



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description            | Type      | Default     |
| ----------- | ------------ | ---------------------- | --------- | ----------- |
| `hasOthers` | `has-others` | Does this have others? | `boolean` | `undefined` |
| `open`      | `open`       | Is this open?          | `boolean` | `undefined` |


## Events

| Event    | Description     | Type                |
| -------- | --------------- | ------------------- |
| `scShow` | Show the toggle | `CustomEvent<void>` |


## Dependencies

### Used by

 - [sc-stripe-payment-method-choice](../sc-stripe-payment-method-choice)

### Depends on

- [sc-toggle](../../ui/sc-toggle)

### Graph
```mermaid
graph TD;
  sc-payment-method-choice --> sc-toggle
  sc-toggle --> sc-icon
  sc-stripe-payment-method-choice --> sc-payment-method-choice
  style sc-payment-method-choice fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
