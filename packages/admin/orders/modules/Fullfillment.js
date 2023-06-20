/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScTag,
} from '@surecart/components-react';
import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../ui/Box';

const status = {
	unfulfilled: __('Unfulfilled', 'surecart'),
	fulfilled: __('Fulfilled', 'surecart'),
	on_hold: __('On Hold', 'surecart'),
	scheduled: __('Scheduled', 'surecart'),
	partially_fulfilled: __('Partially Fulfilled', 'surecart'),
};

const type = {
	unfulfilled: 'warning',
	fulfilled: 'success',
	on_hold: 'warning',
	scheduled: 'gray',
	partially_fulfilled: 'warning',
};

const icon = {
	unfulfilled: 'circle',
	fulfilled: 'check-circle',
	on_hold: 'pause-circle',
	scheduled: 'clock',
	partially_fulfilled: 'circle',
};

export default ({ orderId, loading }) => {
	// get fulfillment data from order id.
	const fulfillment = {
		status: 'partially_fulfilled',
	};

	const statusBadge = () => {
		if (!fulfillment?.status) {
			return null;
		}

		return (
			<ScIcon
				css={css`
					font-size: 22px;
					color: var(--sc-color-${type?.[fulfillment?.status]}-500);
				`}
				name={icon[fulfillment?.status]}
			/>
		);
	};

	const actionsDropdownItems = [
		...(fulfillment?.status === 'unfulfilled'
			? [
					{
						title: __('Hold fulfillment', 'surecart'),
						modal: 'hold',
					},
			  ]
			: []),
		...(fulfillment?.status === 'fulfilled'
			? [
					{
						title: __('Print packing slip', 'surecart'),
						modal: 'print_slip',
					},
					{
						title: __('Cancel fulfillment', 'surecart'),
						modal: 'cancel',
						css: css`
							--sc-menu-item-color: var(--sc-color-danger-600);
						`,
					},
			  ]
			: []),
	];

	return (
		<Box
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					{statusBadge()}
					{status[fulfillment?.status] || fulfillment?.status}
					<ScTag
						css={css`
							font-size: 12px;
						`}
						pill
						type={type[fulfillment?.status]}
					>
						{sprintf(_n('%d Item', '%d Items', 2, 'surecart'), 2)}
					</ScTag>
				</div>
			}
			loading={loading}
			header_action={
				!!actionsDropdownItems?.length && (
					<ScDropdown placement="bottom-end">
						<ScButton
							circle
							type="text"
							style={{
								'--button-color': 'var(--sc-color-gray-600)',
								margin: '-10px',
							}}
							slot="trigger"
						>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							{actionsDropdownItems.map(
								({ title, css }, index) => {
									return (
										<ScMenuItem key={index} css={css}>
											{title}
										</ScMenuItem>
									);
								}
							)}
						</ScMenu>
					</ScDropdown>
				)
			}
			footer={
				<ScButton>
					<ScIcon name="package" slot="prefix" />
					{__('Fulfill Items', 'surecart')}
				</ScButton>
			}
		></Box>
	);
};
