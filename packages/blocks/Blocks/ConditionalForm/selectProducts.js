import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import AsyncSelect from 'react-select/async';

function SelectProducts( props ) {
	const {
		label,
		name,
		desc,
		value,
		allowed_products = [],
		include_products = [],
		excluded_products = [],
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
			const formData = new window.FormData();
			formData.append( 'allowed_products', allowed_products );
			formData.append( 'include_products', include_products );
			formData.append( 'exclude_products', excluded_products );

			formData.append( 'action', 'sc_json_search_products' );
			// formData.append(
			// 	'security',
			// 	cartflows_admin.json_search_products_nonce
			// );

			formData.append( 'term', inputValue );
			formData.append( 'query', inputValue );


			return new Promise( ( resolve ) => {
				apiFetch( {
					// url: surecart/v1/products,
					path: addQueryArgs(`surecart/v1/products`, {
            query: inputValue,
            archived: false,
            expand: ['prices'],
          }),
					// method: 'POST',
					// body: formData,
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
          debugger;
					resolve( results );
				} );
			} );
		}
	};

	return (
		<div className="wcf-select2-field wcf-product-field">
			<div className="wcf-selection-field">
				{ label && (
					<label>
						{ label }
					</label>
				) }

				<AsyncSelect
					className="wcf-select2-input"
					classNamePrefix="wcf"
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
				<div className="wcf-field__desc">
					{ desc }
				</div>
			) }
		</div>
	);
}

export default SelectProducts;
