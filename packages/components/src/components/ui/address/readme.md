# ce-address



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description              | Type                                                                                                                                                                                                                                                                                                                                                                            | Default                                                                                                                                                                                                    |
| ---------- | ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `address`  | --         | The address.             | `{ name?: string; line_1?: string; line_2?: string; city?: string; state?: string; postal_code?: string; country?: string; constructor?: Function; toString?: () => string; toLocaleString?: () => string; valueOf?: () => Object; hasOwnProperty?: (v: PropertyKey) => boolean; isPrototypeOf?: (v: Object) => boolean; propertyIsEnumerable?: (v: PropertyKey) => boolean; }` | `{     country: '',     city: '',     line_1: '',     line_2: '',     postal_code: '',     state: '',   }`                                                                                                 |
| `label`    | `label`    | The label for the field. | `string`                                                                                                                                                                                                                                                                                                                                                                        | `undefined`                                                                                                                                                                                                |
| `loading`  | `loading`  | Is this loading?         | `boolean`                                                                                                                                                                                                                                                                                                                                                                       | `true`                                                                                                                                                                                                     |
| `names`    | --         |                          | `{ name?: string; line_1?: string; line_2?: string; city?: string; state?: string; postal_code?: string; country?: string; constructor?: Function; toString?: () => string; toLocaleString?: () => string; valueOf?: () => Object; hasOwnProperty?: (v: PropertyKey) => boolean; isPrototypeOf?: (v: Object) => boolean; propertyIsEnumerable?: (v: PropertyKey) => boolean; }` | `{     country: 'shipping_country',     city: 'shipping_country',     line_1: 'shipping_line_1',     line_2: 'shipping_line_2',     postal_code: 'shipping_postal_code',     state: 'shipping_state',   }` |
| `required` | `required` | Is this required?        | `boolean`                                                                                                                                                                                                                                                                                                                                                                       | `true`                                                                                                                                                                                                     |


## Events

| Event             | Description           | Type                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scChangeAddress` | Address change event. | `CustomEvent<{ name?: string; line_1?: string; line_2?: string; city?: string; state?: string; postal_code?: string; country?: string; constructor?: Function; toString?: () => string; toLocaleString?: () => string; valueOf?: () => Object; hasOwnProperty?: (v: PropertyKey) => boolean; isPrototypeOf?: (v: Object) => boolean; propertyIsEnumerable?: (v: PropertyKey) => boolean; }>` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"control"` |             |


## Dependencies

### Used by

 - [sc-customer-edit](../../controllers/dashboard/customer-edit)
 - [sc-order-shipping-address](../../controllers/checkout-form/order-shipping-address)

### Depends on

- [sc-form-control](../form-control)
- [sc-select](../select)
- [sc-input](../input)

### Graph
```mermaid
graph TD;
  sc-address --> sc-form-control
  sc-address --> sc-select
  sc-address --> sc-input
  sc-form-control --> sc-tooltip
  sc-select --> sc-menu-label
  sc-select --> sc-menu-item
  sc-select --> sc-form-control
  sc-select --> sc-dropdown
  sc-select --> sc-icon
  sc-select --> sc-input
  sc-select --> sc-spinner
  sc-select --> sc-menu
  sc-input --> sc-form-control
  sc-customer-edit --> sc-address
  sc-order-shipping-address --> sc-address
  style sc-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
