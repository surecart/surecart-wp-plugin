import React, { useState } from 'react';
import Select from 'react-select';
import { Global, css } from '@emotion/react';

function Select2(props) {
	const {
		label,
		name,
		desc,
		value,
		placeholder,
		onChangeCB,
		options,
		attr,
		isMulti = false,
	} = props;

	const [selectedValue, setSelectedValue] = useState(value);

	const handleChange = (value) => {
		setSelectedValue(value);

		if (onChangeCB) {
			onChangeCB(value);
		}
	};

	return (
		<div className="sc-select2-field">
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

			<div className="sc-selection-field">
				{label && <label>{label}</label>}

				<Select
					className="sc-select2-input"
					classNamePrefix="sc"
					name={`${name}`}
					isMulti={isMulti}
					isClearable={true}
					value={selectedValue}
					getOptionLabel={(e) => e.label}
					getOptionValue={(e) => e.value}
					options={options}
					onChange={handleChange}
					placeholder={placeholder}
					{...attr}
					styles={{
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
					}}
				/>
			</div>
			{desc && <div className="sc-field__desc">{desc}</div>}
		</div>
	);
}

export default Select2;
