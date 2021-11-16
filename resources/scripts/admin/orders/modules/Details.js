/** @jsx jsx */

import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import {
	CeInput,
	CeButton,
	CeSwitch,
	CeDropdown,
	CeMenu,
	CeMenuItem,
	CeTag,
} from '@checkout-engine/react';
import {
	Icon,
	box,
	trash,
	addSubmenu,
	moreHorizontalMobile,
} from '@wordpress/icons';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { css, jsx } from '@emotion/core';
import { dispatch } from '@wordpress/data';
import { store } from '../store';
import { store as coreStore } from '../../store/data';
import useOrderData from '../hooks/useOrderData';
import { formatTime } from '../../util/time';

export default () => {
	const { order, loading } = useOrderData();

	if ( ! order?.id ) {
		return null;
	}

	const renderBadge = ( status ) => {
		switch ( status ) {
			case 'paid':
				return (
					<ce-tag type="success">
						{ __( 'Paid', 'checkout_engine' ) }
					</ce-tag>
				);
			case 'finalized':
				return (
					<ce-tag type="warning">
						{ __( 'Pending Payment', 'checkout_engine' ) }
					</ce-tag>
				);
			default:
				return <ce-tag>{ status }</ce-tag>;
		}
	};
	return (
		<div
			css={ css`
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 2em;
				margin-bottom: 2em;
			` }
		>
			<div>
				<div
					css={ css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					` }
				>
					<h1>
						<ce-format-number
							type="currency"
							currency={ order?.currency }
							value={ order?.total_amount }
						></ce-format-number>
					</h1>
					{ renderBadge( order.status ) }
				</div>
				{ formatTime( order.updated_at ) }
			</div>
			<div>
				{ order?.live_mode ? (
					<ce-tag type="success">
						{ __( 'Live Mode', 'checkout_engine' ) }
					</ce-tag>
				) : (
					<ce-tag type="warning">
						{ __( 'Test Mode', 'checkout_engine' ) }{ ' ' }
					</ce-tag>
				) }
			</div>
		</div>
	);
};
