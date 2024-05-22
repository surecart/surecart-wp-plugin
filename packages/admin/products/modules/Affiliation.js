/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import CommissionSidebarForm from '../../components/affiliates/commission/CommissionSidebarForm';
import GuideModal from '../../components/affiliates/commission/GuideModal';
import { ScButton } from '@surecart/components-react';

export default ({ product, loading }) => {
	if (!product?.id) {
		return null;
	}

	const [guide, setGuide] = useState(false);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const [saving, setSaving] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [commissionStructure, setCommissionStructure] = useState(
		product.commission_structure
	);

	const handleSubmit = async (e, commissionStructureData, message) => {
		try {
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'product'
			);

			setSaving(true);
			const productData = await apiFetch({
				path: addQueryArgs(`${baseURL}/${product?.id}`),
				method: 'PATCH',
				data: {
					commission_structure: commissionStructureData,
				},
			});

			receiveEntityRecords(
				'surecart',
				'product',
				{
					...productData,
					commission_structure: productData?.commission_structure,
				},
				undefined,
				false,
				{
					commission_structure: productData?.commission_structure,
				}
			);

			setCommissionStructure(productData.commission_structure);

			createSuccessNotice(message, {
				type: 'snackbar',
			});

			setModal(false);
		} catch (error) {
			console.error(error);
			setError(error);
		} finally {
			setSaving(false);
		}
	};

	const onChange = (data) =>
		setCommissionStructure(data?.commission_structure);

	const onDelete = async (e) => {
		await handleSubmit(
			e,
			null,
			__('Affiliate commission deleted.', 'surecart')
		);
	};

	const commissionTitleRender = () => {
		return (
			<>
				{__('Custom Affiliate Commission', 'surecart')}
				<ScButton
					onClick={() => setGuide(true)}
					size="small"
					circle
					type="text"
				>
					<sc-icon
						name="help-circle"
						style={{ fontSize: '14px', opacity: '0.65' }}
					></sc-icon>
				</ScButton>
			</>
		);
	};

	return (
		<>
			<CommissionSidebarForm
				headerTitle={commissionTitleRender()}
				formTitle={
					commissionStructure?.id
						? __('Edit Commission', 'surecart')
						: __('Add Commission', 'surecart')
				}
				submitButtonTitle={__('Save', 'surecart')}
				onSubmitMessage={
					commissionStructure?.id
						? __('Affiliate commission updated.', 'surecart')
						: __('Affiliate commission added.', 'surecart')
				}
				loading={loading || saving}
				commissionStructure={commissionStructure}
				modal={modal}
				setModal={setModal}
				onDelete={onDelete}
				error={error}
				setError={setError}
				onChange={onChange}
				onSubmit={handleSubmit}
			/>

			<GuideModal
				open={guide}
				onRequestClose={() => setGuide(false)}
				title={__('Custom product affiliate settings', 'surecart')}
				description={
					<>
						<p>
							{__(
								'This setting will overwrite any global or individual affiliate settings for this product.',
								'surecart'
							)}
						</p>
						<p>
							<strong>{__('Priority', 'surecart')}</strong>
						</p>
						<ol>
							<li>
								{__(
									'Global Affiliate Commissions (Lowest)',
									'surecart'
								)}
							</li>
							<li>
								{__(
									'Individual Affiliate Commissions',
									'surecart'
								)}
							</li>
							<li>
								<strong
									style={{
										color: 'var(--sc-color-primary-500)',
									}}
								>
									{__(
										'Individual Product Commissions',
										'surecart'
									)}
								</strong>
							</li>
							<li>
								{__(
									'Individual Affiliate Product Commissions (Highest)',
									'surecart'
								)}
							</li>
						</ol>
					</>
				}
			/>
		</>
	);
};
