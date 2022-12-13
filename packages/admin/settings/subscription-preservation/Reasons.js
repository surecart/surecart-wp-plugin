import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { Container, Draggable } from 'react-smooth-dnd';
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
	const { editEntityRecord } = useDispatch(coreStore);
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

	const applyDrag = (arr, dragResult) => {
		const { removedIndex, addedIndex, payload } = dragResult;
		if (removedIndex === null && addedIndex === null) return;
		const result = [...arr];
		let itemToAdd = payload;

		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}

		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}

		result.forEach((result, index) => {
			editEntityRecord('surecart', 'cancellation_reason', result?.id, {
				...result,
				position: index + 1,
			});
		});

		return result;
	};

	if (loading) {
		return (
			<ScStackedList>
				<ScCard noPadding>
					<div>
						<Reason loading />
						<Reason loading />
					</div>
				</ScCard>
			</ScStackedList>
		);
	}

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
							<Container
								onDrop={(e) => applyDrag(reasons, e)}
								getChildPayload={(index) => reasons?.[index]}
							>
								{(reasons || []).map((reason) => (
									<Draggable key={reason.id}>
										<Reason
											reason={reason}
											key={reason?.id}
										/>
									</Draggable>
								))}
							</Container>
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
