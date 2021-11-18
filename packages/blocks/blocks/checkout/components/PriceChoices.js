/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import PriceChoice from './PriceChoice';

export default ( { attributes, setAttributes } ) => {
	const { choices } = attributes;

	const removeChoice = ( index ) => {
		setAttributes( {
			choices: choices.filter( ( item, i ) => i !== index ),
		} );
	};

	const updateChoice = ( data, index ) => {
		setAttributes( {
			choices: choices.map( ( item, i ) => {
				if ( i !== index ) return item;
				return {
					...item,
					...data,
				};
			} ),
		} );
	};

	return (
		<div
			css={ css`
				display: grid;
				gap: 1em;
			` }
		>
			{ ( choices || [] ).map( ( choice, index ) => {
				return (
					<PriceChoice
						choice={ choice }
						onSelect={ ( id ) => updateChoice( { id }, index ) }
						onRemove={ () => removeChoice( index ) }
						onUpdate={ () => {} }
					/>
				);
			} ) }

			<div
				css={ css`
					display: flex;
					gap: 0.5em;
					align-items: center;
				` }
			>
				<Button
					isPrimary
					onClick={ () =>
						setAttributes( {
							choices: [
								...( choices || [] ),
								{
									quantity: 1,
								},
							],
						} )
					}
				>
					{ __( 'Add Product', 'checkout_engine' ) }
				</Button>
			</div>
		</div>
	);
};
