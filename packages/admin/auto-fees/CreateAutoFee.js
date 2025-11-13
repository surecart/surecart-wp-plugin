/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect, useRef } from 'react';

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
	const [currentTemplate, setCurrentTemplate] = useState('');
	const [error, setError] = useState('');
	const { saveEntityRecord } = useDispatch(coreStore);
	const nameInputRef = useRef(null);

	useEffect(() => {
		if (nameInputRef.current) {
			setTimeout(() => {
				nameInputRef.current.triggerFocus();
			}, 250);
		}
	}, []);

	const getTemplateChoices = () => {
		return Object.entries(templates).map(([key, template]) => ({
			label: template?.name || key,
			value: key,
			description: template?.description,
			icon: template?.icon,
			fee_target: template?.fee_target,
		}));
	};

	useEffect(() => {
		const currentTarget =
			getTemplateChoices()?.find((t) => t.value === currentTemplate)
				?.fee_target || '';
		setAutoFeeTarget(currentTarget);
	}, [currentTemplate]);

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
					start_at: Math.floor(Date.now() / 1000),
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

	const isTargetEditable = currentTemplate === 'start_blank';

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
								{__('Continue', 'surecart')}
								<ScIcon slot="suffix" name="arrow-right" />
							</ScButton>
						</div>
					}
				>
					<ScInput
						label={__('Name', 'surecart')}
						help={__(
							'Your dynamic price name. This will be displayed to the customer.',
							'surecart'
						)}
						value={autoFeeName}
						onScInput={(e) => setAutoFeeName(e.target.value)}
						required
						tabIndex="0"
						ref={nameInputRef}
						autofocus
					/>
					<div
						style={{
							maxHeight: '480px',
							padding: '0 10px',
							margin: '0 -10px',
							overflow: 'auto',
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
							position: 'relative',
						}}
					>
						<ScChoices
							label={__('Recipe', 'surecart')}
							onScChange={(e) =>
								setCurrentTemplate(e.target.value)
							}
							style={{
								'--sc-choice-padding': '1.3em',
								'--columns': 2,
								padding: '0 1px',
							}}
							required
						>
							{(getTemplateChoices() || []).map((template) => {
								return (
									<ScChoice
										key={template.value}
										showControl={false}
										checked={
											currentTemplate === template.value
										}
										value={template.value}
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
						<div
							css={css`
								&::before {
									content: '';
									position: absolute;
									top: -20px;
									left: 0;
									right: 0;
									height: 20px;
									background: linear-gradient(
										to top,
										rgba(255, 255, 255, 0.95),
										rgba(255, 255, 255, 0)
									);
									pointer-events: none;
								}
							`}
							style={{ position: 'sticky', bottom: 0 }}
						></div>
					</div>

					<ScChoices
						onScChange={(e) => setAutoFeeTarget(e.target.value)}
						style={{
							marginTop: '8px',
						}}
						required
					>
						<div
							style={{
								display: 'flex',
								width: '100%',
								justifyContent: 'space-between',
								flexWrap: 'nowrap',
							}}
						>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<label htmlFor="choices-2">
									{__('Applies To', 'surecart')}
									<span aria-hidden="true" class="required">
										{' '}
										*
									</span>
								</label>
								<span
									style={{
										color: '#6b7280',
										fontSize: '12px',
									}}
								>
									{__(
										'Choose who the fee applies to',
										'surecart'
									)}
								</span>
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									gap: '8px',
								}}
							>
								{(TYPE_CHOICES || []).map((type) => {
									const disabled =
										!isTargetEditable &&
										type.value !== autoFeeTarget;

									const showLock =
										!isTargetEditable &&
										type.value === autoFeeTarget;
									return (
										<ScChoice
											key={type.value}
											showControl={false}
											checked={
												autoFeeTarget === type.value
											}
											value={type.value}
											style={{
												'--sc-choice-padding': '10px',
												'--sc-choice-border-radius':
													'8px',
												pointerEvents: disabled
													? 'none'
													: 'auto',
											}}
											disabled={disabled}
										>
											<div
												style={{
													display: 'flex',
													gap: '1em',
													alignItems: 'center',
												}}
												slot="footer"
											>
												{showLock && (
													<ScIcon
														style={{
															fontWeight: '600',
															width: '20px',
															height: '20px',
														}}
														name="lock"
													/>
												)}
												{!showLock && (
													<ScIcon
														style={{
															fontWeight: '600',
															width: '20px',
															height: '20px',
														}}
														name={type.icon}
													/>
												)}

												<div
													style={{
														fontWeight: 600,
														lineHeight: 1,
													}}
												>
													{type.label}
												</div>
											</div>
										</ScChoice>
									);
								})}
							</div>
						</div>
					</ScChoices>
				</Box>
			</ScForm>
		</CreateTemplate>
	);
};
