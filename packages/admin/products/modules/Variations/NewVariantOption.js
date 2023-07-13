/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import { Modal } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

/**
 * Internal dependencies.
 */
import Error from '../../../components/Error';
import { ScButton, ScForm, ScIcon, ScInput } from '@surecart/components-react';

export default ({ onRequestClose, id }) => {
	const [optionName, setOptionName] = useState('');
	const [optionValues, setOptionValues] = useState(['', '']);
	const [loading, setLoading] = useState(false);
	const { editEntityRecord } = useDispatch(coreStore);

	const applyDrag = async (oldIndex, newIndex) => {
		const result = arrayMove(optionValues, oldIndex, newIndex);
		// edit entity record to update indexes.
		(result || []).forEach((optionValue, index) =>
			editEntityRecord('surecart', 'variant_values', optionValue, {
				position: index,
			})
		);
	};

	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		try {
			setError(null);
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'variant_options',
				{
					name: optionName,
					variant_values: optionValues,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(__('Variation option saved.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
			setLoading(false);
		}
	};

	const onChangeOptionValue = (e, index) => {
		const newOptionValues = [...optionValues];
		newOptionValues[index] = e.target.value;
		setOptionValues(newOptionValues);
	};

	const deleteOptionValue = (index) => {
		const newOptionValues = [...optionValues];
		newOptionValues.splice(index, 1);
		setOptionValues(newOptionValues);
	};

	return (
		<>
			<Global
				styles={css`
					.sc-modal-overflow .components-modal__frame {
						overflow: visible !important;
					}
				`}
			/>
			<Modal
				title={__('Add Variant Option', 'surecart')}
				css={css`
					max-width: 500px !important;
					width: 100% !important;
					.components-modal__content {
						overflow: visible !important;
					}
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={onRequestClose}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<Error error={error} setError={setError} />

					<div>
						<ScInput
							type="text"
							placeholder={__('Option Name', 'surecart')}
							required
							label={__('Option Name', 'surecart')}
							value={optionName}
							onChange={(e) => setOptionName(e.target.value)}
						/>

						<div
							css={css`
								position: relative;
								margin-top: var(--sc-spacing-large);
							`}
						>
							<label
								css={css`
									display: block;
									margin-left: 1.6rem;
								`}
							>
								{__('Option Values', 'surecart')}
							</label>
							<SortableList onSortEnd={applyDrag}>
								{(optionValues || []).map(
									(optionValue, index) => {
										return (
											<SortableItem key={index}>
												<div
													css={css`
														padding-top: var(
															--sc-spacing-xx-small
														);
														padding-bottom: var(
															--sc-spacing-xx-small
														);
													`}
												>
													<div
														css={css`
															width: 100%;
															display: flex;
															align-items: center;
															gap: 1em;
															justify-content: center;
														`}
													>
														{/* Hide deletebutton for last two index */}
														{index !==
														optionValues.length -
															1 ? (
															<ScIcon
																name="drag"
																slot="prefix"
																css={css`
																	cursor: grab;
																`}
															/>
														) : (
															<ScIcon
																name="empty"
																slot="prefix"
															/>
														)}

														<ScInput
															css={css`
																width: 100%;
																focus: {
																	border-color: var(
																		--sc-color-primary
																	);
																}
															`}
															type="text"
															placeholder={__(
																'Add another value',
																'surecart'
															)}
															value={optionValue}
															onChange={(e) =>
																onChangeOptionValue(
																	e,
																	index
																)
															}
														/>

														{index !==
															optionValues.length -
																1 &&
															index !==
																optionValues.length -
																	2 && (
																<ScButton
																	type="text"
																	css={css`
																		position: absolute;
																		right: 0;
																		hover: {
																			color: var(
																				--sc-color-danger
																			);
																		}
																	`}
																	onClick={() =>
																		deleteOptionValue(
																			index
																		)
																	}
																>
																	<ScIcon
																		name="trash"
																		slot="suffix"
																	/>
																</ScButton>
															)}
													</div>
												</div>
											</SortableItem>
										);
									}
								)}
							</SortableList>
						</div>
					</div>

					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScButton
							type="primary"
							busy={loading}
							disabled={loading}
							onClick={() => {
								setOptionValues([...optionValues, '']);
							}}
						>
							<ScIcon name="plus" slot="prefix" />
							{__('Add Option', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
					{loading && <sc-block-ui></sc-block-ui>}
				</ScForm>
			</Modal>
		</>
	);
};
