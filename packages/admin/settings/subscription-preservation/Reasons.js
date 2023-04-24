/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import {
	ScButton,
	ScCard,
	ScEmpty,
	ScFormControl,
	ScIcon,
	ScStackedList,
} from '@surecart/components-react';
import Reason from './Reason';
import EditReason from './EditReason';
import { useState } from 'react';

export default ({ reasons, loading }) => {
	const [modal, setModal] = useState(false);
	const { editEntityRecord } = useDispatch(coreStore);

	const applyDrag = async (oldIndex, newIndex) => {
		const result = arrayMove(reasons, oldIndex, newIndex);
		// edit entity record to update indexes.
		(result || []).forEach((reason, index) =>
			editEntityRecord('surecart', 'cancellation_reason', reason.id, {
				position: index,
			})
		);
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
					{!loading && !reasons?.length ? (
						<ScCard>
							<ScEmpty icon="inbox">
								{__(
									"You don't have any survey answers. Please add at least one to collect cancellation feedback.",
									'surecart'
								)}
							</ScEmpty>
						</ScCard>
					) : (
						<ScStackedList>
							<ScCard noPadding>
								<SortableList onSortEnd={applyDrag}>
									{(reasons || []).map((reason) => (
										<SortableItem key={reason.id}>
											<div
												css={css`
													overflow: visible;
													border: 1px solid
														var(--sc-color-gray-200);
													background: #fff;
													margin-top: -1px;
													margin-left: -1px;
													margin-right: -1px;
													margin-bottom: -1px;
												`}
											>
												<Reason reason={reason} />
											</div>
										</SortableItem>
									))}
								</SortableList>
							</ScCard>
						</ScStackedList>
					)}
				</ScFormControl>
			</div>
			<ScButton onClick={() => setModal(true)}>
				<ScIcon name="plus" slot="prefix" />
				{__('Add New', 'surecart')}
			</ScButton>
			{!!modal && <EditReason onRequestClose={() => setModal(false)} />}
		</>
	);
};
