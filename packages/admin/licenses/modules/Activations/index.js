import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Box from '../../../ui/Box';
import Error from '../../../components/Error';
import {
	ScCard,
	ScEmpty,
	ScStackedList,
	ScTag,
} from '@surecart/components-react';
import Activation from './Activation';

export default ({ id, license }) => {
	const { deleteEntityRecord, saveEntityRecord } = useDispatch(coreStore);

	const { activations, loading, loadingError } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'activation',
				{ context: 'edit', license_ids: [id], per_page: 100 },
			];
			return {
				activations: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
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
			loading={loading && !activations?.length}
			header_action={
				!loading && (
					<ScTag type="default">
						{activations?.length || 0} /{' '}
						{license?.activation?.limit || '∞'}
					</ScTag>
				)
			}
		>
			<Error error={loadingError} scrollOnOpen={false} />
			{renderActivationsList()}
		</Box>
	);
};
