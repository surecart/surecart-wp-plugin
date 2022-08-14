/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScDialog,
	ScDrawer,
	ScEmpty,
	ScFormatDate,
	ScFormatNumber,
	ScIcon,
	ScSkeleton,
	ScTable,
	ScTableCell,
	ScTableRow,
	ScTag,
} from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from 'react';

export default ({ open, customerId, onRequestClose }) => {
	const { createErrorNotice } = useDispatch(noticesStore);
	const [loading, setLoading] = useState();
	const [transactions, setTransactions] = useState();

	useEffect(() => {
		if (open) {
			fetchTransactions();
		}
	}, [open]);

	const fetchTransactions = async () => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: addQueryArgs('surecart/v1/balance_transactions', {
					customer_ids: [customerId],
				}),
			});
			setTransactions(response);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
		} finally {
			setLoading(false);
		}
	};

	const typeBadge = (type) => {
		switch (type) {
			case 'checkout_credit':
				return <ScTag type="success">{__('Credit', 'surecart')}</ScTag>;
			case 'applied_to_checkout':
				return (
					<ScTag type="warning">{__('Applied', 'surecart')}</ScTag>
				);
		}

		return <ScTag type="info">{type}</ScTag>;
	};

	const renderContent = () => {
		if (loading) {
			return (
				<div
					css={css`
						display: grid;
						gap: 0.5em;
						padding: var(--sc-drawer-body-spacing);
					`}
				>
					<ScSkeleton style={{ width: '40%' }}></ScSkeleton>
					<ScSkeleton style={{ width: '60%' }}></ScSkeleton>
					<ScSkeleton style={{ width: '30%' }}></ScSkeleton>
				</div>
			);
		}

		if (!transactions?.length) {
			return (
				<div
					css={css`
						padding: var(--sc-drawer-body-spacing);
					`}
				>
					<ScEmpty icon="activity">
						{__('There are no transactions', 'surecart')}
					</ScEmpty>
				</div>
			);
		}

		return (
			<div>
				<ScTable>
					<ScTableCell slot="head">
						{__('Type', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Amount', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Ending Balance', 'surecart')}
					</ScTableCell>
					<ScTableCell slot="head">
						{__('Date', 'surecart')}
					</ScTableCell>

					{(transactions || []).map(
						({
							amount,
							currency,
							ending_balance_amount,
							transaction_type,
							created_at,
						}) => (
							<ScTableRow>
								<ScTableCell>
									{typeBadge(transaction_type)}
								</ScTableCell>
								<ScTableCell>
									<ScFormatNumber
										type="currency"
										currency={currency}
										value={-amount}
									/>
								</ScTableCell>
								<ScTableCell>
									<ScFormatNumber
										type="currency"
										currency={currency}
										value={-ending_balance_amount}
									/>
								</ScTableCell>
								<ScTableCell>
									<ScFormatDate
										type="timestamp"
										date={created_at}
									/>
								</ScTableCell>
							</ScTableRow>
						)
					)}
				</ScTable>
			</div>
		);
	};

	return (
		<ScDrawer
			style={{ '--sc-drawer-size': '480px' }}
			open={open}
			onScAfterHide={() => onRequestClose()}
		>
			<span
				slot="header"
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: var(--sc-drawer-header-spacing);
					border-bottom: var(--sc-drawer-border);
				`}
			>
				{__('Balance Transactions', 'surecart')}
				<ScIcon
					class="cart__close"
					name="x"
					onClick={() => onRequestClose()}
				></ScIcon>
			</span>

			{renderContent()}
		</ScDrawer>
	);
};
