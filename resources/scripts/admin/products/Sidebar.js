/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __, sprintf } = wp.i18n;
const { format } = wp.date;
const { Fragment } = wp.element;

import Box from '../ui/Box';
import ArchiveToggle from './components/ArchiveToggle';
import Definition from '../ui/Definition';
import {
	CeFormRow,
	CeButton,
	CeFormControl,
	CeSwitch,
} from '@checkout-engine/react';

import { getFormattedPrice } from '../util';

export default ( { loading, product } ) => {
	return (
		<Fragment>
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
			>
				<Fragment>
					<Definition
						title={ __(
							'Available for purchase',
							'checkout_engine'
						) }
					>
						<ArchiveToggle />
					</Definition>
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
							title={ __( 'Created On', 'checkout_engine' ) }
						>
							{ format(
								'F j, Y',
								new Date( product.created_at * 1000 )
							) }
						</Definition>
					) }
				</Fragment>
			</Box>
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
						{ __( 'Automations', 'checkout_engine' ) }
					</div>
				}
				css={ css`
					font-size: 14px;
				` }
				footer={
					<CeButton>
						<svg
							slot="prefix"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="12" y1="5" x2="12" y2="19"></line>
							<line x1="5" y1="12" x2="19" y2="12"></line>
						</svg>

						{ __( 'Add Automation', 'checkout_engine' ) }
					</CeButton>
				}
			>
				To get started, add an automation.
			</Box>
		</Fragment>
	);
};
