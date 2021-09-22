import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { CeButton, CeFormRow } from '@checkout-engine/react';
import SelectProduct from './SelectProduct';
import Choice from './Choice';

export default ( { attributes, setAttributes } ) => {
	const [ open, setOpen ] = useState( false );
	const { choices } = attributes;

	const clear = () => {
		setAttributes( { choices: [] } );
	};

	return (
		<div>
			<CeButton onClick={ clear }>Clear</CeButton>
			{ Object.keys( choices ).map( ( id ) => {
				const product = choices[ id ];
				return (
					<Choice
						attributes={ attributes }
						setAttributes={ setAttributes }
						id={ id }
						key={ product.id }
						choice={ product }
					/>
				);
			} ) }
			<CeFormRow>
				<CeButton type="primary" onClick={ () => setOpen( true ) }>
					{ __( 'Add Product', 'checkout_engine' ) }
				</CeButton>
				<CeButton onClick={ () => setOpen( true ) }>
					{ __( 'Create Product', 'checkout_engine' ) }
				</CeButton>
			</CeFormRow>
			{ open && (
				<SelectProduct
					attributes={ attributes }
					setAttributes={ setAttributes }
					onRequestClose={ () => setOpen( false ) }
				/>
			) }
		</div>
	);
};
