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
	ScInput,
	ScSelect,
	ScText,
} from '@surecart/components-react';
import { zoneName } from '../tax-region/RegistrationForm';
// import ProductCollectionSelector from '../../components/ProductCollectionSelector';

export default ({
	type,
	region,
	registration,
	modal,
	taxOverride,
	onRequestClose,
	onDelete,
}) => {
	const open = !!modal;
	if (!open) return null;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	// const [type, setType] = useState('other');
	const [additionalErrors, setAdditionalErrors] = useState([]);
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const [rate, setRate] = useState(null);
	const { tax_zone, tax_identifier, ...registrationData } = registration;
	const [productCollection, setProductCollection] = useState(null);

	const [data, setData] = useState({
		rate: rate || taxOverride?.rate || '',
		...(taxOverride?.id ? { id: taxOverride.id } : {}),
		...(taxOverride?.tax_zone ? { tax_zone: taxOverride.tax_zone.id } : {}),
		...(type === 'shipping' ? { shipping: true } : {}),
		...(type === 'product'
			? {
					product_collection:
						productCollection ||
						taxOverride?.product_collection?.id,
			  }
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

	const { productCollections, fetchingProductCollections } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product-collection',
				{ context: 'edit', per_page: 100 },
			];
			return {
				productCollections: select(coreStore).getEntityRecords(
					...queryArgs
				),
				fetchingProductCollections: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[]
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await saveEntityRecord('surecart', 'tax_override', data, {
				throwOnError: true,
			});
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
				new: __('Add shipping tax override', 'surecart'),
				edit: __('Edit shipping tax override', 'surecart'),
				delete: __('Delete shipping tax override', 'surecart'),
			},
			product: {
				new: __('Add product tax override', 'surecart'),
				edit: __('Edit product tax override', 'surecart'),
				delete: __('Delete product tax override', 'surecart'),
			},
		};

		return labels[type]?.[modal] || '';
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
				open={open}
			>
				{open && (
					<ScForm
						onScSubmit={onSubmit}
						style={{
							'--sc-form-row-spacing': 'var(--sc-spacing-large)',
						}}
					>
						{!taxOverride?.id && (
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
						)}
						{/* <Error error={error} setError={setError} /> */}

						{type === 'product' && (
							<div>
								{!taxOverride?.id && (
									<ScSelect
										search
										loading={fetching}
										disabled={taxOverride?.id}
										value={data?.product_collection}
										unselect={false}
										label={__(
											'Product Collection',
											'surecart'
										)}
										onScChange={(e) =>
											updateData({
												product_collection:
													e.target.value,
											})
										}
										choices={(productCollections || [])
											.reverse()
											.map(({ name, id }) => {
												return {
													label: name,
													value: id,
												};
											})}
										required
									/>
								)}
							</div>
						)}

						{!taxOverride?.id && (
							<ScSelect
								search
								loading={fetching}
								value={data?.tax_zone}
								unselect={false}
								label={
									zoneName[region] || __('Region', 'surecart')
								}
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
						)}

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

						<sc-flex justify-content="flex-end">
							<ScButton onClick={onRequestClose}>
								{__('Cancel', 'surecart')}
							</ScButton>
							<ScButton
								type="primary"
								submit
								disabled={
									loading ||
									fetching ||
									!data?.tax_zone ||
									data?.rate === undefined ||
									data?.rate === null ||
									data?.rate === ''
								}
							>
								{taxOverride?.id
									? __('Save', 'surecart')
									: __('Add Override', 'surecart')}
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
