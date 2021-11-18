/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
	CeButton,
	CeMenuItem,
	CeDropdown,
	CeMenu,
} from '@checkout-engine/react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import useChargesData from '../hooks/useChargesData';
import { formatTime } from '../../util/time';
import { Fragment } from '@wordpress/element';
import { Icon, verse, undo, moreHorizontalMobile } from '@wordpress/icons';

export default () => {
	const { charges, loading } = useChargesData();

	const renderStatusTag = ( charge ) => {
		if ( charge?.fully_refunded ) {
			return (
				<ce-tag type="danger">
					{ __( 'Refunded', 'checkout_engine' ) }
				</ce-tag>
			);
		}

		if ( charge?.refunded_amount ) {
			return (
				<ce-tag>
					{ __( 'Partially Refunded', 'checkout_engine' ) }
				</ce-tag>
			);
		}

		return (
			<ce-tag type="success">{ __( 'Paid', 'checkout_engine' ) }</ce-tag>
		);
	};

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	const label = css`
		font-size: 11px;
		margin-bottom: 1em;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	`;

	const renderCharges = () => {
		return (
			<div
				css={ css`
					display: grid;
					align-items: center;
					min-width: 100%;
					grid-template-columns:
						minmax( 150px, 1fr )
						minmax( 150px, 2fr )
						minmax( 28px, 0.5fr )
						minmax( 28px, 0.5fr )
						minmax( 28px, 0.5fr );
				` }
			>
				<Fragment>
					<div css={ label }>Amount</div>
					<div css={ label }>Date</div>
					<div css={ label }>Status</div>
					<div css={ label }>Mode</div>
					<div css={ label }></div>
				</Fragment>
				{ ( charges || [] ).map( ( charge ) => {
					return (
						<Fragment>
							<ce-text
								style={ {
									'--font-weight':
										'var(--ce-font-weight-bold)',
								} }
							>
								<ce-format-number
									type="currency"
									currency={ charge?.currency }
									value={ charge?.amount }
								></ce-format-number>
							</ce-text>
							{ !! charge?.created_at && (
								<div>
									{ formatTime( charge.created_at, {
										dateStyle: 'medium',
										timeStyle: 'short',
									} ) }
								</div>
							) }
							<div>{ renderStatusTag( charge ) }</div>
							<div>
								<ce-tag
									type={
										charge?.live_mode
											? 'success'
											: 'warning'
									}
								>
									{ charge?.live_mode
										? __( 'Live Mode', 'checkout_engine' )
										: __( 'Test Mode', 'checkout_engine' ) }
								</ce-tag>
							</div>
							<div
								css={ css`
									text-align: right;
								` }
							>
								<CeDropdown
									slot="suffix"
									position="bottom-right"
								>
									<CeButton type="text" slot="trigger" circle>
										<Icon icon={ moreHorizontalMobile } />
									</CeButton>
									<CeMenu>
										<CeMenuItem>
											<Icon
												slot="prefix"
												style={ {
													opacity: 0.5,
												} }
												icon={ undo }
												size={ 20 }
											/>
											{ __(
												'Refund...',
												'checkout_engine'
											) }
										</CeMenuItem>
										<CeMenuItem>
											<Icon
												slot="prefix"
												style={ {
													opacity: 0.5,
												} }
												icon={ verse }
												size={ 20 }
											/>
											{ __( 'Edit', 'checkout_engine' ) }
										</CeMenuItem>
									</CeMenu>
								</CeDropdown>
							</div>
						</Fragment>
					);
				} ) }
			</div>
		);
	};

	const renderEmpty = () => {
		return <div>{ __( 'No Charges', 'checkout_engine' ) }</div>;
	};

	const render = () => {
		if ( loading ) {
			return renderLoading();
		}

		if ( ! charges?.length ) {
			return renderEmpty();
		}

		return renderCharges();
	};

	return <Box title={ __( 'Charges', 'checkout_engine' ) }>{ render() }</Box>;
};
