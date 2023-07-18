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

export default ({ onRequestClose, id, product, updateProduct }) => {
	const [optionName, setOptionName] = useState('');
	const [optionValues, setOptionValues] = useState([{ index: 1, label: '' }]);
	const [loading, setLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [error, setError] = useState(null);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const applyDrag = (oldIndex, newIndex) => {
		setOptionValues(arrayMove(optionValues, oldIndex, newIndex));
	};

	const onSubmit = async (e) => {
		try {
			// Get processed variant values.
			const variantValues = optionValues.map((optionValue) => {
				// Remove empty option values.
				if (optionValue.label === '') {
					return;
				}

				return {
					label: optionValue.label,
					position: optionValue.index,
				};
			});

			setError(null);
			setIsSaving(true);
			const response = await saveEntityRecord(
				'surecart',
				'variant-option',
				{
					name: optionName,
					variant_values: variantValues,
					product_id: id,
				},
				{ throwOnError: true }
			);

			updateProduct({
				...product,
				variant_options: {
					...(product.variant_options || {}),
					data: [
						...(product.variant_options?.data || []),
						{
							...response,
							variant_values: {
								data: variantValues,
							},
						},
					],
				},
			});

			setIsSaving(false);
			createSuccessNotice(__('Variation option saved.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
			setIsSaving(false);
		}
	};

	const onChangeOptionValue = async (index, newLabel) => {
		const updatedOptionValues = optionValues.map((optionValue) =>
			optionValue.index === index
				? { ...optionValue, label: newLabel }
				: optionValue
		);

		// Check if the last optionValue has a name, if yes, add a new empty optionValue
		const lastOptionValue =
			updatedOptionValues[updatedOptionValues.length - 1];
		if (lastOptionValue.label !== '') {
			const newOptionValue = {
				index: updatedOptionValues.length + 1,
				label: '',
			};
			updatedOptionValues.push(newOptionValue);
		}

		setOptionValues(updatedOptionValues);

		// Has any option values error.
		if (!hasOptionAndValuesError(updatedOptionValues)) {
			setError(null);
		}
	};

	const deleteOptionValue = (index) => {
		const newOptionValues = [...optionValues];
		newOptionValues.splice(index, 1);
		setOptionValues(newOptionValues);

		// Has any option values error.
		if (hasOptionAndValuesError(newOptionValues)) {
			return;
		}
	};

	/**
	 * If any duplicate optionValue.label is found, then don't add
	 * instead throw an error
	 *
	 * @returns boolean
	 */
	const hasOptionAndValuesError = (optionValuesData = null) => {
		if (!optionValuesData) {
			optionValuesData = [...optionValues];
		}

		// If optionName is empty then throw an error
		if (optionName === '') {
			setError({
				message: __('Option name is required.', 'surecart'),
			});
			return true;
		}

		// If optionValues filtered trimmed data is empty, then throw an error
		if (
			optionValuesData.filter((optionValue) => {
				return optionValue.label !== '';
			}).length === 0
		) {
			setError({
				message: __('Option values are required.', 'surecart'),
			});
			return true;
		}

		const duplicateOptionValue = optionValuesData.find(
			(optionValue, index) => {
				return (
					optionValuesData.findIndex((optionValue2, index2) => {
						return (
							optionValue.label === optionValue2.label &&
							index !== index2
						);
					}) !== -1
				);
			}
		);

		if (duplicateOptionValue) {
			setError({
				message: __(
					'Option values should not be the same.',
					'surecart'
				),
			});
		}

		return duplicateOptionValue;
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
						overflow: auto !important;
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
							onScInput={(e) => {
								setOptionName(e.target.value);

								// Has any option values error.
								if (hasOptionAndValuesError()) {
									return;
								}
							}}
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
									font-weight: 600;
								`}
							>
								{__('Option Values', 'surecart')}{' '}
								<span style={{ color: 'red' }}>*</span>
							</label>
							<SortableList onSortEnd={applyDrag}>
								{(optionValues || []).map(
									(optionValue, optionValueKey) => {
										return (
											<SortableItem key={optionValueKey}>
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
														{/* Hide deletebutton for last item */}
														{optionValueKey !==
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
															value={
																optionValue.label
															}
															onInput={(e) =>
																onChangeOptionValue(
																	optionValue.index,
																	e.target
																		.value
																)
															}
														/>

														{optionValueKey !==
															optionValues.length -
																1 && (
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
																		optionValueKey
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
							submit
							loading={isSaving}
							disabled={loading || !optionName || error}
						>
							{__('Save', 'surecart')}
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
