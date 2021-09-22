# ce-form-control

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                             | Default     |
| -------------- | --------------- | ----------- | -------------------------------- | ----------- |
| `errorMessage` | `error-message` |             | `string`                         | `''`        |
| `help`         | `help`          |             | `string`                         | `undefined` |
| `helpId`       | `help-id`       |             | `string`                         | `undefined` |
| `inputId`      | `input-id`      |             | `string`                         | `undefined` |
| `label`        | `label`         |             | `string`                         | `undefined` |
| `labelId`      | `label-id`      |             | `string`                         | `undefined` |
| `required`     | `required`      |             | `boolean`                        | `false`     |
| `showLabel`    | `show-label`    |             | `boolean`                        | `true`      |
| `size`         | `size`          |             | `"large" \| "medium" \| "small"` | `'medium'`  |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"form-control"` |             |
| `"help-text"`    |             |
| `"label"`        |             |


## Dependencies

### Used by

 - [ce-input](../input)
 - [ce-select-old](../select-old)

### Depends on

- [ce-tooltip](../tooltip)

### Graph
```mermaid
graph TD;
  ce-form-control --> ce-tooltip
  ce-input --> ce-form-control
  ce-select-old --> ce-form-control
  style ce-form-control fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
