/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScTag,
	ScButton,
	ScIcon,
	ScSkeleton,
	ScFlex,
} from '@surecart/components-react';
import { DropdownMenu, MenuItem } from '@wordpress/components';
import { moreHorizontal, inbox, trash, addCard } from '@wordpress/icons';
import ToggleHeader from '../../../../components/ToggleHeader';
import { intervalString } from '../../../../util/translations';
import { useState } from 'react';
import BuyLink from './BuyLink';
import { SortableKnob } from 'react-easy-sort';
import DuplicateModel from '../../../components/DuplicateModel';

export default ({
	isOpen,
	setIsOpen,
	className,
	price,
	variants,
	variantOptions,
	stockEnabled,
	onArchive,
	collapsible,
	onDelete,
	onDuplicate,
	loading,
}) => {
	const [copyDialog, setCopyDialog] = useState(false);

	const trial = () => {
		return (
			<>
				{!!price?.trial_duration_days && (
					<>
						{' '}
						<sc-tag type="info">{__('Trial', 'surecart')}</sc-tag>
					</>
				)}
			</>
		);
	};

	const setupFee = () => {
		return (
			<>
				{!!price?.setup_fee_enabled && (
					<>
						{' '}
						<sc-tag type="default">
							{price?.setup_fee_amount < 0
								? __('Discount', 'surecart')
								: __('Setup Fee', 'surecart')}
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
				<sc-tag type="success">{__('Subscription', 'surecart')}</sc-tag>
			);
		}
		return <sc-tag type="info">{__('One Time', 'surecart')}</sc-tag>;
	};

	/** Header name */
	const headerName = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 0.75rem;
				`}
			>
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.75rem;
						flex-wrap: wrap;
					`}
				>
					<SortableKnob>
						<ScIcon
							name="drag"
							css={css`
								font-size: 16px;
								cursor: grab;
							`}
						/>
					</SortableKnob>
					<div>
						{!!price?.name && (
							<span>
								<strong>{price?.name}</strong>{' '}
								<span
									css={css`
										padding: 0 2px;
									`}
								>
									&bull;
								</span>{' '}
							</span>
						)}
						{price?.ad_hoc ? (
							__('Custom Amount', 'surecart')
						) : (
							<>
								{!!price?.scratch_amount &&
									price?.scratch_amount > price?.amount && (
										<>
											<span
												css={css`
													font-weight: bold;
													font-size: 14px;
													opacity: 0.75;
													text-decoration: line-through;
												`}
											>
												{price?.scratch_display_amount}
											</span>{' '}
										</>
									)}
								<span
									css={css`
										font-weight: bold;
										font-size: 14px;
									`}
								>
									{price?.display_amount}
								</span>
							</>
						)}{' '}
						<span
							css={css`
								opacity: 0.75;
								line-height: 1;
							`}
						>
							{intervalString(price, {
								labels: { interval: __('every', 'surecart') },
							})}
						</span>
					</div>
				</div>
				<div
					css={css`
						font-size: 13px;
					`}
				>
					{priceType()}
					{trial()}
					{setupFee()}
				</div>
			</div>
		);
	};

	const renderDropdown = () => {
		if (!onArchive && !onDelete && !onDuplicate) {
			return null;
		}

		return (
			<DropdownMenu
				icon={moreHorizontal}
				label={__('More Actions', 'surecart')}
				popoverProps={{
					placement: 'bottom-end',
				}}
				menuProps={{
					style: {
						minWidth: '150px',
					},
				}}
			>
				{() => (
					<>
						{price?.id && !!onArchive && (
							<MenuItem
								icon={inbox}
								iconPosition="left"
								onClick={onArchive}
							>
								{price?.archived
									? __('Un-Archive', 'surecart')
									: __('Archive', 'surecart')}
							</MenuItem>
						)}
						{!!onDelete && (
							<MenuItem
								icon={trash}
								iconPosition="left"
								onClick={onDelete}
							>
								{__('Delete', 'surecart')}
							</MenuItem>
						)}
						<DuplicateModel
							type="price"
							id={price?.id}
							onSuccess={onDuplicate}
						>
							{({ onClick }) => (
								<MenuItem
									icon={addCard}
									onClick={onClick}
									iconPosition="left"
								>
									{__('Duplicate', 'surecart')}
								</MenuItem>
							)}
						</DuplicateModel>
					</>
				)}
			</DropdownMenu>
		);
	};

	/** Action buttons */
	const buttons = (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
			}}
		>
			{price?.archived ? (
				<>
					<ScTag type="warning">{__('Archived', 'surecart')}</ScTag>
					{renderDropdown()}
				</>
			) : (
				<>
					{renderDropdown()}
					{!!scData?.checkout_page_url && price?.id && (
						<ScButton
							className={'sc-price-copy'}
							circle
							type="text"
							onClick={() => setCopyDialog(true)}
							title={__('Copy Links', 'surecart')}
						>
							<ScIcon name="clipboard" />
						</ScButton>
					)}
				</>
			)}
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
			>
				{headerName()}
			</ToggleHeader>
			<BuyLink
				open={copyDialog}
				price={price}
				variants={variants}
				variantOptions={variantOptions}
				stockEnabled={stockEnabled}
				onRequestClose={() => setCopyDialog(false)}
			/>
		</>
	);
};
