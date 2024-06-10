import {
	ScButton,
	ScFlex,
	ScIcon,
	ScCard,
	ScManualPaymentMethod,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ subscription, loading, setEdit }) => {
	const id = subscription?.manual_payment_method;

	const { payment_method, hasLoadedPaymentmethod } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'manual_payment_method',
				id,
				{
					t: id, // force refetch to fix bug.
				},
			];

			return {
				payment_method: select(coreStore).getEntityRecord(
					...entityData
				),
				hasLoadedPaymentmethod: select(coreStore).hasFinishedResolution(
					'getEntityRecord',
					entityData
				),
			};
		},
		[id]
	);

	return (
		<ScCard loading={loading || !hasLoadedPaymentmethod}>
			<ScFlex
				alignItems="center"
				justifyContent="flex-start"
				style={{ gap: '0.5em' }}
			>
				<ScManualPaymentMethod paymentMethod={payment_method} />
				<ScButton type="text" circle onClick={() => setEdit(true)}>
					<ScIcon name="edit-2" />
				</ScButton>
			</ScFlex>
		</ScCard>
	);
};
