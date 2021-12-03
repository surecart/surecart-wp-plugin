/** @jsx jsx */

import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import {
	CeInput,
	CeButton,
	CeSwitch,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/react';
import {
	Icon,
	box,
	trash,
	addSubmenu,
	moreHorizontalMobile,
} from '@wordpress/icons';
import usePromotionData from '../hooks/usePromotionData';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import { dispatch } from '@wordpress/data';
import { store } from '../store';
import { store as coreStore } from '../../store/data';

export default () => {
	const {
		promotions,
		updatePromotion,
		loading,
		addEmptyPromotion,
		archivedPromotions,
		hasArchivedPromotions,
		togglePromotionArchive,
	} = usePromotionData();

	const [ showArchived, setShowArchived ] = useState( false );

	const renderLoading = () => {
		return (
			<div
				css={ css`
					display: grid;
					gap: 0.5em;
				` }
			>
				<ce-skeleton
					style={ {
						'--border-radius':
							'var(--ce-input-border-radius-medium)',
						height: 'var( --ce-input-height-medium )',
						width: '100%',
					} }
				></ce-skeleton>
				<ce-skeleton
					style={ {
						width: '80%',
					} }
				></ce-skeleton>
			</div>
		);
	};

	useEffect( () => {
		if ( ! loading && ! promotions?.length ) {
			dispatch( store ).addEmptyPromotion();
		}
	}, [ promotions, loading ] );

	const onArchive = ( index ) => {
		togglePromotionArchive( index );
	};

	// delete promotion
	const onDelete = ( index ) => {
		dispatch( coreStore ).deleteModel( 'promotions', index );
	};

	const renderPromotionsList = ( { archived } = { archived: undefined } ) => {
		return ( promotions || [] ).map( ( promotion, index ) => {
			if ( archived && ! promotion.archived ) return null;
			if ( ! archived && promotion.archived ) return null;

			return (
				<div
					key={ index }
					css={ css`
						display: flex;
						justify-content: center;
						gap: 1em;
					` }
				>
					<CeInput
						className="ce-promotion-code"
						css={ css`
							flex: 1;
						` }
						help={ __(
							'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
							'checkout_engine'
						) }
						attribute="name"
						value={ promotion?.code }
						onCeChange={ ( e ) =>
							updatePromotion( { code: e.target.value }, index )
						}
					/>
					<CeDropdown slot="suffix" position="bottom-right">
						<CeButton type="text" slot="trigger" circle>
							<Icon icon={ moreHorizontalMobile } />
						</CeButton>
						<CeMenu>
							{ promotion?.id && (
								<CeMenuItem
									onClick={ () => onArchive( index ) }
								>
									<Icon
										slot="prefix"
										style={ {
											opacity: 0.5,
										} }
										icon={ box }
										size={ 20 }
									/>
									{ promotion?.archived
										? __( 'Un-Archive', 'checkout_engine' )
										: __( 'Archive', 'checkout_engine' ) }
								</CeMenuItem>
							) }
							<CeMenuItem onClick={ () => onDelete( index ) }>
								<Icon
									slot="prefix"
									style={ {
										opacity: 0.5,
									} }
									icon={ trash }
									size={ 20 }
								/>
								{ __( 'Delete', 'checkout_engine' ) }
							</CeMenuItem>
						</CeMenu>
					</CeDropdown>
				</div>
			);
		} );
	};

	return (
		<Box
			title={ __( 'Promotion Codes', 'checkout_engine' ) }
			footer={
				! loading && (
					<Fragment>
						<CeButton
							class={ 'ce-promotion-code-add' }
							onClick={ ( e ) => {
								e.preventDefault();
								addEmptyPromotion();
							} }
						>
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
							{ __(
								'Add Another Promotion Code',
								'checkout_engine'
							) }
						</CeButton>
						{ !! hasArchivedPromotions && (
							<div
								css={ css`
									display: flex;
									justify-content: flex-end;
								` }
							>
								<CeSwitch
									checked={ !! showArchived }
									onClick={ ( e ) => {
										e.preventDefault();
										setShowArchived( ! showArchived );
									} }
								>
									{ sprintf(
										! showArchived
											? __(
													'Show %d Archived Promotion Codes',
													'checkout_engine'
											  )
											: __(
													'Hide %d Archived Promotion Codes',
													'checkout_engine'
											  ),
										archivedPromotions?.length
									) }
								</CeSwitch>
							</div>
						) }
					</Fragment>
				)
			}
		>
			{ loading ? renderLoading() : renderPromotionsList() }
			{ !! hasArchivedPromotions &&
				!! showArchived &&
				renderPromotionsList( { archived: true } ) }
		</Box>
	);
};
