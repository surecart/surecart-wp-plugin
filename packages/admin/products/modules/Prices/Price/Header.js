/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScTag,
	ScButton,
	ScDropdown,
	ScMenu,
	ScMenuItem,
	ScFormatNumber,
} from '@surecart/components-react';
import { Icon, box, trash, moreHorizontalMobile } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

import ToggleHeader from '../../../../components/ToggleHeader';
import { intervalString } from '../../../../util/translations';
import Copy from './Copy';

export default ({
	isOpen,
	setIsOpen,
	className,
	price,
	onArchive,
	collapsible,
	onDelete,
}) => {
	const trial = () => {
		return (
			<>
				{!!price?.trial_duration_days && (
					<>
						{' '}
						<sc-tag type="info" size="small">
							{__('Free Trial', 'surecart')}
						</sc-tag>
					</>
				)}
			</>
		);
	};

	const priceType = () => {
		if (price?.recurring_interval) {
			if (price?.recurring_period_count) {
				return (
					<sc-tag
						type="primary"
						size="small"
						style={{
							'--sc-tag-primary-background-color': '#f3e8ff',
							'--sc-tag-primary-color': '#6b21a8',
						}}
					>
						{__('Payment Plan', 'surecart')}
					</sc-tag>
				);
			}
			return (
				<sc-tag type="success" size="small">
					{__('Subscription', 'surecart')}
				</sc-tag>
			);
		}
		return (
			<sc-tag type="info" size="small">
				{__('One Time', 'surecart')}
			</sc-tag>
		);
	};

	/** Header name */
	const headerName = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 4px;
				`}
			>
				<div>
					{priceType()}
					{trial()}
				</div>

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					{price?.ad_hoc ? (
						__('Custom Amount', 'surecart')
					) : (
						<ScFormatNumber
							css={css`
								font-weight: bold;
								font-size: 14px;
							`}
							type="currency"
							currency={price?.currency || scData.currency_code}
							value={price?.amount}
						/>
					)}{' '}
					<div
						css={css`
							opacity: 0.75;
							line-height: 1;
						`}
					>
						{intervalString(price, {
							labels: { interval: __('every', 'surecart') },
						})}
					</div>
				</div>
			</div>
		);
	};

	const renderDropdown = () => {
		if (!onArchive && !onDelete && !price?.archived) {
			return null;
		}

		return (
			<ScDropdown slot="suffix" placement="bottom-end">
				<ScButton type="text" slot="trigger" circle>
					<Icon icon={moreHorizontalMobile} />
				</ScButton>
				<ScMenu>
					{price?.id && !!onArchive && (
						<ScMenuItem onClick={onArchive}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={box}
								size={20}
							/>
							{price?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>
					)}
					{!!onDelete && (
						<ScMenuItem onClick={onDelete}>
							<Icon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								icon={trash}
								size={20}
							/>
							{__('Delete', 'surecart')}
						</ScMenuItem>
					)}
				</ScMenu>
			</ScDropdown>
		);
	};

	/** Action buttons */
	const buttons = (
		<div>
			{price?.archived ? (
				<ScTag type="warning">{__('Archived', 'surecart')}</ScTag>
			) : (
				<>
					{!!scData?.checkout_page_url && (
						<Copy
							className={'sc-price-copy'}
							url={addQueryArgs(scData?.checkout_page_url, {
								line_items: [
									{ price_id: price?.id, quantity: 1 },
								],
							})}
						></Copy>
					)}
				</>
			)}
			{renderDropdown()}
		</div>
	);

	return (
		<ToggleHeader
			collapsible={collapsible}
			className={className}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			buttons={buttons}
			type={price?.archived ? 'warning' : ''}
		>
			{headerName()}
		</ToggleHeader>
	);
};
