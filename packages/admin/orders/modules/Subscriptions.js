/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import {
	CeButton,
	CeMenuItem,
	CeDropdown,
	CeMenu,
} from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import useSubscriptionsData from '../hooks/useSubscriptionsData';
import { formatTime } from '../../util/time';
import { Fragment } from '@wordpress/element';
import { Icon, verse, undo, moreHorizontalMobile } from '@wordpress/icons';

export default () => {
	const { subscriptions, loading } = useSubscriptionsData();

	const renderStatusTag = (subscription) => {
		switch (subscription?.status) {
			case 'incomplete':
				return <ce-tag>{__('Incomplete', 'checkout_engine')}</ce-tag>;
			case 'trialing':
				return (
					<ce-tag type="info">
						{__('Trialing', 'checkout_engine')}
					</ce-tag>
				);
			case 'active':
				return (
					<ce-tag type="success">
						{__('Active', 'checkout_engine')}
					</ce-tag>
				);
			case 'past_due':
				return (
					<ce-tag type="danger">
						{__('Past Due', 'checkout_engine')}
					</ce-tag>
				);
			case 'cancelled':
				return (
					<ce-tag type="warning">
						{__('Cancelled', 'checkout_engine')}
					</ce-tag>
				);
			case 'unpaid':
				return (
					<ce-tag type="warning">
						{__('Unpaid', 'checkout_engine')}
					</ce-tag>
				);
		}

		return <ce-tag type="success">{subscription?.status}</ce-tag>;
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

	const renderSubscriptions = () => {
		return (
			<div
				css={css`
					display: grid;
					align-items: center;
					min-width: 100%;
					grid-template-columns:
						minmax(150px, 1fr)
						minmax(150px, 2fr)
						minmax(28px, 0.5fr)
						minmax(28px, 0.5fr)
						minmax(28px, 0.5fr);
				`}
			>
				<Fragment>
					<div css={label}>Amount</div>
					<div css={label}>Start</div>
					<div css={label}>Status</div>
					<div css={label}>Mode</div>
					<div css={label}></div>
				</Fragment>
				{(subscriptions || []).map((subscription) => {
					return (
						<Fragment>
							<ce-text
								style={{
									'--font-weight':
										'var(--ce-font-weight-bold)',
								}}
							>
								<ce-format-number
									type="currency"
									currency={subscription?.currency}
									value={subscription?.total_amount}
								></ce-format-number>
							</ce-text>
							{!!subscription?.created_at && (
								<div>
									{formatTime(subscription.created_at, {
										dateStyle: 'medium',
										timeStyle: 'short',
									})}
								</div>
							)}
							<div>{renderStatusTag(subscription)}</div>
							<div>
								<ce-tag
									type={
										subscription?.live_mode
											? 'success'
											: 'warning'
									}
								>
									{subscription?.live_mode
										? __('Live Mode', 'checkout_engine')
										: __('Test Mode', 'checkout_engine')}
								</ce-tag>
							</div>
							<div
								css={css`
									text-align: right;
								`}
							>
								<CeDropdown
									slot="suffix"
									position="bottom-right"
								>
									<CeButton type="text" slot="trigger" circle>
										<Icon icon={moreHorizontalMobile} />
									</CeButton>
									<CeMenu>
										<CeMenuItem>
											<Icon
												slot="prefix"
												style={{
													opacity: 0.5,
												}}
												icon={undo}
												size={20}
											/>
											{__(
												'Cancel Subscription...',
												'checkout_engine'
											)}
										</CeMenuItem>
										<CeMenuItem>
											<Icon
												slot="prefix"
												style={{
													opacity: 0.5,
												}}
												icon={verse}
												size={20}
											/>
											{__('Edit', 'checkout_engine')}
										</CeMenuItem>
									</CeMenu>
								</CeDropdown>
							</div>
						</Fragment>
					);
				})}
			</div>
		);
	};

	const renderEmpty = () => {
		return <div>{__('No Charges', 'checkout_engine')}</div>;
	};

	const render = () => {
		if (loading) {
			return renderLoading();
		}

		if (!subscriptions?.length) {
			return renderEmpty();
		}

		return renderSubscriptions();
	};

	return <Box title={__('Subscriptions', 'checkout_engine')}>{render()}</Box>;
};
