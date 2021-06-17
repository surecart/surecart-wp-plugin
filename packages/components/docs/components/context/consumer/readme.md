# ce-consumer



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type  | Default     |
| ---------- | ---------- | ----------- | ----- | ----------- |
| `renderer` | `renderer` |             | `any` | `undefined` |


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
  ce-checkout --> ce-consumer
  ce-payment --> ce-consumer
  ce-payment-request --> ce-consumer
  ce-price-choices --> ce-consumer
  ce-submit --> ce-consumer
  style ce-consumer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
