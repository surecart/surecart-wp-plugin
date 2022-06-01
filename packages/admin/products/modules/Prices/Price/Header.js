/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
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
	const collapsedDetails = () => {
		if (isOpen) return null;
		return (
			<>
				{!!price?.ad_hoc && (
					<>
						{' '}
						<sc-tag type="success" size="small">
							{__('Pay what you want', 'surecart')}
						</sc-tag>
					</>
				)}
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
	/** Header name */
	const headerName = () => {
		return (
			<Fragment>
				<ScFormatNumber
					css={css`
						font-weight: bold;
						font-size: 14px;
					`}
					type="currency"
					currency={price?.currency || scData.currency_code}
					value={price?.amount}
				/>

				{collapsedDetails()}

				<div
					css={css`
						opacity: 0.75;
						line-height: 1;
					`}
				>
					{intervalString(price, {
						labels: { interval: __('Every', 'surecart') },
					})}
				</div>
			</Fragment>
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
