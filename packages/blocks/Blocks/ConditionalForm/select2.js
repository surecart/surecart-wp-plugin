import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import Select from 'react-select';

function Select2( props ) {
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

	const [ selectedValue, setSelectedValue ] = useState( value );

	// handle selection
	// should fix, need proper naming for variables
	//eslint-disable-next-line no-shadow
	const handleChange = ( value ) => {
		setSelectedValue( value );

		if ( onChangeCB ) {
			onChangeCB( value );
		}
	};

	return (
		<div className="sc-select2-field">
			<div className="sc-selection-field">
				{ label && (
					<label>
						{ label }
					</label>
				) }

				<Select
					className="sc-select2-input"
					classNamePrefix="sc"
					name={ `${ name }` }
					isMulti={ isMulti }
					isClearable={ true }
					value={ selectedValue }
					getOptionLabel={ ( e ) => e.label }
					getOptionValue={ ( e ) => e.value }
					options={ options }
					onChange={ handleChange }
					placeholder={ placeholder }
					// cacheOptions
					{ ...attr }
				/>
			</div>
			{ desc && (
				<div className="sc-field__desc">
					{ desc }
				</div>
			) }
		</div>
	);
}

export default Select2;
