# ce-line-item



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description       | Type     | Default     |
| ---------- | ---------- | ----------------- | -------- | ----------- |
| `currency` | `currency` | Currency symbol   | `string` | `undefined` |
| `price`    | `price`    | Price of the item | `string` | `undefined` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"base"`  |             |
| `"image"` |             |
| `"price"` |             |
| `"text"`  |             |


## Dependencies

### Used by

 - [ce-line-items](../../controllers/line-items)
 - [ce-total](../../controllers/total)

### Graph
```mermaid
graph TD;
  ce-line-items --> ce-line-item
  ce-total --> ce-line-item
  style ce-line-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
