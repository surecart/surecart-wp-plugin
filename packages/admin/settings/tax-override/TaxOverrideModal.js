/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScDialog,
	ScForm,
	ScFormControl,
	ScInput,
	ScSelect,
	ScText,
} from '@surecart/components-react';
import { zoneName } from '../tax-region/RegistrationForm';
import ProductCollectionSelector from '../../components/ProductCollectionSelector';

export default ({
	type,
	region,
	registration,
	modal,
	taxOverride,
	onRequestClose,
	onDelete,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	// const [type, setType] = useState('other');
	const [additionalErrors, setAdditionalErrors] = useState([]);
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const [rate, setRate] = useState(null);
	const { tax_zone, tax_identifier, ...registrationData } = registration;
	const [productCollection, setProductCollection] = useState(null);

	const [data, setData] = useState({
		rate,
		...(taxOverride?.id ? { id: taxOverride.id } : {}),
		...(type === 'shipping' ? { shipping: true } : {}),
		...(type === 'product'
			? { product_collection: productCollection }
			: {}),
	});

	const updateData = (updated) => setData({ ...data, ...updated });

	const { zones, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'tax_zone',
				{ context: 'edit', regions: [region], per_page: 100 },
			];
			return {
				zones: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[region]
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'tax_override',
				{
					...data,
					tax_zone: tax_zone?.id,
				},
				{
					throwOnError: true,
				}
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			if (e?.additional_errors) {
				setAdditionalErrors(e.additional_errors);
			}
		} finally {
			setLoading(false);
		}
	};

	const getDialogLabel = () => {
		const labels = {
			shipping: {
				new: __('Add shipping override', 'surecart'),
				edit: __('Edit shipping override', 'surecart'),
				delete: __('Delete shipping override', 'surecart'),
			},
			product: {
				new: __('Add product override', 'surecart'),
				edit: __('Edit product override', 'surecart'),
				delete: __('Delete product override', 'surecart'),
			},
		};

		return labels[type]?.[modal];
	};

	return (
		<div
			css={css`
				sc-dialog::part(body) {
					overflow: visible;
				}
			`}
		>
			<ScDialog
				label={getDialogLabel()}
				onScRequestClose={onRequestClose}
				open={!!modal}
			>
				{!!modal && (
					<ScForm
						onScSubmit={onSubmit}
						style={{
							'--sc-form-row-spacing': 'var(--sc-spacing-large)',
						}}
					>
						<ScText
							css={css`
								color: var(--sc-color-gray-600);
								opacity: 0.85;
							`}
						>
							{type === 'shipping' ? (
								__(
									'Add a custom tax rate for shipping.',
									'surecart'
								)
							) : (
								<div>
									{__(
										'Add a custom sales tax rate for a collection of products.',
										'surecart'
									)}
									{__(
										'Select an existing collection or ',
										'surecart'
									)}
									<a
										href="/wp-admin/admin.php?page=sc-product-collections&action=edit"
										target="_blank"
									>
										{__('create a new one', 'surecart')}{' '}
										<sc-icon name="external-link" />
									</a>
								</div>
							)}
						</ScText>
						{/* <Error error={error} setError={setError} /> */}

						{type === 'product' && (
							<div>
								<ScFormControl
									label={__('Product Collection', 'surecart')}
									required
								>
									<ProductCollectionSelector
										value={data?.product_collection}
										onSelect={(e) => {
											if (e.target.value) {
												updateData({
													product_collection:
														e.target.value,
												});
											}
										}}
									/>
								</ScFormControl>
							</div>
						)}

						<ScSelect
							search
							loading={fetching}
							// disabled={registration?.id}
							value={data?.tax_zone}
							unselect={false}
							label={zoneName[region] || __('Region', 'surecart')}
							onScChange={(e) =>
								updateData({ tax_zone: e.target.value })
							}
							choices={(zones || [])
								.reverse()
								.map(({ state_name, country_name, id }) => {
									return {
										label: state_name || country_name,
										value: id,
									};
								})}
							required
						/>

						<ScInput
							type="number"
							min="0"
							max="100"
							step="0.01"
							required
							label={__('Tax Rate', 'surecart')}
							value={data?.rate ?? ''}
							onScInput={(e) => {
								updateData({
									rate: parseFloat(e.target.value),
								});
							}}
						>
							<span slot="suffix">%</span>
						</ScInput>

						<sc-flex justify-content="space-between">
							<div>
								{taxOverride?.id && (
									<ScButton onClick={onDelete}>
										{__('Delete', 'surecart')}
									</ScButton>
								)}
							</div>
							<ScButton type="primary" submit>
								{__('Add Override', 'surecart')}
							</ScButton>
						</sc-flex>

						{(loading || fetching) && (
							<sc-block-ui
								spinner
								style={{
									zIndex: 9,
									'--sc-block-ui-opacity': '0.5',
									inset: 0,
								}}
							></sc-block-ui>
						)}
					</ScForm>
				)}
			</ScDialog>
		</div>
	);
};
