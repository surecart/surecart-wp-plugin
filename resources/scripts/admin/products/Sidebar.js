/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __, sprintf } = wp.i18n;
const { format } = wp.date;
const { Fragment } = wp.element;

import Box from '../ui/Box';
import Definition from '../ui/Definition';
import { CeFormRow } from '@checkout-engine/react';

import { getFormattedPrice } from '../util';

export default ( { loading, product } ) => {
	const statusTag = () => {
		if ( ! product?.id ) {
			return <ce-tag>{ __( 'Draft', 'checkout_engine' ) }</ce-tag>;
		}

		if ( product.archived_at ) {
			return <ce-tag>{ __( 'Archived', 'checkout_engine' ) }</ce-tag>;
		}

		return (
			<ce-tag type="success">
				{ __( 'Active', 'checkout_engine' ) }
			</ce-tag>
		);
	};

	return (
		<Box
			loading={ loading }
			title={
				<div
					css={ css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					` }
				>
					{ __( 'Summary', 'checkout_engine' ) }
				</div>
			}
			css={ css`
				font-size: 14px;
			` }
			footer={
				<div style={ { width: '100%' } }>
					{ !! product?.archived_at && (
						<Definition
							css={ css`
								margin-bottom: 1em;
							` }
							title={ __( 'Archived On', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( product?.archived_at * 1000 )
							) }
						</Definition>
					) }
					{ !! product?.updated_at && (
						<Definition
							title={ __( 'Last Updated', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( product.updated_at * 1000 )
							) }
						</Definition>
					) }
					{ !! product?.created_at && (
						<Definition
							title={ __( 'Created', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( product.created_at * 1000 )
							) }
						</Definition>
					) }
				</div>
			}
		>
			<Fragment>
				<Definition title={ __( 'Status', 'checkout_engine' ) }>
					{ statusTag() }
				</Definition>
			</Fragment>
		</Box>
	);
};
