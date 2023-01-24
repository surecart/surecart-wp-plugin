import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import AsyncSelect from 'react-select/async';
import Select2InternalStyles, { select2StyleOptions } from './select2styles';

function SelectProducts(props) {
	const {
		label,
		name,
		desc,
		value,
		placeholder,
		onChangeCB,
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

	const loadOptions = (inputValue) => {
		if (inputValue.length >= 3) {
			return new Promise((resolve) => {
				apiFetch({
					path: addQueryArgs(`surecart/v1/products`, {
						query: inputValue,
						archived: false,
						expand: ['prices'],
					}),
				}).then((res) => {
					let results = [];

					if (res) {
						results = res.map(function (element, index) {
							return {
								label: element.name,
								value: element.id,
							};
						});
					}
					resolve(results);
				});
			});
		}
	};

	return (
		<div className="sc-select2-field sc-product-field">
      <Select2InternalStyles />
			<div className="sc-selection-field">
				{label && <label>{label}</label>}

				<AsyncSelect
					className="sc-select2-input"
					classNamePrefix="sc"
					name={`${name}`}
					isMulti={isMulti}
					isClearable={true}
					value={selectedValue}
					getOptionLabel={(e) => e.label}
					getOptionValue={(e) => e.value}
					loadOptions={loadOptions}
					onChange={handleChange}
					placeholder={placeholder}
					cacheOptions
					{...attr}
          styles={select2StyleOptions}
				/>
			</div>
			{desc && <div className="sc-field__desc">{desc}</div>}
		</div>
	);
}

export default SelectProducts;
