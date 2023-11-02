# ce-customer-name



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                                                                                                   | Type                             | Default     |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| `autofocus`   | `autofocus`   | The input's autofocus attribute.                                                                                                                                                                              | `boolean`                        | `undefined` |
| `disabled`    | `disabled`    | Disables the input.                                                                                                                                                                                           | `boolean`                        | `false`     |
| `error`       | `error`       | Error focus                                                                                                                                                                                                   | `boolean`                        | `undefined` |
| `hasFocus`    | `has-focus`   | Inputs focus                                                                                                                                                                                                  | `boolean`                        | `undefined` |
| `help`        | `help`        | The input's help text.                                                                                                                                                                                        | `string`                         | `''`        |
| `invalid`     | `invalid`     | This will be true when the control is in an invalid state. Validity is determined by props such as `type`, `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API. | `boolean`                        | `false`     |
| `label`       | `label`       | The input's label.                                                                                                                                                                                            | `string`                         | `undefined` |
| `pill`        | `pill`        | Draws a pill-style input with rounded edges.                                                                                                                                                                  | `boolean`                        | `false`     |
| `placeholder` | `placeholder` | The input's placeholder text.                                                                                                                                                                                 | `string`                         | `undefined` |
| `readonly`    | `readonly`    | Makes the input readonly.                                                                                                                                                                                     | `boolean`                        | `false`     |
| `required`    | `required`    | Makes the input a required field.                                                                                                                                                                             | `boolean`                        | `false`     |
| `showLabel`   | `show-label`  | Should we show the label                                                                                                                                                                                      | `boolean`                        | `true`      |
| `size`        | `size`        | The input's size.                                                                                                                                                                                             | `"large" \| "medium" \| "small"` | `'medium'`  |
| `value`       | `value`       | The input's value attribute.                                                                                                                                                                                  | `string`                         | `''`        |


## Events

| Event      | Description                                 | Type                |
| ---------- | ------------------------------------------- | ------------------- |
| `scBlur`   | Emitted when the control loses focus.       | `CustomEvent<void>` |
| `scChange` | Emitted when the control's value changes.   | `CustomEvent<void>` |
| `scClear`  | Emitted when the clear button is activated. | `CustomEvent<void>` |
| `scFocus`  | Emitted when the control gains focus.       | `CustomEvent<void>` |
| `scInput`  | Emitted when the control receives input.    | `CustomEvent<void>` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [sc-phone-input](../../../ui/phone-input)

### Graph
```mermaid
graph TD;
  sc-customer-phone --> sc-phone-input
  sc-phone-input --> sc-form-control
  style sc-customer-phone fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
