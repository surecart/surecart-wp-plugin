import dotProp from 'dot-prop-immutable';
import { useSelect } from '@wordpress/data';
import { CeChoice, CeChoices, CeFormSection } from '@checkout-engine/react';

export default ( { choice, attributes, setAttributes, id } ) => {
	const { choices } = attributes;

	const product = useSelect( ( select ) =>
		select( 'checkout-engine/data' ).selectModelById( 'products', id )
	);

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

	const addPrice = ( id ) => {
		setAttributes( {
			choices: dotProp.set( choices, `${ id }.prices`, ( list ) => [
				...list,
				id,
			] ),
		} );
	};

	const removePrice = ( id ) => {
		setAttributes( {
			choices: dotProp.set(
				choices,
				`${ id }.prices`,
				choices[ index ].prices.filter( ( price ) => price !== id )
			),
		} );
	};

	return (
		<CeFormSection label={ product.name }>
			<CeChoices>
				{ product.prices.map( ( price, index ) => {
					return (
						<CeChoice
							key={ price.id }
							type="checkbox"
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
							{ price.name }
							<span slot="description">{ price.amount }</span>
						</CeChoice>
					);
				} ) }
			</CeChoices>
		</CeFormSection>
	);
};
