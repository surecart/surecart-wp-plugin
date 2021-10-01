import dotProp from 'dot-prop-immutable';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import {
	CeCheckbox,
	CeFormControl,
	CeFormRow,
	CeFormatNumber,
} from '@checkout-engine/react';

export default ( { choice, attributes, setAttributes, id } ) => {
	const { choices } = attributes;
	const [ product, setProduct ] = useState( null );
	const [ loading, setLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		fetchProduct();
	}, [ id ] );

	const fetchProduct = async () => {
		setLoading( true );
		let result;

		try {
			result = await apiFetch( {
				path: `checkout-engine/v1/products/${ id }`,
			} );
		} catch ( e ) {
			setError(
				e?.message || __( 'Something went wrong', 'checkout_engine' )
			);
		} finally {
			setLoading( false );
		}

		setProduct( result );
	};

	if ( loading ) {
		console.log( { choice } );
		return (
			<CeFormRow>
				<CeFormControl>
					<ce-skeleton
						slot="label"
						style={ { width: '20px', display: 'block' } }
					></ce-skeleton>
					{ choice.prices.map( () => {
						return (
							<ce-skeleton
								style={ {
									width: '140px',
									display: 'block',
								} }
							></ce-skeleton>
						);
					} ) }
				</CeFormControl>
			</CeFormRow>
		);
	}

	if ( error ) {
		return <div>{ error }</div>;
	}

	if ( ! product ) {
		return (
			<ce-choices>
				<ce-choice name="loading" disabled>
					<ce-skeleton
						style={ { width: '60px', display: 'inline-block' } }
					></ce-skeleton>
					<ce-skeleton
						style={ { width: '140px', display: 'inline-block' } }
						slot="description"
					></ce-skeleton>
					<ce-skeleton
						style={ { width: '20px', display: 'inline-block' } }
						slot="price"
					></ce-skeleton>
					<ce-skeleton
						style={ { width: '40px', display: 'inline-block' } }
						slot="per"
					></ce-skeleton>
				</ce-choice>
			</ce-choices>
		);
	}

	const addPrice = ( priceId ) => {
		setAttributes( {
			choices: dotProp.set( choices, `${ id }.prices`, ( list ) => [
				...list,
				priceId,
			] ),
		} );
	};

	const removePrice = ( priceId ) => {
		setAttributes( {
			choices: dotProp.set(
				choices,
				`${ id }.prices`,
				choices[ id ].prices.filter( ( price ) => price !== priceId )
			),
		} );
	};

	return (
		<CeFormRow>
			<CeFormControl label={ product.name }>
				{ product.prices.map( ( price, index ) => {
					return (
						<CeCheckbox
							style={ { display: 'block' } }
							key={ price.id }
							value={ price.id }
							onCeChange={ ( e ) => {
								if ( e.target.checked ) {
									addPrice( e.target.value );
								} else {
									removePrice( e.target.value );
								}
							} }
							checked={ choice.prices.find(
								( id ) => id === price.id
							) }
						>
							{ price.name }{ ' ' }
							<span style={ { opacity: '0.5' } }>
								<CeFormatNumber
									type="currency"
									currency={ price.currency }
									value={ price.amount }
								/>
							</span>
						</CeCheckbox>
					);
				} ) }
			</CeFormControl>
		</CeFormRow>
	);
};
