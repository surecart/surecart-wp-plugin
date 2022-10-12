import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	ScEmpty,
	ScButton,
	ScIcon,
	ScCard,
	ScStackedList,
	ScBlockUi,
} from '@surecart/components-react';
import { useState } from 'react';
import SettingsBox from '../SettingsBox';
import CreateEditPaymentMethod from './CreateEditPaymentMethod';
import ManualPaymentMethod from './ManualPaymentMethod';

export default () => {
	const [open, setOpen] = useState(false);

	const { items, loading, busy } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'manual_payment_method',
			{ context: 'edit', per_page: 100 },
		];
		const items = select(coreStore).getEntityRecords(...queryArgs);
		const resolving = select(coreStore).isResolving(
			'getEntityRecords',
			queryArgs
		);
		return {
			items: select(coreStore).getEntityRecords(...queryArgs),
			loading: !items?.length && resolving,
			busy: items?.length && resolving,
		};
	});

	const renderContent = () => {
		if (loading) {
			return null;
		}

		if (!items?.length) {
			return (
				<ScCard>
					<ScEmpty icon="inbox">
						{__('No manual payment methods.', 'surecart')}
					</ScEmpty>
				</ScCard>
			);
		}

		return (
			<ScCard noPadding>
				<ScStackedList>
					{items.map((item) => (
						<ManualPaymentMethod
							paymentMethod={item}
							key={item?.id}
						/>
					))}
				</ScStackedList>
			</ScCard>
		);
	};

	return (
		<>
			<SettingsBox
				title={__('Manual Payment Methods', 'surecart')}
				description={__(
					"Payments that are made outside your online store. When a customer selects a manual payment method, you'll need to approve their order before it can be fulfilled",
					'surecart'
				)}
				loading={loading}
				wrapperTag={'div'}
				end={
					<ScButton type="primary" onClick={() => setOpen(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add New', 'surecart')}
					</ScButton>
				}
				noButton
			>
				{renderContent()}
				{busy && <ScBlockUi spinner />}
			</SettingsBox>

			<CreateEditPaymentMethod
				open={open}
				onRequestClose={() => setOpen(false)}
			/>
		</>
	);
};
