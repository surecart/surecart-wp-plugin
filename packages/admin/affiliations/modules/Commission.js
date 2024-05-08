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
import { ScButton } from '@surecart/components-react';
import GuideModal from '../../components/affiliates/commission/GuideModal';

export default ({ affiliation, loading }) => {
	if (!affiliation?.id) {
		return null;
	}

	const [guide, setGuide] = useState(false);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const [saving, setSaving] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [commissionStructure, setCommissionStructure] = useState(
		affiliation.commission_structure
	);

	const handleSubmit = async (e, commissionStructureData, message) => {
		try {
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'affiliation'
			);

			setSaving(true);
			const affiliationData = await apiFetch({
				path: addQueryArgs(`${baseURL}/${affiliation?.id}`),
				method: 'PATCH',
				data: {
					commission_structure: commissionStructureData,
				},
			});

			receiveEntityRecords(
				'surecart',
				'affiliation',
				{
					...affiliationData,
					commission_structure: affiliationData?.commission_structure,
				},
				undefined,
				false,
				{
					commission_structure: affiliationData?.commission_structure,
				}
			);

			setCommissionStructure(affiliationData.commission_structure);

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
				{__('Custom Commission', 'surecart')}

				<ScButton
					onClick={() => setGuide(true)}
					size="small"
					circle
					type="text"
				>
					<sc-icon
						name="help-circle"
						style={{ fontSize: '18px' }}
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
				emptyCommissionMessage={__(
					'Add a custom commission for this affiliate.',
					'surecart'
				)}
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
				title={__('Payment rules for specific people', 'surecart')}
				description={__(
					'These settings let you change the payment rules for specific people. You can decide different payment amounts and rules that are more suitable for certain affiliates, overriding the global settings.',
					'surecart'
				)}
			/>
		</>
	);
};
