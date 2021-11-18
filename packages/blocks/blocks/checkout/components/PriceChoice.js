/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import SelectPrice from '../../../components/SelectPrice';
import {
	CeInput,
	CeButton,
	CeDropdown,
	CeMenu,
	CeMenuItem,
} from '@checkout-engine/react';
import { Icon, trash, moreHorizontalMobile } from '@wordpress/icons';

export default ( { choice, onUpdate, onSelect, onRemove } ) => {
	const renderDropDown = () => {
		return (
			<CeDropdown slot="suffix" position="bottom-right">
				<CeButton type="text" slot="trigger" circle>
					<Icon icon={ moreHorizontalMobile } />
				</CeButton>
				<CeMenu>
					<CeMenuItem onClick={ onRemove }>
						<Icon
							slot="prefix"
							style={ {
								opacity: 0.5,
							} }
							icon={ trash }
							size={ 20 }
						/>
						{ __( 'Remove', 'checkout_engine' ) }
					</CeMenuItem>
				</CeMenu>
			</CeDropdown>
		);
	};
	return (
		<div
			css={ css`
				display: flex;
				align-items: center;
				gap: 1em;
			` }
		>
			<SelectPrice
				css={ css`
					flex: 0 1 50%;
				` }
				onSelect={ onSelect }
			/>
			<div
				css={ css`
					width: 48px;
				` }
			>
				<CeInput
					type="number"
					value={ choice?.quantity }
					onCeChange={ ( e ) => onUpdate( { quantity: e.detail } ) }
				/>
			</div>
			<div
				css={ css`
					margin-left: auto;
				` }
			>
				{ choice?.id }
			</div>
			<div>{ renderDropDown() }</div>
		</div>
	);
};
