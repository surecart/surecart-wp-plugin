/** @jsx jsx */

import { __, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import { formatTime } from '../../util/time';
import useSubscriptionData from '../hooks/useSubscriptionData';

export default () => {
	const { subscription, loading } = useSubscriptionData();

	if ( ! subscription?.id ) {
		return null;
	}

	const renderBadge = ( status ) => {
		switch ( status ) {
			case 'active':
				return (
					<ce-tag type="success">
						{ __( 'Active', 'checkout_engine' ) }
					</ce-tag>
				);
			case 'canceled':
				return (
					<ce-tag type="warning">
						{ __( 'Canceled', 'checkout_engine' ) }
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
							currency={ subscription?.currency }
							value={ subscription?.total_amount }
						></ce-format-number>
					</h1>
					{ renderBadge( subscription.status ) }
				</div>
				{ sprintf(
					__( 'Created on %s', 'checkout_engine' ),
					formatTime( subscription.created_at )
				) }
			</div>
			<div>
				{ subscription?.live_mode ? (
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
