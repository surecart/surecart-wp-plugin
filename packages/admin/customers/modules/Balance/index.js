import Box from '../../../ui/Box';
import ViewTransactions from './ViewTransactions';
import {
	ScButton,
	ScFormatNumber,
	ScIcon,
	ScLineItem,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

export default ({ customer, loading }) => {
	const [showTransactions, setShowTransactions] = useState();
	return (
		<Box
			title={__('Balance', 'surecart')}
			loading={loading}
			footer={
				!loading && (
					<>
						{/* <ScButton size="small">
						<ScIcon name="edit-2" slot="prefix" />
						{__('Adjust Balance', 'surecart')}
					</ScButton> */}

						<ScButton
							size="small"
							onClick={() => setShowTransactions(true)}
						>
							<ScIcon name="inbox" slot="prefix" />
							{__('View Transactions', 'surecart')}
						</ScButton>
					</>
				)
			}
		>
			<ScLineItem>
				<span slot="title">{__('Credit Balance', 'surecart')}</span>
				<span slot="price">
					{customer?.balances?.data?.length ? (
						customer?.balances?.data.map(({ amount, currency }) => {
							return (
								<ScFormatNumber
									type="currency"
									currency={currency}
									value={-amount}
								/>
							);
						})
					) : (
						<ScFormatNumber
							type="currency"
							currency={scData?.currency_code}
							value={0}
						/>
					)}
				</span>
			</ScLineItem>
			<ViewTransactions
				open={showTransactions}
				customerId={customer?.id}
				onRequestClose={() => setShowTransactions(false)}
			/>
		</Box>
	);
};
