/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useReducer, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';

import CreateTemplate from '../templates/CreateModel';
import {
	ScButton,
	ScCard,
	ScForm,
	ScFormControl,
} from '@surecart/components-react';
import Box from '../ui/Box';
import ModelSelector from '../components/ModelSelector';
import Error from '../components/Error';
import { DateTimePicker } from '@wordpress/components';

export default () => {
	const { saveEntityRecord } = useDispatch(coreStore);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(false);
	const [payout, setPayout] = useReducer(
		(currentState, newState) => {
			return { ...currentState, ...newState };
		},
		{
			affiliation: '',
			end_date: Math.round(new Date().getTime() / 1000),
		}
	);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setError(false);
			setIsSaving(true);
			const savedPayout = await saveEntityRecord(
				'surecart',
				'payout',
				payout,
				{ throwOnError: true }
			);

			if (!savedPayout?.id) {
				throw {
					message: __(
						'Could not create payout. Please try again.',
						'surecart'
					),
				};
			}

			window.location.href = addQueryArgs('admin.php', {
				page: 'sc-affiliate-payouts',
			});
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
					title={__('Create New Payout', 'surecart')}
					css={css`
						max-width: 500px;
						margin: auto;
					`}
					footer={
						<div
							css={css`display: flex gap: var(--sc-spacing-small);`}
						>
							<ScButton type="primary" submit loading={isSaving}>
								{__('Create', 'surecart')}
							</ScButton>
							<ScButton
								href={addQueryArgs('admin.php', {
									page: 'sc-affiliate-payouts',
								})}
								type="text"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
						</div>
					}
				>
					<Error error={error} />

					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ModelSelector
							label={__('Affiliate', 'surecart')}
							name="affiliation"
							value={payout.affiliation}
							requestQuery={{
								archived: false,
							}}
							onSelect={(affiliation) => {
								setPayout({
									affiliation,
								});
							}}
							display={(affiliation) =>
								`${affiliation.display_name} - ${affiliation.email}`
							}
							required
						/>
						<div
							css={css`
								margin-top: var(--sc-spacing-large);
							`}
						>
							<ScFormControl required>
								{__('Period End', 'surecart')}
							</ScFormControl>
							<ScCard>
								<DateTimePicker
									currentDate={
										new Date(payout.end_date * 1000)
									}
									isInvalidDate={(date) =>
										Date.parse(date) > Date.now()
									}
									onChange={(end_date) =>
										setPayout({
											end_date:
												Date.parse(new Date(end_date)) /
												1000,
										})
									}
								/>
							</ScCard>
						</div>
					</div>
				</Box>
			</ScForm>
		</CreateTemplate>
	);
};
