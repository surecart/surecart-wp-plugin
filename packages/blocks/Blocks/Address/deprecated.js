export default [
	{
		attributes: {
			label: {
				type: 'string',
				default: 'Address',
			},
			full: {
				type: 'boolean',
			},
			show_name: {
				type: 'boolean',
			},
		},
		supports: {
			className: false,
		},
		save({ attributes, className }) {
			const { label, full, show_name } = attributes;
			return (
				<sc-order-shipping-address
					className={className}
					label={label}
					full={full ? '1' : null}
					show-name={show_name ? '1' : null}
				></sc-order-shipping-address>
			);
		},
	},
	{
		attributes: {
			label: {
				type: 'string',
				default: 'Address',
			},
		},
		save({ attributes, className }) {
			const { label } = attributes;
			return (
				<sc-order-shipping-address
					className={className}
					label={label}
				></sc-order-shipping-address>
			);
		},
	},
  {
    attributes: {
      label: {
        type: "string",
        default: "Address"
      },
      full: {
        type: "boolean",
        default: true
      },
      show_name: {
        type: "boolean"
      }
    },
    save({ attributes, className }) {
      const { label, full, show_name } = attributes;
      return (
        <sc-order-shipping-address
          className={className}
          label={label}
          full={full ? '1' : null}
          show-name={show_name ? '1' : null}
        ></sc-order-shipping-address>
      );
    }
  }
];
