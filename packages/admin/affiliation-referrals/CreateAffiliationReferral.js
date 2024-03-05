/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useReducer, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import CreateTemplate from '../templates/CreateModel';
import {
	ScAlert,
	ScButton,
	ScForm,
	ScFormControl,
	ScPriceInput,
} from '@surecart/components-react';
import Box from '../ui/Box';
import ModelSelector from '../components/ModelSelector';

export default ({ onCreateReferral }) => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [referral, setReferral] = useReducer(
		(currentState, newState) => {
			return { ...currentState, ...newState };
		},
		{
			commission_amount: 0,
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
			console.log(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>
			<Box title={__('Create New Referral', 'surecart')}>
				<ScForm onScSubmit={onSubmit}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScFormControl
							label={__('Affiliation', 'surecart')}
							required
						>
							<ModelSelector
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
									`${affiliation.first_name} ${affiliation.last_name}`
								}
							/>
						</ScFormControl>

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

						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
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
					</div>
				</ScForm>
			</Box>
		</CreateTemplate>
	);
};
