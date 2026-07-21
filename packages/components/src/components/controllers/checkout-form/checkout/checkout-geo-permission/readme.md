# sc-checkout-geo-permission



<!-- Auto Generated Below -->


## Overview

Explains why location is requested (e.g. regional / purchasing-power-parity pricing) and gates
the browser geolocation prompt behind an explicit opt-in when capture is enabled by the merchant.

## Dependencies

### Used by

 - [sc-checkout](..)

### Depends on

- [sc-dialog](../../../../ui/sc-dialog)
- [sc-dashboard-module](../../../../ui/dashboard-module)
- [sc-flex](../../../../ui/flex)
- [sc-icon](../../../../ui/icon)
- [sc-button](../../../../ui/button)

### Graph
```mermaid
graph TD;
  sc-checkout-geo-permission --> sc-dialog
  sc-checkout-geo-permission --> sc-dashboard-module
  sc-checkout-geo-permission --> sc-flex
  sc-checkout-geo-permission --> sc-icon
  sc-checkout-geo-permission --> sc-button
  sc-dialog --> sc-button
  sc-dialog --> sc-icon
  sc-button --> sc-spinner
  sc-dashboard-module --> sc-alert
  sc-alert --> sc-icon
  sc-checkout --> sc-checkout-geo-permission
  style sc-checkout-geo-permission fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
