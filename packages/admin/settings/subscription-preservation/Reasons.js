/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Container, Draggable } from 'react-smooth-dnd';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScEmpty,
	ScFormControl,
	ScIcon,
	ScStackedList,
} from '@surecart/components-react';
import Reason from './Reason';
import EditReason from './EditReason';
import { store as noticesStore } from '@wordpress/notices';
import { useState, useEffect } from 'react';

export default () => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const [modal, setModal] = useState(false);
	const [busy, setBusy] = useState(false);
	const { reasons, loading, fetching } = useSelect((select) => {
		const queryArgs = ['surecart', 'cancellation_reason'];
		const reasons = select(coreStore).getEntityRecords(...queryArgs);
		const loading = select(coreStore).isResolving(
			'getEntityRecords',
			queryArgs
		);
		return {
			reasons,
			loading: loading && !reasons?.length,
			fetching: loading && reasons?.length,
		};
	});

	const [sortedReasons, setSortedReasons] = useState(null);
	useEffect(() => {
		setSortedReasons(reasons);
	}, [reasons]);

	const applyDrag = async (arr, dragResult) => {
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

		setSortedReasons(result);

		try {
			setBusy(true);
			// save reason.
			await apiFetch({
				method: 'PATCH',
				path: `surecart/v1/cancellation_reasons/${payload?.id}`,
				data: {
					position: addedIndex + 1,
				},
			});

			createSuccessNotice(__('Answers updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setBusy(false);
		}

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
			<div
				css={css`
					position: relative;
				`}
			>
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

					<ScStackedList
						css={css`
							.smooth-dnd-container.vertical
								> .smooth-dnd-draggable-wrapper {
								overflow: visible;
								border: 1px solid var(--sc-color-gray-200);
								margin-top: -1px;
								margin-left: -1px;
								margin-right: -1px;
								margin-bottom: -1px;
							}
						`}
					>
						<ScCard noPadding>
							<Container
								onDrop={(e) => applyDrag(sortedReasons, e)}
								getChildPayload={(index) =>
									sortedReasons?.[index]
								}
								dragHandleSelector=".dragger"
							>
								{(sortedReasons || []).map((reason) => (
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
				{(!!busy || !!fetching) && <ScBlockUi spinner />}
			</div>
			<ScButton onClick={() => setModal(true)}>
				<ScIcon name="plus" slot="prefix" />
				{__('Add New', 'surecart')}
			</ScButton>
			{!!modal && <EditReason onRequestClose={() => setModal(false)} />}
		</>
	);
};
