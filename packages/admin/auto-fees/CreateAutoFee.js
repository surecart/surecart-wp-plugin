/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { getDate } from '@wordpress/date';
import { useState } from 'react';

import {
	ScAlert,
	ScButton,
	ScForm,
	ScChoice,
	ScChoices,
	ScInput,
	ScIcon,
} from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import templates from './templates';
import { TYPE_CHOICES } from './utils/constants';

export default ({ id, onCreateAutoFee }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [autoFeeName, setAutoFeeName] = useState('');
	const [autoFeeTarget, setAutoFeeTarget] = useState('');
	const [currentTemplate, setCurrentTemplate] = useState('start_blank');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);

	const getTemplateChoices = () => {
		return Object.entries(templates).map(([key, template]) => ({
			label: template?.name || key,
			value: key,
			description: template?.description,
			icon: template?.icon,
		}));
	};

	// create the auto-fee.
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsSaving(true);
			const createdAutoFee = await saveEntityRecord(
				'surecart',
				'auto-fee',
				{
					...templates?.[currentTemplate],
					name: autoFeeName,
					...(autoFeeTarget && { fee_target: autoFeeTarget }),
					start_at: Date.parse(getDate(new Date())) / 1000,
				},
				{ throwOnError: true }
			);
			if (!createdAutoFee?.id) {
				throw {
					message: __(
						'Could not create dynamic price. Please try again.',
						'surecart'
					),
				};
			}

			onCreateAutoFee(createdAutoFee.id);
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate id={id}>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>
			<ScForm onScSubmit={onSubmit}>
				<Box
					title={__('Create new dynamic price', 'surecart')}
					footer={
						<div
							css={css`
								display: flex;
								width: 100%;
								justify-content: space-between;
							`}
						>
							<ScButton
								href={'admin.php?page=sc-auto-fees'}
								type="default"
							>
								{__('Cancel', 'surecart')}
							</ScButton>
							<ScButton
								type="primary"
								submit
								loading={isSaving}
								disabled={!autoFeeName}
							>
								{__('Create', 'surecart')}
							</ScButton>
						</div>
					}
				>
					<ScInput
						label={__('Name', 'surecart')}
						help={__("Your dynamic price's name.", 'surecart')}
						value={autoFeeName}
						onScInput={(e) => setAutoFeeName(e.target.value)}
						required
						tabIndex="0"
						autofocus
					/>
					<ScChoices
						label={__('Recipe', 'surecart')}
						onScChange={(e) => setCurrentTemplate(e.target.value)}
						style={{
							'--sc-choice-padding': '1.3em',
							'--columns': 2,
							maxHeight: '250px',
							overflow: 'scroll',
							padding: '0 1px',
						}}
						required
					>
						{(getTemplateChoices() || []).map((template) => {
							return (
								<ScChoice
									key={template.value}
									showControl={false}
									checked={currentTemplate === template.value}
									value={template.value}
								>
									<div
										style={{ display: 'flex', gap: '1em' }}
										slot="footer"
									>
										<ScIcon
											style={{
												fontWeight: '600',
												width: '20px',
												height: '20px',
											}}
											name={template.icon}
										/>
										<div>
											<div
												style={{
													fontWeight: 600,
													lineHeight: 1,
												}}
											>
												{template.label}
											</div>
											{!!template.description && (
												<div
													style={{
														marginTop: '0.5em',
														fontWeight: 400,
														color: '#6B7280',
													}}
												>
													{template.description}
												</div>
											)}
										</div>
									</div>
								</ScChoice>
							);
						})}
					</ScChoices>
					{'start_blank' === currentTemplate && (
						<ScChoices
							label={__('Applies To', 'surecart')}
							onScChange={(e) => setAutoFeeTarget(e.target.value)}
							style={{
								'--sc-choice-padding': '1.3em',
								'--columns': 2,
								marginTop: '8px',
							}}
							required
						>
							{(TYPE_CHOICES || []).map((type) => {
								return (
									<ScChoice
										key={type.value}
										showControl={false}
										checked={autoFeeTarget === type.value}
										value={type.value}
									>
										<div
											style={{
												display: 'flex',
												gap: '1em',
											}}
											slot="footer"
										>
											<ScIcon
												style={{
													fontWeight: '600',
													width: '20px',
													height: '20px',
												}}
												name={type.icon}
											/>
											<div>
												<div
													style={{
														fontWeight: 600,
														lineHeight: 1,
													}}
												>
													{type.label}
												</div>
												<div
													style={{
														marginTop: '0.5em',
														fontWeight: 400,
														color: '#6B7280',
													}}
												>
													{type.description}
												</div>
											</div>
										</div>
									</ScChoice>
								);
							})}
						</ScChoices>
					)}
				</Box>
			</ScForm>
		</CreateTemplate>
	);
};
