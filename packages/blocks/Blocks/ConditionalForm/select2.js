import React, { useState } from 'react';
import Select from 'react-select';
import Select2InternalStyles, { select2StyleOptions } from './select2styles';

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
      <Select2InternalStyles />
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
          styles={select2StyleOptions}
				/>
			</div>
			{desc && <div className="sc-field__desc">{desc}</div>}
		</div>
	);
}

export default Select2;
