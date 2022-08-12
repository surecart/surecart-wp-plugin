# ce-tooltip



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description            | Type                                                                  | Default     |
| --------- | --------- | ---------------------- | --------------------------------------------------------------------- | ----------- |
| `freeze`  | `freeze`  | Freeze open or closed. | `boolean`                                                             | `undefined` |
| `open`    | `open`    | Open or not            | `boolean`                                                             | `undefined` |
| `padding` | `padding` | The tooltip's padding. | `number`                                                              | `5`         |
| `text`    | `text`    | Tooltip text           | `string`                                                              | `undefined` |
| `type`    | `type`    | The tooltip's type.    | `"danger" \| "info" \| "primary" \| "success" \| "text" \| "warning"` | `'info'`    |
| `width`   | `width`   | Tooltip fixed width    | `string`                                                              | `undefined` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |
| `"text"` |             |


## Dependencies

### Used by

 - [sc-form-control](../form-control)
 - [sc-payment-method](../sc-payment-method)

### Graph
```mermaid
graph TD;
  sc-form-control --> sc-tooltip
  sc-payment-method --> sc-tooltip
  style sc-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
