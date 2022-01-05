# ce-input

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                   | Type                                                                                  | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------- |
| `autocomplete`   | `autocomplete`    | The input's autocomplete attribute.                                                                                                                                                                           | `string`                                                                              | `undefined` |
| `autocorrect`    | `autocorrect`     | The input's autocorrect attribute.                                                                                                                                                                            | `string`                                                                              | `undefined` |
| `autofocus`      | `autofocus`       | The input's autofocus attribute.                                                                                                                                                                              | `boolean`                                                                             | `undefined` |
| `clearable`      | `clearable`       | Adds a clear button when the input is populated.                                                                                                                                                              | `boolean`                                                                             | `false`     |
| `disabled`       | `disabled`        | Disables the input.                                                                                                                                                                                           | `boolean`                                                                             | `false`     |
| `hasFocus`       | `has-focus`       | Inputs focus                                                                                                                                                                                                  | `boolean`                                                                             | `undefined` |
| `help`           | `help`            | The input's help text.                                                                                                                                                                                        | `string`                                                                              | `''`        |
| `hidden`         | `hidden`          | Hidden                                                                                                                                                                                                        | `boolean`                                                                             | `false`     |
| `inputmode`      | `inputmode`       | The input's inputmode attribute.                                                                                                                                                                              | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url"` | `undefined` |
| `invalid`        | `invalid`         | This will be true when the control is in an invalid state. Validity is determined by props such as `type`, `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API. | `boolean`                                                                             | `false`     |
| `label`          | `label`           | The input's label.                                                                                                                                                                                            | `string`                                                                              | `undefined` |
| `max`            | `max`             | The input's maximum value.                                                                                                                                                                                    | `number \| string`                                                                    | `undefined` |
| `maxlength`      | `maxlength`       | The maximum length of input that will be considered valid.                                                                                                                                                    | `number`                                                                              | `undefined` |
| `min`            | `min`             | The input's minimum value.                                                                                                                                                                                    | `number \| string`                                                                    | `undefined` |
| `minlength`      | `minlength`       | The minimum length of input that will be considered valid.                                                                                                                                                    | `number`                                                                              | `undefined` |
| `name`           | `name`            | The input's name attribute.                                                                                                                                                                                   | `string`                                                                              | `undefined` |
| `pattern`        | `pattern`         | A pattern to validate input against.                                                                                                                                                                          | `string`                                                                              | `undefined` |
| `pill`           | `pill`            | Draws a pill-style input with rounded edges.                                                                                                                                                                  | `boolean`                                                                             | `false`     |
| `placeholder`    | `placeholder`     | The input's placeholder text.                                                                                                                                                                                 | `string`                                                                              | `undefined` |
| `readonly`       | `readonly`        | Makes the input readonly.                                                                                                                                                                                     | `boolean`                                                                             | `false`     |
| `required`       | `required`        | Makes the input a required field.                                                                                                                                                                             | `boolean`                                                                             | `false`     |
| `showLabel`      | `show-label`      | Should we show the label                                                                                                                                                                                      | `boolean`                                                                             | `true`      |
| `size`           | `size`            | The input's size.                                                                                                                                                                                             | `"large" \| "medium" \| "small"`                                                      | `'medium'`  |
| `spellcheck`     | `spellcheck`      | Enables spell checking on the input.                                                                                                                                                                          | `boolean`                                                                             | `undefined` |
| `step`           | `step`            | The input's step attribute.                                                                                                                                                                                   | `number`                                                                              | `undefined` |
| `togglePassword` | `toggle-password` | Adds a password toggle button to password inputs.                                                                                                                                                             | `boolean`                                                                             | `false`     |
| `type`           | `type`            | The input's type.                                                                                                                                                                                             | `"email" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"`           | `'text'`    |
| `value`          | `value`           | The input's value attribute.                                                                                                                                                                                  | `string`                                                                              | `''`        |


## Events

| Event      | Description                                 | Type                |
| ---------- | ------------------------------------------- | ------------------- |
| `ceBlur`   | Emitted when the control loses focus.       | `CustomEvent<void>` |
| `ceChange` | Emitted when the control's value changes.   | `CustomEvent<void>` |
| `ceClear`  | Emitted when the clear button is activated. | `CustomEvent<void>` |
| `ceFocus`  | Emitted when the control gains focus.       | `CustomEvent<void>` |
| `ceInput`  | Emitted when the control receives input.    | `CustomEvent<void>` |


## Methods

### `reportValidity() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `setCustomValidity(message: string) => Promise<void>`

Sets a custom validation message. If `message` is not empty, the field will be considered invalid.

#### Returns

Type: `Promise<void>`



### `triggerBlur() => Promise<void>`

Removes focus from the input.

#### Returns

Type: `Promise<void>`



### `triggerFocus(options?: FocusOptions) => Promise<void>`

Sets focus on the input.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `"base"`         | The elements base wrapper.                       |
| `"clear-button"` |                                                  |
| `"help-text"`    | Help text that describes how to use the input.   |
| `"input"`        | The html input element.                          |
| `"prefix"`       | Used to prepend an icon or element to the input. |
| `"suffix"`       | Used to prepend an icon or element to the input. |


## CSS Custom Properties

| Name           | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| `--focus-ring` | The focus ring style to use when the control receives focus, a `box-shadow` property. |


## Dependencies

### Used by

 - [ce-coupon-form](../../controllers/coupon-form)
 - [ce-email](../../controllers/email)
 - [ce-login-form](../../controllers/login)
 - [ce-price-input](../price-input)
 - [ce-select](../select)
 - [ce-stripe-element](../stripe-element)

### Depends on

- [ce-form-control](../form-control)

### Graph
```mermaid
graph TD;
  ce-input --> ce-form-control
  ce-form-control --> ce-tooltip
  ce-coupon-form --> ce-input
  ce-email --> ce-input
  ce-login-form --> ce-input
  ce-price-input --> ce-input
  ce-select --> ce-input
  ce-stripe-element --> ce-input
  style ce-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
