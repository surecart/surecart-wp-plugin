import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import AsyncSelect from 'react-select/async';

function SelectCoupons( props ) {
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

	const loadOptions = ( inputValue ) => {
		if ( inputValue.length >= 3 ) {
			return new Promise( ( resolve ) => {
				apiFetch( {
					path: addQueryArgs(`surecart/v1/coupons`, {
            query: inputValue,
            archived: false,
          }),
				} ).then( ( res ) => {

          let results = [];

          if( res ) {
            results = res.map(function(element, index) {
              return {
                label: element.name,
                value: element.id
              };
            });

          }
					resolve( results );
				} );
			} );
		}
	};

	return (
		<div className="sc-select2-field sc-product-field">
			<div className="sc-selection-field">
				{ label && (
					<label>
						{ label }
					</label>
				) }

				<AsyncSelect
					className="sc-select2-input"
					classNamePrefix="sc"
					name={ `${ name }` }
					isMulti={ isMulti }
					isClearable={ true }
					value={ selectedValue }
					getOptionLabel={ ( e ) => e.label }
					getOptionValue={ ( e ) => e.value }
					loadOptions={ loadOptions }
					onChange={ handleChange }
					placeholder={ placeholder }
					cacheOptions
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

export default SelectCoupons;
