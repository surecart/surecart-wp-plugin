# ce-input

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                                                                                                                                                   | Type                                                                                    | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------- |
| `autocomplete`   | `autocomplete`    | The input's autocomplete attribute.                                                                                                                                                                           | `string`                                                                                | `undefined` |
| `autocorrect`    | `autocorrect`     | The input's autocorrect attribute.                                                                                                                                                                            | `string`                                                                                | `undefined` |
| `autofocus`      | `autofocus`       | The input's autofocus attribute.                                                                                                                                                                              | `boolean`                                                                               | `undefined` |
| `clearable`      | `clearable`       | Adds a clear button when the input is populated.                                                                                                                                                              | `boolean`                                                                               | `false`     |
| `disabled`       | `disabled`        | Disables the input.                                                                                                                                                                                           | `boolean`                                                                               | `false`     |
| `hasFocus`       | `has-focus`       | Inputs focus                                                                                                                                                                                                  | `boolean`                                                                               | `undefined` |
| `help`           | `help`            | The input's help text.                                                                                                                                                                                        | `string`                                                                                | `''`        |
| `hidden`         | `hidden`          | Hidden                                                                                                                                                                                                        | `boolean`                                                                               | `false`     |
| `inputmode`      | `inputmode`       | The input's inputmode attribute.                                                                                                                                                                              | `"decimal" \| "email" \| "none" \| "numeric" \| "search" \| "tel" \| "text" \| "url"`   | `undefined` |
| `invalid`        | `invalid`         | This will be true when the control is in an invalid state. Validity is determined by props such as `type`, `required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API. | `boolean`                                                                               | `false`     |
| `label`          | `label`           | The input's label.                                                                                                                                                                                            | `string`                                                                                | `undefined` |
| `max`            | `max`             | The input's maximum value.                                                                                                                                                                                    | `number \| string`                                                                      | `undefined` |
| `maxlength`      | `maxlength`       | The maximum length of input that will be considered valid.                                                                                                                                                    | `number`                                                                                | `undefined` |
| `min`            | `min`             | The input's minimum value.                                                                                                                                                                                    | `number \| string`                                                                      | `undefined` |
| `minlength`      | `minlength`       | The minimum length of input that will be considered valid.                                                                                                                                                    | `number`                                                                                | `undefined` |
| `name`           | `name`            | The input's name attribute.                                                                                                                                                                                   | `string`                                                                                | `undefined` |
| `pattern`        | `pattern`         | A pattern to validate input against.                                                                                                                                                                          | `string`                                                                                | `undefined` |
| `pill`           | `pill`            | Draws a pill-style input with rounded edges.                                                                                                                                                                  | `boolean`                                                                               | `false`     |
| `placeholder`    | `placeholder`     | The input's placeholder text.                                                                                                                                                                                 | `string`                                                                                | `undefined` |
| `readonly`       | `readonly`        | Makes the input readonly.                                                                                                                                                                                     | `boolean`                                                                               | `false`     |
| `required`       | `required`        | Makes the input a required field.                                                                                                                                                                             | `boolean`                                                                               | `false`     |
| `showLabel`      | `show-label`      | Should we show the label                                                                                                                                                                                      | `boolean`                                                                               | `true`      |
| `size`           | `size`            | The input's size.                                                                                                                                                                                             | `"large" \| "medium" \| "small"`                                                        | `'medium'`  |
| `spellcheck`     | `spellcheck`      | Enables spell checking on the input.                                                                                                                                                                          | `boolean`                                                                               | `undefined` |
| `squared`        | `squared`         |                                                                                                                                                                                                               | `boolean`                                                                               | `undefined` |
| `squaredBottom`  | `squared-bottom`  |                                                                                                                                                                                                               | `boolean`                                                                               | `undefined` |
| `squaredLeft`    | `squared-left`    |                                                                                                                                                                                                               | `boolean`                                                                               | `undefined` |
| `squaredRight`   | `squared-right`   |                                                                                                                                                                                                               | `boolean`                                                                               | `undefined` |
| `squaredTop`     | `squared-top`     |                                                                                                                                                                                                               | `boolean`                                                                               | `undefined` |
| `step`           | `step`            | The input's step attribute.                                                                                                                                                                                   | `number`                                                                                | `undefined` |
| `togglePassword` | `toggle-password` | Adds a password toggle button to password inputs.                                                                                                                                                             | `boolean`                                                                               | `false`     |
| `type`           | `type`            | The input's type.                                                                                                                                                                                             | `"email" \| "hidden" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `'text'`    |
| `value`          | `value`           | The input's value attribute.                                                                                                                                                                                  | `string`                                                                                | `''`        |


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

 - [sc-address](../address)
 - [sc-compact-address](../sc-compact-address)
 - [sc-coupon-form](../coupon-form)
 - [sc-customer-edit](../../controllers/dashboard/customer-edit)
 - [sc-customer-email](../../controllers/checkout-form/customer-email)
 - [sc-customer-name](../../controllers/checkout-form/customer-name)
 - [sc-licenses-list](../../controllers/dashboard/sc-licenses-list)
 - [sc-login-form](../../controllers/login)
 - [sc-order-password](../../controllers/checkout-form/order-password)
 - [sc-password-nag](../../controllers/dashboard/sc-password-nag)
 - [sc-price-input](../price-input)
 - [sc-select](../select)
 - [sc-stripe-element](../stripe-element)
 - [sc-tax-id-input](../tax-id-input)
 - [sc-wordpress-password-edit](../../controllers/dashboard/wordpress-password-edit)
 - [sc-wordpress-user-edit](../../controllers/dashboard/wordpress-user-edit)

### Depends on

- [sc-form-control](../form-control)

### Graph
```mermaid
graph TD;
  sc-input --> sc-form-control
  sc-form-control --> sc-tooltip
  sc-address --> sc-input
  sc-compact-address --> sc-input
  sc-coupon-form --> sc-input
  sc-customer-edit --> sc-input
  sc-customer-email --> sc-input
  sc-customer-name --> sc-input
  sc-licenses-list --> sc-input
  sc-login-form --> sc-input
  sc-order-password --> sc-input
  sc-password-nag --> sc-input
  sc-price-input --> sc-input
  sc-select --> sc-input
  sc-stripe-element --> sc-input
  sc-tax-id-input --> sc-input
  sc-wordpress-password-edit --> sc-input
  sc-wordpress-user-edit --> sc-input
  style sc-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
