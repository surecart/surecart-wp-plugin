# ce-email



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                  | Description                                  | Type                             | Default     |
| ------------------------- | -------------------------- | -------------------------------------------- | -------------------------------- | ----------- |
| `autofocus`               | `autofocus`                | The input's autofocus attribute.             | `boolean`                        | `undefined` |
| `confirmation`            | `confirmation`             | The input's password confirmation attribute. | `boolean`                        | `false`     |
| `confirmationHelp`        | `confirmation-help`        | The input's confirmation help text.          | `string`                         | `undefined` |
| `confirmationLabel`       | `confirmation-label`       | The input's confirmation label text.         | `string`                         | `undefined` |
| `confirmationPlaceholder` | `confirmation-placeholder` | The input's confirmation placeholder text.   | `string`                         | `undefined` |
| `disabled`                | `disabled`                 | Disables the input.                          | `boolean`                        | `false`     |
| `emailExists`             | `email-exists`             | Does the email exist?                        | `boolean`                        | `undefined` |
| `help`                    | `help`                     | The input's help text.                       | `string`                         | `''`        |
| `label`                   | `label`                    | The input's label.                           | `string`                         | `undefined` |
| `loggedIn`                | `logged-in`                |                                              | `boolean`                        | `undefined` |
| `pill`                    | `pill`                     | Draws a pill-style input with rounded edges. | `boolean`                        | `false`     |
| `placeholder`             | `placeholder`              | The input's placeholder text.                | `string`                         | `undefined` |
| `readonly`                | `readonly`                 | Makes the input readonly.                    | `boolean`                        | `false`     |
| `required`                | `required`                 | Makes the input a required field.            | `boolean`                        | `false`     |
| `showLabel`               | `show-label`               | Should we show the label                     | `boolean`                        | `true`      |
| `size`                    | `size`                     | The input's size.                            | `"large" \| "medium" \| "small"` | `'medium'`  |
| `value`                   | `value`                    | The input's value attribute.                 | `string`                         | `''`        |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Dependencies

### Depends on

- [sc-input](../../../ui/input)

### Graph
```mermaid
graph TD;
  sc-order-password --> sc-input
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  style sc-order-password fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
