/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useReducer, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import CreateTemplate from '../templates/CreateModel';
import {
	ScButton,
	ScForm,
	ScPriceInput,
	ScTextarea,
} from '@surecart/components-react';
import Box from '../ui/Box';
import ModelSelector from '../components/ModelSelector';
import Error from '../components/Error';

export default ({ onCreateReferral }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [referral, setReferral] = useReducer(
		(currentState, newState) => {
			return { ...currentState, ...newState };
		},
		{
			commission_amount: '',
			description: '',
			affiliation: '',
		}
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const savedReferral = await saveEntityRecord(
				'surecart',
				'referral',
				referral,
				{ throwOnError: true }
			);

			if (!savedReferral?.id) {
				throw {
					message: __(
						'Could not create referral. Please try again.',
						'surecart'
					),
				};
			}
			onCreateReferral(savedReferral.id);
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate>
			<ScForm onScSubmit={onSubmit}>
				<Box
					title={__('Create New Referral', 'surecart')}
					footer={
						<div>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={'admin.php?page=sc-affiliate-referrals'}
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					}
				>
					<Error error={error} setError={setError} />
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ModelSelector
							label={__('Affiliate', 'surecart')}
							name="affiliation"
							value={referral.affiliation}
							requestQuery={{
								archived: false,
							}}
							onSelect={(affiliation) => {
								setReferral({
									affiliation,
								});
							}}
							display={(affiliation) =>
								`${affiliation.display_name} - ${affiliation.email}`
							}
							required
						/>

						<ScPriceInput
							label={__('Commission Amount', 'surecart')}
							placeholder={__('Enter an Amount', 'surecart')}
							currencyCode={scData.currency_code}
							value={referral.commission_amount}
							onScInput={(e) => {
								setReferral({
									commission_amount: e.target.value,
								});
							}}
							required
						/>

						<ScTextarea
							label={__('Description', 'surecart')}
							onScChange={(e) =>
								setReferral({
									description: e.target.value,
								})
							}
							value={referral?.description}
							name="description"
							placeholder={__(
								'A brief description of what this referral is for.',
								'surecart'
							)}
						/>
					</div>
				</Box>
			</ScForm>
		</CreateTemplate>
	);
};
