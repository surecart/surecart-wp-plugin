import React from 'react';
import { Global, css } from '@emotion/react';

function Select2InternalStyles() {
	return (
		<Global
			styles={css`
				.sc__indicator.sc__dropdown-indicator svg {
					width: 13px !important;
					height: 13px !important;
				}
				.sc__indicator.sc__clear-indicator svg {
					width: 13px !important;
				}
			`}
		/>
	);
}

export const select2StyleOptions = {
	control: (baseStyles) => {
		return {
			...baseStyles,
			borderWidth: 'var(--sc-input-border-width)',
			borderColor:
				'var(--sc-select-border-color, var(--sc-color-gray-300))',
			boxShadow: 'var(--sc-shadow-small)',
			minHeight: '36px',
			'&:hover': {
				borderColor:
					'var(--sc-select-border-color, var(--sc-color-gray-300))',
			},
		};
	},
	valueContainer: (baseStyles) => {
		return {
			...baseStyles,
			padding: '0 8px',
		};
	},
	indicatorSeparator: () => {
		return {
			width: 0,
			margin: 0,
		};
	},
	input: (baseStyles) => {
		return {
			...baseStyles,
			marginTop: 0,
			marginBottom: 0,
			boxShadow: 'none',
		};
	},
	clearIndicator: (baseStyles) => {
		return {
			...baseStyles,
			color: 'var(--sc-input-color)',
			padding: '7px 8px',
		};
	},
	dropdownIndicator: (baseStyles) => {
		return {
			...baseStyles,
			color: 'var(--sc-input-color)',
			'&:hover': { color: 'var(--sc-input-color)' },
			padding: '9px 8px',
		};
	},
};

export default Select2InternalStyles;
