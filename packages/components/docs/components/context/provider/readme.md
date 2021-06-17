# ce-provider



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute | Description | Type                      | Default     |
| ----------------- | --------- | ----------- | ------------------------- | ----------- |
| `STENCIL_CONTEXT` | --        |             | `{ [key: string]: any; }` | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `mountConsumer` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [ce-checkout](../../controllers/checkout)
 - [ce-payment](../../controllers/payment)
 - [ce-payment-request](../../controllers/payment-request)
 - [ce-price-choices](../../controllers/price-chooser)
 - [ce-submit](../../controllers/submit)

### Graph
```mermaid
graph TD;
  ce-checkout --> ce-provider
  ce-payment --> ce-provider
  ce-payment-request --> ce-provider
  ce-price-choices --> ce-provider
  ce-submit --> ce-provider
  style ce-provider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
