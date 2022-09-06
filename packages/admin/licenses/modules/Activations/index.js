import {
	ScBlockUi,
	ScCard,
	ScEmpty,
	ScStackedList,
	ScTag,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

import Error from '../../../components/Error';
import Box from '../../../ui/Box';
import Activation from './Activation';

export default ({ id, license }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);

	const { activations, loading, updating, loadingError } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'activation',
				{ context: 'edit', license_ids: [id], per_page: 100 },
			];
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			const activations = select(coreStore).getEntityRecords(
				...queryArgs
			);
			return {
				activations,
				loading: loading && !activations?.length,
				updating: loading && activations?.length,
				loadingError: select(coreStore)?.getResolutionError?.(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	const onDelete = () => {
		const r = confirm(
			__(
				'Are you sure you want to remove this activation? This site will no longer get updates.',
				'surecart'
			)
		);
		if (!r) return;
		try {
			deleteEntityRecord(
				'surecart',
				'activation',
				activation?.id,
				{},
				{
					throwOnError: true,
				}
			);
		} catch (e) {
			setError(e?.message || __('Something went wrong', 'surecart'));
		}
	};

	const renderActivationsList = () => {
		if (!activations?.length) {
			return (
				<ScEmpty icon="activity">
					{__('This license has not been activated.', 'surecart')}
				</ScEmpty>
			);
		}

		return (
			<ScCard noPadding>
				<ScStackedList>
					{activations.map((activation) => (
						<Activation
							activation={activation}
							key={activation?.id}
							onDelete={onDelete}
						/>
					))}
				</ScStackedList>
			</ScCard>
		);
	};
	return (
		<Box
			title={__('Activations', 'surecart')}
			loading={loading}
			header_action={
				!loading && (
					<ScTag type="info">
						{sprintf(
							__('%1s of %2s Activations Used'),
							parseInt(license?.activation_count || 0),
							parseInt(license?.activation_limit) || '∞'
						)}
					</ScTag>
				)
			}
		>
			<Error error={loadingError} scrollOnOpen={false} />
			{renderActivationsList()}
			{updating && <ScBlockUi spinner />}
		</Box>
	);
};
