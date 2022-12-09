import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import SettingsBox from '../SettingsBox';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScCard,
	ScEmpty,
	ScFormControl,
	ScIcon,
	ScStackedList,
} from '@surecart/components-react';
import Reason from './Reason';
import NewReason from './NewReason';
import { useState } from 'react';

export default () => {
	const [modal, setModal] = useState(false);
	const { reasons, loading } = useSelect((select) => {
		const queryArgs = ['surecart', 'cancellation_reason'];
		return {
			reasons: select(coreStore).getEntityRecords(...queryArgs),
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	});

	return (
		<>
			<div>
				<ScFormControl label={__('Survey Answers', 'surecart')}>
					{!loading && !reasons?.length && (
						<ScCard>
							<ScEmpty icon="inbox">
								{__(
									"You don't have any feedback reasons. Please add a reason to collect cancellation feedback.",
									'surecart'
								)}
							</ScEmpty>
						</ScCard>
					)}

					<ScStackedList>
						<ScCard noPadding>
							<div>
								{(reasons || []).map((reason) => {
									return (
										<Reason
											reason={reason}
											key={reason?.id}
										/>
									);
								})}
							</div>
						</ScCard>
					</ScStackedList>
				</ScFormControl>
			</div>
			<ScButton onClick={() => setModal(true)}>
				<ScIcon name="plus" slot="prefix" />
				{__('Add New', 'surecart')}
			</ScButton>
			{!!modal && <NewReason onRequestClose={() => setModal(false)} />}
		</>
	);
};
