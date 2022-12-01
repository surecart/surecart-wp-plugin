# sc-error



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description       | Type            | Default     |
| -------- | --------- | ----------------- | --------------- | ----------- |
| `error`  | --        | Error to display. | `ResponseError` | `undefined` |


## Events

| Event           | Description    | Type                         |
| --------------- | -------------- | ---------------------------- |
| `scUpdateError` | Set the state. | `CustomEvent<ResponseError>` |


## Shadow Parts

| Part        | Description                |
| ----------- | -------------------------- |
| `"base"`    | The elements base wrapper. |
| `"close"`   | The close icon.            |
| `"icon"`    | The alert icon.            |
| `"message"` | The alert message.         |
| `"text"`    | The alert text.            |
| `"title"`   | The alert title.           |


## Dependencies

### Used by

 - [sc-cart](../../controllers/cart/sc-cart)

### Depends on

- [sc-alert](../alert)

### Graph
```mermaid
graph TD;
  sc-error --> sc-alert
  sc-alert --> sc-icon
  sc-cart --> sc-error
  style sc-error fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
