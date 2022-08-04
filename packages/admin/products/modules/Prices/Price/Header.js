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
	ScMenuDivider,
	ScIcon,
	ScDialog,
	ScInput,
	ScForm,
	ScDivider,
	ScSkeleton,
	ScFlex,
} from '@surecart/components-react';
import { Icon, moreHorizontalMobile } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

import ToggleHeader from '../../../../components/ToggleHeader';
import { intervalString } from '../../../../util/translations';
import Copy from './Copy';
import { useState } from 'react';
import CopyInput from './CopyInput';

export default ({
	isOpen,
	setIsOpen,
	className,
	price,
	onArchive,
	collapsible,
	onDelete,
	loading,
}) => {
	const [copyDialog, setCopyDialog] = useState(false);
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
		if (!price?.id) return;
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
					<ScIcon
						name="more-horizontal"
						style={{ fontSize: '18px' }}
					/>
				</ScButton>
				<ScMenu>
					{price?.id && (
						<ScMenuItem onClick={() => setCopyDialog(true)}>
							<ScIcon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								name="clipboard"
							/>
							{__('Links...', 'surecart')}
						</ScMenuItem>
					)}
					<ScMenuDivider />
					{price?.id && !!onArchive && (
						<ScMenuItem onClick={onArchive}>
							<ScIcon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								name="archive"
							/>
							{price?.archived
								? __('Un-Archive', 'surecart')
								: __('Archive', 'surecart')}
						</ScMenuItem>
					)}
					{!!onDelete && (
						<ScMenuItem onClick={onDelete}>
							<ScIcon
								slot="prefix"
								style={{
									opacity: 0.5,
								}}
								name="trash"
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
					{!!scData?.checkout_page_url && price?.id && (
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

	if (loading) {
		return (
			<ToggleHeader className={className} isOpen={false}>
				<ScFlex flexDirection="column">
					<div>
						<ScSkeleton style={{ width: '75px' }} />
					</div>
					<div>
						<ScSkeleton style={{ width: '125px' }} />
					</div>
				</ScFlex>
			</ToggleHeader>
		);
	}

	return (
		<>
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
			<ScDialog
				label={__('Links and Shortcodes', 'surecart')}
				open={copyDialog}
				onScRequestClose={() => setCopyDialog(false)}
			>
				<ScForm>
					<CopyInput
						label={__('Price ID', 'surecart')}
						text={price?.id}
					/>

					<ScDivider style={{ '--spacing': '1em' }}>
						{__('Links', 'surecart')}
					</ScDivider>

					<CopyInput
						label={__('Buy Link', 'surecart')}
						text={addQueryArgs(scData?.checkout_page_url, {
							line_items: [{ price_id: price?.id, quantity: 1 }],
						})}
					/>

					<ScDivider style={{ '--spacing': '1em' }}>
						{__('Shortcodes', 'surecart')}
					</ScDivider>

					<CopyInput
						label={__('Add To Cart Button Shortcode', 'surecart')}
						text={`[sc_add_to_cart_button price_id=${price?.id}]Add To Cart[/sc_add_to_cart_button]`}
					/>
					<CopyInput
						label={__('Buy Button Shortcode', 'surecart')}
						text={`[sc_buy_button]Buy Now [sc_line_item price_id=${price?.id} quantity=1][/sc_buy_button]`}
					/>
				</ScForm>
				<ScButton type="primary" slot="footer">
					{__('Done', 'surecart')}
				</ScButton>
			</ScDialog>
		</>
	);
};
