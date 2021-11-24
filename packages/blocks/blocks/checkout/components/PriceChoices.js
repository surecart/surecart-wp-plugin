/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import PriceChoice from './PriceChoice';

export default ( { choices, onUpdate, onRemove, onAddProduct, onNew } ) => {
	const headerStyle = css`
		border-bottom: 1px solid var( --ce-color-gray-300 );
		border-top: 1px solid var( --ce-color-gray-300 );
		padding: 0.5em 0 !important;
		font-weight: bold;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var( --ce-color-gray-600 );
	`;

	const renderTable = () => {
		return (
			<table
				css={ css`
					border-spacing: 0;

					tr td:first-child {
						padding-left: 0;
					}
					tr td:last-child {
						padding-right: 0;
					}
				` }
			>
				<thead>
					<tr
						css={ css`
							text-align: left;
						` }
					>
						<th
							css={ css`
								${ headerStyle };
								width: auto;
							` }
						>
							{ __( 'Product' ) }
						</th>
						<th
							css={ css`
								${ headerStyle };
								max-width: 70px;
								width: 70px;
							` }
						>
							{ __( 'Quantity' ) }
						</th>
						<th
							css={ css`
								${ headerStyle };
								text-align: right;
							` }
						>
							{ __( 'Total' ) }
						</th>
						<th
							css={ css`
								${ headerStyle };
								width: 0.1%;
								white-space: nowrap;
							` }
						></th>
					</tr>
				</thead>

				<tbody>
					{ ( choices || [] ).map( ( choice, index ) => {
						return (
							<PriceChoice
								key={ index }
								choice={ choice }
								onSelect={ ( id ) => onUpdate( { id }, index ) }
								onRemove={ () => onRemove( index ) }
								onUpdate={ ( data ) => onUpdate( data, index ) }
							/>
						);
					} ) }
				</tbody>
			</table>
		);
	};

	const renderEmpty = () => {
		return (
			<div
				css={ css`
					color: var( --ce-color-gray-500 );
				` }
			>
				{ __(
					'To add some products to the form, click the "Add Products" button.',
					'checkout-engine'
				) }
			</div>
		);
	};

	return (
		<div
			css={ css`
				display: grid;
				gap: 1em;
			` }
		>
			{ choices && choices.length > 0 ? renderTable() : renderEmpty() }

			<div
				css={ css`
					display: flex;
					gap: 0.5em;
					align-items: center;
				` }
			>
				<Button isPrimary onClick={ onAddProduct }>
					{ __( 'Add Product', 'checkout_engine' ) }
				</Button>
			</div>
		</div>
	);
};
