# ce-form



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                | Type      | Default |
| ------------ | ------------ | ---------------------------------------------------------- | --------- | ------- |
| `novalidate` | `novalidate` | Prevent the form from validating inputs before submitting. | `boolean` | `false` |


## Events

| Event          | Description                                                                                                                                                                                                                                                                                                                                                                                                | Type                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `scFormChange` | Emitted when the form is submitted. This event will not be emitted if any form control inside of it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional around the XHR request you use to submit the form's data with. | `CustomEvent<Object>` |
| `scFormSubmit` | Backwards compat.                                                                                                                                                                                                                                                                                                                                                                                          | `CustomEvent<void>`   |
| `scSubmit`     | Emitted when the form is submitted. This event will not be emitted if any form control inside of it is in an invalid state, unless the form has the `novalidate` attribute. Note that there is never a need to prevent this event, since it doen't send a GET or POST request like native forms. To "prevent" submission, use a conditional around the XHR request you use to submit the form's data with. | `CustomEvent<void>`   |


## Methods

### `getFormData() => Promise<FormData>`

Serializes all form controls elements and returns a `FormData` object.

#### Returns

Type: `Promise<FormData>`



### `getFormJson() => Promise<Record<string, unknown>>`



#### Returns

Type: `Promise<Record<string, unknown>>`



### `submit() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `validate() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`




## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |
| `"form"` |             |


## Dependencies

### Used by

 - [sc-cart-form](../../controllers/cart/sc-cart-form)
 - [sc-customer-edit](../../controllers/dashboard/customer-edit)
 - [sc-login-form](../../controllers/login)
 - [sc-login-provider](../../providers/sc-login-provider)
 - [sc-password-nag](../../controllers/dashboard/sc-password-nag)
 - [sc-stripe-add-method](../sc-stripe-add-method)
 - [sc-subscription-ad-hoc-confirm](../../controllers/dashboard/subscription-ad-hoc-confirm)
 - [sc-subscription-payment](../../controllers/dashboard/subscription-payment)
 - [sc-subscription-payment-method](../../controllers/dashboard/sc-subscription-payment-method)
 - [sc-subscription-switch](../../controllers/dashboard/subscription-switch)
 - [sc-upcoming-invoice](../../controllers/dashboard/upcoming-invoice)
 - [sc-wordpress-password-edit](../../controllers/dashboard/wordpress-password-edit)
 - [sc-wordpress-user-edit](../../controllers/dashboard/wordpress-user-edit)

### Graph
```mermaid
graph TD;
  sc-cart-form --> sc-form
  sc-customer-edit --> sc-form
  sc-login-form --> sc-form
  sc-login-provider --> sc-form
  sc-password-nag --> sc-form
  sc-stripe-add-method --> sc-form
  sc-subscription-ad-hoc-confirm --> sc-form
  sc-subscription-payment --> sc-form
  sc-subscription-payment-method --> sc-form
  sc-subscription-switch --> sc-form
  sc-upcoming-invoice --> sc-form
  sc-wordpress-password-edit --> sc-form
  sc-wordpress-user-edit --> sc-form
  style sc-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
