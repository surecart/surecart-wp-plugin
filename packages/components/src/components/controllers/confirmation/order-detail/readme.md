# ce-card



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type      | Default     |
| ---------- | ---------- | ----------- | --------- | ----------- |
| `fallback` | `fallback` |             | `string`  | `undefined` |
| `label`    | `label`    |             | `string`  | `undefined` |
| `loading`  | `loading`  |             | `boolean` | `undefined` |
| `metaKey`  | `meta-key` |             | `string`  | `undefined` |
| `order`    | --         |             | `Order`   | `undefined` |
| `value`    | `value`    |             | `string`  | `undefined` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"base"`  |             |
| `"label"` |             |
| `"value"` |             |


## Dependencies

### Depends on

- [ce-format-number](../../../util/format-number)
- [ce-skeleton](../../../ui/skeleton)

### Graph
```mermaid
graph TD;
  ce-order-detail --> ce-format-number
  ce-order-detail --> ce-skeleton
  style ce-order-detail fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
