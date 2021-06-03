# ce-switch

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute  | Description                                                                                               | Type      | Default     |
| ---------- | ---------- | --------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `checked`  | `checked`  | Draws the switch in a checked state.                                                                      | `boolean` | `false`     |
| `disabled` | `disabled` | Disables the switch.                                                                                      | `boolean` | `false`     |
| `invalid`  | `invalid`  | This will be true when the control is in an invalid state. Validity is determined by the `required` prop. | `boolean` | `false`     |
| `name`     | `name`     | The switch's name attribute.                                                                              | `string`  | `undefined` |
| `required` | `required` | Makes the switch a required field.                                                                        | `boolean` | `false`     |
| `value`    | `value`    | The switch's value attribute.                                                                             | `string`  | `undefined` |

## Events

| Event      | Description                                       | Type                |
| ---------- | ------------------------------------------------- | ------------------- |
| `ceBlur`   | Emitted when the control loses focus.             | `CustomEvent<void>` |
| `ceChange` | Emitted when the control's checked state changes. | `CustomEvent<void>` |
| `ceFocus`  | Emitted when the control gains focus.             | `CustomEvent<void>` |

## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"base"`    |             |
| `"control"` |             |
| `"label"`   |             |
| `"thumb"`   |             |

## CSS Custom Properties

| Name           | Description               |
| -------------- | ------------------------- |
| `--height`     | The height of the switch. |
| `--thumb-size` | The size of the thumb.    |
| `--width`      | The width of the switch.  |

---

_Built with [StencilJS](https://stenciljs.com/)_
