# sc-form-state-provider



<!-- Auto Generated Below -->


## Events

| Event                    | Description    | Type                                                                                                                                                                        |
| ------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scSetCheckoutFormState` | Set the state. | `CustomEvent<"confirmed" \| "confirming" \| "draft" \| "expired" \| "failure" \| "finalizing" \| "idle" \| "loading" \| "paid" \| "paying" \| "redirecting" \| "updating">` |


## Dependencies

### Used by

 - [sc-checkout](../../controllers/checkout-form/checkout)

### Depends on

- [sc-block-ui](../../ui/block-ui)

### Graph
```mermaid
graph TD;
  sc-form-state-provider --> sc-block-ui
  sc-block-ui --> sc-spinner
  sc-checkout --> sc-form-state-provider
  style sc-form-state-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
