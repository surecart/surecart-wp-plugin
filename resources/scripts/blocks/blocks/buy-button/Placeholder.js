/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Placeholder, Button } from '@wordpress/components';

import { button as icon } from '@wordpress/icons';

import PriceChoices from '../checkout/components/PriceChoices';

export default ( { setAttributes } ) => {
	const [ line_items, setLineItems ] = useState( [ { quantity: 1 } ] );

	const removeLineItem = ( index ) => {
		setLineItems( line_items.filter( ( _, i ) => i !== index ) );
	};

	const updateLineItem = ( data, index ) => {
		setLineItems(
			line_items.map( ( item, i ) => {
				if ( i !== index ) return item;
				return {
					...item,
					...data,
				};
			} )
		);
	};

	const addLineItem = () => {
		setLineItems( [
			...( line_items || [] ),
			{
				quantity: 1,
			},
		] );
	};

	return (
		<Placeholder
			icon={ icon }
			label={ __( 'Select some products', 'checkout_engine' ) }
		>
			<div
				css={ css`
					display: grid;
					gap: 0.5em;
					width: 100%;
				` }
			>
				<PriceChoices
					choices={ line_items }
					onAddProduct={ addLineItem }
					onUpdate={ updateLineItem }
					onRemove={ removeLineItem }
					onNew={ () => {} }
				/>
				<hr />
				<div
					css={ css`
						display: flex;
						justify-content: flex-end;
					` }
				>
					<Button
						isPrimary
						onClick={ () => setAttributes( { line_items } ) }
					>
						{ __( 'Create Buy Button', 'checkout_engine' ) }
					</Button>
				</div>
			</div>
		</Placeholder>
	);
};
